from openai import OpenAI, OpenAIError

from app.config.settings import settings


EMBEDDING_MODEL = "text-embedding-3-small"


def _get_openai_client() -> OpenAI:
    """Create an OpenAI client using the API key from application settings."""

    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "your_api_key_here":
        raise ValueError("OPENAI_API_KEY is not configured.")

    # The current OpenAI Python SDK uses a client object instead of global
    # module-level calls. Keeping client creation isolated makes this service
    # easier to test and replace later.
    return OpenAI(api_key=settings.OPENAI_API_KEY)


def generate_embedding(text: str) -> list[float]:
    """Generate an embedding vector for normalized incident text."""

    # Embeddings are numeric vectors that represent the meaning of text. Similar
    # incidents should produce vectors that are close together, which is the
    # foundation for semantic similarity search.
    if not text or not text.strip():
        raise ValueError("Text is required to generate an embedding.")

    try:
        client = _get_openai_client()

        # We embed normalized incident text instead of raw JSON because labels,
        # ordering, and clean values help produce more consistent vector quality.
        # Raw JSON includes punctuation and nested structure that are useful for
        # machines, but less useful as semantic content.
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=text.strip(),
        )
    except OpenAIError as exc:
        raise RuntimeError("OpenAI embedding request failed.") from exc

    if not response.data or not response.data[0].embedding:
        raise RuntimeError("OpenAI returned an invalid embedding response.")

    embedding = response.data[0].embedding

    if not isinstance(embedding, list) or not all(
        isinstance(value, float) for value in embedding
    ):
        raise RuntimeError("OpenAI returned an embedding in an unexpected format.")

    # text-embedding-3-small is a good POC model because it is fast, capable, and
    # cost-efficient while still producing high-quality vectors for retrieval.
    return embedding
