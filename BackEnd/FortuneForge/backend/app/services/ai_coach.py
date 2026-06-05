import os

from google import genai
from dotenv import load_dotenv

load_dotenv()

# Instantiate Gemini client if API key is present, otherwise we'll run a fallback mock response
api_key = os.getenv("GEMINI_API_KEY")
client = None
if api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Error initializing Gemini client: {e}")

def get_ai_advice(
    income,
    invested,
    percent,
    xp,
    level
):
    if not client:
        return "[DEMO] Keep tracking your income and investments! Focus on building your Budget Shield."

    prompt = f"""
    You are FortuneForge AI Coach.

    User Stats:
    Monthly Income: ₹{income}
    Total Invested: ₹{invested}
    Investment Percentage: {percent}%
    XP: {xp}
    Level: {level}

    Give:
    1. A short encouragement.
    2. One improvement tip.
    3. One gamified challenge.

    Keep it under 100 words.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"[DEMO] Keep up the great work! Let's continue scaling your financial quest. (Gemini error: {e})"

def generate_chat_response(
    message: str,
    user_context: dict
) -> str:
    if not client:
        msg_lower = message.lower()
        name = user_context.get('name', 'Squire')
        income = user_context.get('income', 0)
        expenses = user_context.get('expenses', 0)
        risk_profile = user_context.get('risk_profile', 'Balanced')
        char_class = user_context.get('character_class', 'Compounding Squire')
        level = user_context.get('level', 1)
        xp = user_context.get('xp', 350)
        
        if "budget" in msg_lower or "shield" in msg_lower or "emergency" in msg_lower:
            return (
                f"Squire {name}, to fortify your Budget Shield, "
                f"aim to stack 3 months of essential expenses (${expenses * 3:.0f}). "
                f"Use the 'Deposit' button on your dashboard to add funds and earn XP!"
            )
        elif "invest" in msg_lower or "stock" in msg_lower or "fund" in msg_lower or "allocation" in msg_lower:
            surplus = max(0, income - expenses)
            return (
                f"As a level {level} {char_class}, your risk profile aligns with a {risk_profile} playstyle. "
                f"Consider allocating a portion of your monthly surplus (${surplus:.0f}) "
                f"towards assets matching this profile. Complete your weekly 'Copper Coin' or class-specific quests to unlock real gains!"
            )
        elif "debt" in msg_lower or "loan" in msg_lower or "pay" in msg_lower:
            debt_est = expenses * 0.15
            return (
                f"Reducing debt is like gaining a passive shield buff, {name}! Your active monthly debt burden is estimated at "
                f"${debt_est:.0f}. Click 'Pay off Debt' on your dashboard to restore your Cash Flow Mana!"
            )
        elif "quest" in msg_lower or "xp" in msg_lower or "level" in msg_lower:
            return (
                f"You are currently Level {level} with {xp} XP. "
                f"Check your AI Quest Board to claim financial challenges like the Copper Coin Challenge to level up and increase your commitment score!"
            )
        else:
            return (
                f"Greetings, {name}! I am your AI Coach running in Demo Mode (no GEMINI_API_KEY detected). "
                f"But I see you are a Level {level} {char_class} with a monthly income of ${income:.0f}! "
                f"Ask me about 'budgeting', 'investing', 'debt', or 'quests', and I will give you RPG-styled advice!"
            )

    prompt = f"""
    You are the FortuneForge AI Coach, a supportive and helpful personal finance advisor.
    The user is logged into the FortuneForge gamified dashboard. 
    Here is their profile information and financial stats:
    - Name: {user_context.get('name', 'Squire')}
    - Email: {user_context.get('email', '')}
    - Character Class: {user_context.get('character_class', 'Compounding Squire')}
    - Level: {user_context.get('level', 1)}
    - XP: {user_context.get('xp', 350)}
    - Monthly Income: ${user_context.get('income', 0)}
    - Monthly Expenses: ${user_context.get('expenses', 0)}
    - Risk Profile: {user_context.get('risk_profile', 'Balanced')}

    Please answer the user's question or help request. 
    Incorporate gamified retro RPG terminology where appropriate (e.g. refer to their emergency fund as "Budget Shield", their savings rate/cash flow as "Mana", and their progress as XP/levels).
    Keep your response concise, friendly, and actionable.

    User's Question:
    "{message}"
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return (
            f"I hear you, {user_context.get('name', 'Squire')}. I encountered a slight mana interruption (Gemini error: {e}). "
            f"However, remember to keep your essential expenses (${user_context.get('expenses', 0)}) under control and defend your Budget Shield!"
        )