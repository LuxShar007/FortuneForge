import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_forge_key';

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// 1. Email/Password Registration
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate default name and profile picture from email
    const username = email.split('@')[0];
    const name = username.charAt(0).toUpperCase() + username.slice(1);
    const profilePicture = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;

    // Insert user
    const result = await db.run(
      'INSERT INTO users (email, password_hash, name, profile_picture) VALUES (?, ?, ?, ?)',
      [email, passwordHash, name, profilePicture]
    );

    // Generate JWT
    const token = jwt.sign({ id: result.lastID, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: result.lastID,
        email,
        name,
        profilePicture,
        baselineConfigured: false,
        xp: 350,
        completedQuests: []
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// 2. Email/Password Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !user.password_hash) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        profilePicture: user.profile_picture || '',
        baselineConfigured: !!user.baseline_configured,
        income: user.income,
        expenses: user.expenses,
        riskProfile: user.risk_profile,
        characterClass: user.character_class,
        xp: user.xp !== null ? user.xp : 350,
        completedQuests: user.completed_quests ? user.completed_quests.split(',').filter(Boolean) : []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// 3. Google/Microsoft Unified OAuth Handler
app.post('/api/auth/oauth', async (req, res) => {
  const { provider, email, externalId, name, token: providerToken } = req.body;

  if (!provider || !email || !externalId) {
    return res.status(400).json({ error: 'Provider, email, and external ID are required' });
  }

  try {
    let isVerified = false;
    const isGoogle = provider.toLowerCase() === 'google';
    const clientKey = isGoogle ? process.env.GOOGLE_CLIENT_ID : process.env.MICROSOFT_CLIENT_ID;

    // Verify OAuth Token if client ID/secret are configured, otherwise fall back to Demo Mode
    if (clientKey) {
      try {
        if (isGoogle) {
          // Google Token Verification (handles both id_token and access_token)
          const verifyUrl = providerToken.startsWith('ya29.')
            ? `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${providerToken}`
            : `https://oauth2.googleapis.com/tokeninfo?id_token=${providerToken}`;
          const response = await fetch(verifyUrl);
          const data = await response.json();
          if (data && data.email === email) {
            isVerified = true;
          }
        } else {
          // Microsoft Token Verification (calls graph.microsoft.com/v1.0/me using Bearer token)
          const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${providerToken}` }
          });
          const data = await response.json();
          if (data && (data.mail === email || data.userPrincipalName === email)) {
            isVerified = true;
          }
        }
      } catch (verificationError) {
        console.error(`${provider} OAuth verification failed:`, verificationError);
      }
    } else {
      // Demo Mode: Console client IDs not configured, bypass verification for easier testing
      console.log(`[DEMO MODE] Bypassing ${provider} token verification for: ${email}`);
      isVerified = true;
    }

    if (!isVerified) {
      return res.status(401).json({ error: 'OAuth identity verification failed' });
    }

    // Check if user exists by email or provider-specific ID
    let user = await db.get(
      isGoogle
        ? 'SELECT * FROM users WHERE google_id = ? OR email = ?'
        : 'SELECT * FROM users WHERE microsoft_id = ? OR email = ?',
      [externalId, email]
    );

    // Generate fallback profile picture if missing
    const usernameForPic = email.split('@')[0];
    const fallbackPic = `https://api.dicebear.com/7.x/adventurer/svg?seed=${usernameForPic}`;
    const profilePicToSave = req.body.picture || fallbackPic;
    const nameToSave = name || usernameForPic.charAt(0).toUpperCase() + usernameForPic.slice(1);

    if (user) {
      // Update external ID and name/pic if missing
      if (isGoogle && !user.google_id) {
        await db.run('UPDATE users SET google_id = ?, name = COALESCE(NULLIF(name, ""), ?), profile_picture = COALESCE(NULLIF(profile_picture, ""), ?) WHERE id = ?', [externalId, nameToSave, profilePicToSave, user.id]);
      } else if (!isGoogle && !user.microsoft_id) {
        await db.run('UPDATE users SET microsoft_id = ?, name = COALESCE(NULLIF(name, ""), ?), profile_picture = COALESCE(NULLIF(profile_picture, ""), ?) WHERE id = ?', [externalId, nameToSave, profilePicToSave, user.id]);
      }
      // Reload user
      user = await db.get('SELECT * FROM users WHERE id = ?', [user.id]);
    } else {
      // Create new OAuth user
      const insertSql = isGoogle
        ? 'INSERT INTO users (email, google_id, name, profile_picture) VALUES (?, ?, ?, ?)'
        : 'INSERT INTO users (email, microsoft_id, name, profile_picture) VALUES (?, ?, ?, ?)';
      const result = await db.run(insertSql, [email, externalId, nameToSave, profilePicToSave]);
      user = {
        id: result.lastID,
        email,
        name: nameToSave,
        profile_picture: profilePicToSave,
        baseline_configured: 0,
        income: 0,
        expenses: 0,
        risk_profile: '',
        character_class: '',
        xp: 350,
        completed_quests: ''
      };
    }

    // Generate app JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || nameToSave,
        profilePicture: user.profile_picture || profilePicToSave,
        baselineConfigured: !!user.baseline_configured,
        income: user.income,
        expenses: user.expenses,
        riskProfile: user.risk_profile,
        characterClass: user.character_class,
        xp: user.xp !== null ? user.xp : 350,
        completedQuests: user.completed_quests ? user.completed_quests.split(',').filter(Boolean) : []
      }
    });
  } catch (error) {
    console.error('OAuth processing error:', error);
    res.status(500).json({ error: 'Internal server error during OAuth processing' });
  }
});

// 4. Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, email, income, expenses, risk_profile, character_class, baseline_configured, xp, completed_quests FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        profilePicture: user.profile_picture || '',
        baselineConfigured: !!user.baseline_configured,
        income: user.income,
        expenses: user.expenses,
        riskProfile: user.risk_profile,
        characterClass: user.character_class,
        xp: user.xp !== null ? user.xp : 350,
        completedQuests: user.completed_quests ? user.completed_quests.split(',').filter(Boolean) : []
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Update User Baseline Configuration
app.post('/api/user/baseline', authenticateToken, async (req, res) => {
  const { income, expenses, riskProfile, characterClass } = req.body;

  if (income === undefined || expenses === undefined || !riskProfile || !characterClass) {
    return res.status(400).json({ error: 'Income, expenses, riskProfile, and characterClass are required' });
  }

  try {
    await db.run(
      `UPDATE users 
       SET income = ?, expenses = ?, risk_profile = ?, character_class = ?, baseline_configured = 1 
       WHERE id = ?`,
      [Number(income), Number(expenses), riskProfile, characterClass, req.user.id]
    );

    const updatedUser = await db.get('SELECT name, profile_picture, xp, completed_quests FROM users WHERE id = ?', [req.user.id]);
    res.json({
      message: 'Baseline configuration updated successfully',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: updatedUser.name || '',
        profilePicture: updatedUser.profile_picture || '',
        baselineConfigured: true,
        income: Number(income),
        expenses: Number(expenses),
        riskProfile,
        characterClass,
        xp: updatedUser.xp !== null ? updatedUser.xp : 350,
        completedQuests: updatedUser.completed_quests ? updatedUser.completed_quests.split(',').filter(Boolean) : []
      }
    });
  } catch (error) {
    console.error('Baseline update error:', error);
    res.status(500).json({ error: 'Internal server error during baseline update' });
  }
});

// 6. Sync User Progress (XP and completed quests)
app.post('/api/user/progress', authenticateToken, async (req, res) => {
  const { xp, completedQuests } = req.body;

  if (xp === undefined || !completedQuests) {
    return res.status(400).json({ error: 'XP and completedQuests are required' });
  }

  try {
    const questsStr = Array.isArray(completedQuests) ? completedQuests.join(',') : completedQuests;
    await db.run(
      'UPDATE users SET xp = ?, completed_quests = ? WHERE id = ?',
      [Number(xp), questsStr, req.user.id]
    );

    res.json({
      message: 'User progress synced successfully',
      xp: Number(xp),
      completedQuests: Array.isArray(completedQuests) ? completedQuests : questsStr.split(',').filter(Boolean)
    });
  } catch (error) {
    console.error('Progress sync error:', error);
    res.status(500).json({ error: 'Internal server error during progress sync' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`FortuneForge backend listening at http://localhost:${PORT}`);
});
