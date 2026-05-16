import json
from typing import Any, Dict, List

from openai import OpenAI, OpenAIError

from app.config.settings import settings


CHAT_MODEL = "gpt-4.1-mini"


SYSTEM_PROMPT = """
You are an incident support assistant.

Use only the retrieved incident data provided by the backend.
Do not invent incident numbers, symptoms, assignment groups, or resolutions.
Do not fabricate resolution steps if resolution notes are missing.
If the retrieved incidents do not contain enough information, say so clearly.

Your job is to:
- explain why the incidents are similar to the user's query
- identify recurring issues or assignment groups when present
- summarize resolution notes only when they are provided
- highlight the highest-similarity incident
- produce a concise, human-readable support response
"""


def _get_openai_client() -> OpenAI:
    """Create an OpenAI client for chat completions."""

    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "your_api_key_here":
        raise ValueError("OPENAI_API_KEY is not configured.")

    return OpenAI(api_key=settings.OPENAI_API_KEY)


def _serialize_incidents(similar_incidents: List[Dict[str, Any]]) -> str:
    """Convert retrieved incidents into compact JSON for the LLM prompt."""

    # Vector search gives us the most relevant records, but raw result objects
    # are not ideal for end users. The LLM receives a compact, explicit context
    # block so it can format the answer without guessing outside the data.
    return json.dumps(similar_incidents, indent=2)


def generate_incident_response(
    user_query: str,
    similar_incidents: list,
) -> str:
    """Generate a readable incident summary grounded in retrieved incidents."""

    # Vector search alone is not enough for a good user experience. It returns
    # matching records and scores, but users usually need a short explanation,
    # recurring patterns, and practical resolution clues.
    if not user_query or not user_query.strip():
        raise ValueError("user_query is required.")

    if not similar_incidents:
        raise ValueError("similar_incidents cannot be empty.")

    client = _get_openai_client()
    incident_context = _serialize_incidents(similar_incidents)

    user_prompt = f"""
User query:
{user_query.strip()}

Retrieved similar incidents:
{incident_context}

Write a concise response for a support user. Include:
- how many similar incidents were found
- the strongest recurring issue or pattern
- common resolution notes if present
- the highest similarity incident
"""

    try:
        # LLM summarization improves readability by turning retrieved incident
        # rows into an explanation. Grounding the prompt on retrieved incidents
        # reduces hallucinations because the model is instructed to use only the
        # records supplied by the retrieval layer.
        response = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT.strip()},
                {"role": "user", "content": user_prompt.strip()},
            ],
            temperature=0.2,
        )
    except OpenAIError as exc:
        raise RuntimeError("OpenAI chat completion request failed.") from exc

    if not response.choices:
        raise RuntimeError("OpenAI returned no chat completion choices.")

    message = response.choices[0].message
    content = message.content if message else None

    if not content or not content.strip():
        raise RuntimeError("OpenAI returned an empty incident response.")

    return content.strip()
