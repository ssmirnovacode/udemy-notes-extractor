# Udemy notes extractor

`udemy-notes-to-md.js` extracts your Udemy notes for a given course and downloads them in .md format.
Copy and paste it to the browser console to download the notes as `input.md`.

As the next step, optionally you can use LLM to organize and/or improve your notes.
Save `input.md` file into this directory. Add your OpenAI api key to `.env` as `OPENAI_API_KEY`. The code is using `gpt-4.1-mini`.
`uv run app.py` sends a request to LLM to improve the notes - correct errors, complete the notes etc and safes the result as `result.md`.
