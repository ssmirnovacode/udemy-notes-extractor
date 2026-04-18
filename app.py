import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from pathlib import Path
import tiktoken

load_dotenv(override=True)

openai_api_key = os.getenv("OPENAI_API_KEY")

MODEL = "gpt-4.1-mini"
client = OpenAI()

base_dir = Path(__file__).resolve().parent
input_path = base_dir / "input.md"
with open(input_path, "r", encoding="utf-8") as f:
    md_content = f.read()


def count_tokens(text, model=MODEL):
    enc = tiktoken.encoding_for_model(model)
    return len(enc.encode(text))


tokens = count_tokens(md_content)
print(f"Tokens: {tokens}")


response = client.responses.create(
    model=MODEL,
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Improve and restructure these notes.  Remove the chapter numbers (they usually come after ## or ### markdown characters). Remove the timestamps information. Return markdown.",
                },
                {"type": "input_text", "text": md_content},
            ],
        }
    ],
)
result_text = response.output[0].content[0].text

result_text = result_text.replace("```markdown", "").replace("```", "")


output_path = base_dir / "result.md"

with open(output_path, "w", encoding="utf-8") as f:
    f.write(result_text)
