"""
chronotrack_terminal.py
-----------------------------------
Forensic research & case analysis using Gemini 2.5 Flash (no Flask).
You type file paths, it sends all evidence in one multimodal API call,
and prints structured JSON describing transcripts, entities, events, timeline, etc.
"""

import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# initialize Gemini client
client = genai.Client(api_key=API_KEY)
MODEL = "gemini-2.5-flash"

# ------------------ helper schema ------------------
def build_response_schema():
    return {
        "type": "object",
        "properties": {
            "transcripts": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "speaker": {"type": "string"},
                        "timestamp": {"type": "string"},
                        "text": {"type": "string"}
                    },
                    "required": ["text"]
                }
            },
            "entities": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "type": {"type": "string"},
                        "confidence": {"type": "number"}
                    },
                    "required": ["name", "type"]
                }
            },
            "events": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "actor": {"type": "string"},
                        "action": {"type": "string"},
                        "object": {"type": "string"},
                        "time": {"type": "string"},
                        "location": {"type": "string"}
                    },
                    "required": ["action"]
                }
            },
            "links": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "source": {"type": "string"},
                        "target": {"type": "string"},
                        "relation": {"type": "string"}
                    },
                    "required": ["source", "target"]
                }
            },
            "timeline": {
                "type": "array",
                "items": {"type": "string"}
            },
            "summary": {"type": "string"},
            "open_questions": {
                "type": "array",
                "items": {"type": "string"}
            }
        },
        "required": ["transcripts", "entities", "events", "timeline", "summary"]
    }


# ------------------ helper: convert file to part ------------------
def file_to_part(path):
    """Return a types.Part or uploaded file ref depending on size"""
    with open(path, "rb") as f:
        data = f.read()
    size = len(data)
    mime = "application/octet-stream"
    ext = os.path.splitext(path)[1].lower()
    if ext in [".txt", ".log", ".csv", ".json"]:
        mime = "text/plain"
    elif ext in [".jpg", ".jpeg"]:
        mime = "image/jpeg"
    elif ext == ".png":
        mime = "image/png"
    elif ext in [".mp3", ".wav", ".m4a"]:
        mime = "audio/mpeg"
    elif ext == ".pdf":
        mime = "application/pdf"

    # Inline if small
    if size < 20 * 1024 * 1024:
        return types.Part.from_bytes(data=data, mime_type=mime)
    else:
        uploaded = client.files.upload(file=path)
        return uploaded

# ------------------ main logic ------------------
def main():
    print("🕵️‍♂️ ChronoTrack Forensic Analyzer (Terminal Edition)")
    print("Enter paths of files to analyze (text, images, audio).")
    print("Type 'done' when finished.\n")

    file_paths = []
    while True:
        p = input("Path> ").strip('" ').strip()
        if p.lower() == "done":
            break
        if os.path.isfile(p):
            file_paths.append(p)
        else:
            print("⚠️  File not found, try again.")

    if not file_paths:
        print("No files given. Exiting.")
        return

    case_id = input("\nCase ID (optional): ") or "CASE-001"
    investigator = input("Investigator name (optional): ") or "Unknown"

    case_meta = {"case_id": case_id, "investigator": investigator}
    contents = [
        f"""
You are a forensic AI assistant. You will receive multiple evidence files.
Tasks:
 - Transcribe/OCR each file (include timestamps if possible)
 - Extract named entities (people, locations, orgs, objects, dates)
 - Detect events (who did what when)
 - Build a timeline and cross-links between events/entities
 - Write a concise summary and open investigative questions.

Return only JSON that matches the schema provided.
Case metadata: {json.dumps(case_meta)}
        """,
        "FILES:\n" + "\n".join(os.path.basename(p) for p in file_paths)
    ]

    # add file parts
    for path in file_paths:
        contents.append(file_to_part(path))

    config = {
        "response_mime_type": "application/json",
        "response_schema": build_response_schema(),
        "max_output_tokens": 3000,
        "temperature": 0.0,
    }

    print("\n⏳ Sending evidence to Gemini 2.5 Flash...")
    try:
        resp = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=config
        )
    except Exception as e:
        print(f"❌ API call failed: {e}")
        return

    # try to extract JSON
    text = getattr(resp, "text", None)
    if not text and hasattr(resp, "candidates"):
        try:
            text = resp.candidates[0].content.parts[0].text
        except Exception:
            pass

    if not text:
        print("⚠️  No text in response:")
        print(resp)
        return

    try:
        result = json.loads(text)
    except Exception:
        print("⚠️  Model did not return valid JSON; raw text below:\n")
        print(text)
        return

    print("\n✅ Gemini 2.5 Flash Forensic Analysis Result:\n")
    print(json.dumps(result, indent=2, ensure_ascii=False))

    # optionally save to disk
    out_path = "chrono_result.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"\n🗂️  Saved structured JSON to {out_path}")

if __name__ == "__main__":
    main()
