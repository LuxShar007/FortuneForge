import os

from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def get_ai_advice(
    income,
    invested,
    percent,
    xp,
    level
):

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

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text