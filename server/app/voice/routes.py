from flask import Blueprint, request, jsonify
import speech_recognition as sr
from pydub import AudioSegment
from io import BytesIO

# ✅ Define blueprint BEFORE using it
voice_bp = Blueprint('voice_bp', __name__)

@voice_bp.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    audio_file = request.files.get('audio')
    if not audio_file:
        return jsonify({'message': 'Audio file required'}), 400

    print("➡️ File received:")
    print("  - Filename:", audio_file.filename)
    print("  - Content-Type:", audio_file.content_type)
    raw = audio_file.read()
    print("  - File Size (bytes):", len(raw))
    audio_file.seek(0)

    recognizer = sr.Recognizer()

    try:
        sound = AudioSegment.from_file(audio_file, format='webm')
        sound = sound.set_channels(1).set_frame_rate(16000)

        if sound.rms < 100:
            print("⚠️ Audio is silent or too quiet")
            return jsonify({'message': 'Audio is silent or too quiet'}), 400

        wav_io = BytesIO()
        sound.export(wav_io, format='wav')
        wav_io.seek(0)

        with open("converted_debug.wav", "wb") as f:
            f.write(wav_io.getvalue())

        with sr.AudioFile(wav_io) as source:
            print("🎧 Listening...")
            audio_data = recognizer.record(source)
            print("✅ Got audio data")

        text = recognizer.recognize_google(audio_data)
        print("✅ Transcription result:", text)
        return jsonify({'text': text})

    except sr.UnknownValueError:
        print("⚠️ Google Speech could not understand audio")
        return jsonify({'message': 'Could not understand audio'}), 400

    except Exception as e:
        print("❌ Error during processing:", e)
        return jsonify({'message': f'Error: {str(e)}'}), 500
