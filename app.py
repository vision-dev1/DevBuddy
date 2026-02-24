# Codes By Visionnn

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are Buddy AI, a friendly and supportive coding companion. You help developers with coding questions, provide encouragement, and keep responses concise and helpful. Be warm, human, and occasionally use emojis. Keep responses under 100 words unless explaining code."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.7,
            max_tokens=300
        )
        
        response = completion.choices[0].message.content
        return jsonify({'response': response})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/challenge', methods=['POST'])
def challenge():
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a coding challenge generator. Generate ONE beginner-friendly coding challenge. Format: Title on first line, then description. Keep it simple and practical. Focus on JavaScript, Python, or general programming concepts. Make it achievable in 15-30 minutes."
                },
                {
                    "role": "user",
                    "content": "Generate a new beginner coding challenge"
                }
            ],
            temperature=0.8,
            max_tokens=200
        )
        
        response = completion.choices[0].message.content
        lines = response.strip().split('\n', 1)
        title = lines[0].strip().replace('**', '').replace('#', '').strip()
        description = lines[1].strip() if len(lines) > 1 else "Build something amazing!"
        
        return jsonify({
            'title': title,
            'description': description
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mood', methods=['POST'])
def mood():
    try:
        data = request.get_json()
        feeling_good = data.get('feeling_good', True)
        
        if feeling_good:
            completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are Buddy AI. The user is feeling good. Respond with either a short humorous programming joke OR a motivational message. Keep it under 50 words. Be warm and encouraging."
                    },
                    {
                        "role": "user",
                        "content": "I'm doing good!"
                    }
                ],
                temperature=0.9,
                max_tokens=100
            )
        else:
            completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are Buddy AI. The user is not feeling good. Respond with empathy and encouragement. Acknowledge their struggle and offer gentle support. Keep it under 60 words. Be genuinely caring."
                    },
                    {
                        "role": "user",
                        "content": "I'm not doing so well..."
                    }
                ],
                temperature=0.7,
                max_tokens=120
            )
        
        response = completion.choices[0].message.content
        return jsonify({'response': response})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
