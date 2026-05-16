from typing import Any, Dict

from fastapi import APIRouter, HTTPException, Query

from app.api.routes.incidents import MOCK_INCIDENTS
from app.services.ingestion_service import ingest_incidents


router = APIRouter()


@router.post("/ingest/incidents", response_model=Dict[str, Any])
def ingest_mock_incidents(
    limit: int = Query(default=10, ge=1),
    offset: int = Query(default=0, ge=0),
):
    """Trigger ingestion of paginated mock incidents into Qdrant."""

    # In POCs, ingestion is often triggered by an API so developers can manually
    # test sync behavior, inspect failures, and re-run small batches without
    # setting up schedulers, workers, or production orchestration too early.
    try:
        fetched_incidents = MOCK_INCIDENTS[offset : offset + limit]
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch mock incidents for ingestion.",
        ) from exc

    if not fetched_incidents:
        return {
            "status": "success",
            "message": "No incidents found for the requested page",
            "total_fetched": 0,
            "total_ingested": 0,
            "failed": 0,
        }

    try:
        # This endpoint is useful during testing and manual sync because it
        # exercises the full normalization, embedding, and Qdrant insertion path
        # using a controlled slice of mock ServiceNow data.
        summary = ingest_incidents(fetched_incidents)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Incident ingestion failed.",
        ) from exc

    # In production, this kind of trigger would usually move behind a scheduled
    # job, background task, message queue, or workflow runner. Keeping it as an
    # explicit API for now makes the POC easy to test step by step.
    failed_count = summary["failed"] + summary["skipped"]

    if failed_count > 0:
        return {
            "status": "partial_success",
            "message": "Incident ingestion completed with failures",
            "total_fetched": len(fetched_incidents),
            "total_ingested": summary["inserted"],
            "failed": failed_count,
        }

    return {
        "status": "success",
        "message": "Incidents ingested successfully",
        "total_fetched": len(fetched_incidents),
        "total_ingested": summary["inserted"],
        "failed": failed_count,
    }
