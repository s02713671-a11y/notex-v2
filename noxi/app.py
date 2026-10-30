# ==================== NOXI BACKEND ====================

import os
import requests

from flask_cors import CORS
from flask import Flask, request, jsonify


app = Flask(__name__)


# ==================== NOXI CONVERSATION MEMORY ====================

conversation_history = []


# ==================== CORS ====================

CORS(app, resources={
    r"/ask": {"origins": "*"},
    r"/short-notes": {"origins": "*"},
    r"/load-chat": {"origins": "*"},
    r"/new-chat": {"origins": "*"}
})


# ==================== GEMINI CONFIG ====================

api_key = os.getenv("GEMINI_API_KEY")

url = (
    "https://generativelanguage.googleapis.com/"
    "v1beta/models/gemini-3.5-flash-lite:generateContent"
)

headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": api_key
}


# ==================== MEMORY LIMIT ====================

MAX_HISTORY = 10


# ==================== ASK NOXI ====================

@app.route("/ask", methods=["POST"])
def ask_noxi():

    data = request.get_json()

    message = data.get("message", "").strip()


    # ==================== EMPTY MESSAGE ====================

    if not message:

        return jsonify({
            "reply": "Please ask me something 🤖"
        })


    # ==================== NOXI PERSONALITY ====================

    payload = {

        "system_instruction": {

            "parts": [

                {
                    "text": """
You are Noxi, a student-friendly AI study assistant.

Your name is Noxi.
Do not call yourself ChatGPT or OpenAI.
If asked your name, say that your name is Noxi.

Your main purpose is helping students learn.
Explain difficult topics in simple and clear language.
Keep answers concise unless the student asks for a detailed explanation.
Use examples when they help understanding.
For school subjects, prefer step-by-step explanations.

Be friendly, natural, and supportive.
Do not pretend to be a human.
"""
                }

            ]

        },

        "contents": conversation_history + [

            {
                "parts": [
                    {
                        "text": message
                    }
                ]
            }

        ]

    }


    # ==================== SEND TO GEMINI ====================

    response = requests.post(
        url,
        headers=headers,
        json=payload
    )
    print("Gemini Status:", response.status_code)
    print("Gemini Response:", response.text)

    result = response.json()


    # ==================== GET AI REPLY ====================

    if response.status_code != 200:

        print("Gemini Error:", result)

        return jsonify({
            "reply": "Gemini se response nahi mila."
        })


    reply = result["candidates"][0]["content"]["parts"][0]["text"]


    # ==================== SAVE CONVERSATION ====================

    conversation_history.append({

        "role": "user",

        "parts": [
            {
                "text": message
            }
        ]

    })


    conversation_history.append({

        "role": "model",

        "parts": [
            {
                "text": reply
            }
        ]

    })


    # ==================== LIMIT CONVERSATION MEMORY ====================

    if len(conversation_history) > MAX_HISTORY:

        del conversation_history[:-MAX_HISTORY]


    return jsonify({
        "reply": reply
    })


# ==================== SHORT NOTES ====================

@app.route("/short-notes", methods=["POST"])
def short_notes():

    data = request.get_json()

    text = data.get("text", "").strip()


    # ==================== EMPTY TEXT ====================

    if not text:

        return jsonify({
            "reply": "Please give me some text to make short notes."
        })


    # ==================== SHORT NOTES PROMPT ====================

    payload = {

        "system_instruction": {

            "parts": [

                {
                    "text": """
You are Noxi, a student-friendly AI study assistant.

Convert the student's given text into short, clear study notes.
Use simple language.
Keep important definitions, formulas, facts and key points.
Use headings and bullet points.
Do not add unrelated information.
"""
                }

            ]

        },

        "contents": [

            {
                "parts": [
                    {
                        "text": text
                    }
                ]
            }

        ]

    }


    # ==================== SEND TO GEMINI ====================

    response = requests.post(
        url,
        headers=headers,
        json=payload
    )

    result = response.json()


    # ==================== GET SHORT NOTES ====================

    if response.status_code != 200:

        print("Short Notes Error:", result)

        return jsonify({
            "reply": "Short notes nahi ban paaye."
        })


    reply = result["candidates"][0]["content"]["parts"][0]["text"]


    return jsonify({
        "reply": reply
    })

    # ==================== LOAD CHAT ====================

@app.route("/load-chat", methods=["POST"])
def load_chat():

    global conversation_history

    data = request.get_json()

    messages = data.get("messages", [])


    # ==================== CLEAR OLD MEMORY ====================

    conversation_history.clear()


    # ==================== LOAD CHAT MEMORY ====================

    for message in messages:

        role = message.get("role")
        text = message.get("text", "").strip()

        if not text:
            continue

        if role not in ["user", "model"]:
            continue

        conversation_history.append({

            "role": role,

            "parts": [
                {
                    "text": text
                }
            ]

        })


    # ==================== LIMIT MEMORY ====================

    if len(conversation_history) > MAX_HISTORY:

        del conversation_history[:-MAX_HISTORY]


    return jsonify({
        "reply": "Chat loaded."
    })


# ==================== NEW CHAT ====================

@app.route("/new-chat", methods=["POST"])
def new_chat():

    conversation_history.clear()

    return jsonify({
        "reply": "New chat started."
    })


# ==================== START SERVER ====================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5001
    )
