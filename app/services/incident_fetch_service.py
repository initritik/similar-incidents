from typing import Dict

from app.api.routes.incidents import MOCK_INCIDENTS
from app.schemas.incident import IncidentRecord


def fetch_incident_by_identifier(identifier: Dict[str, str]) -> IncidentRecord:
    """Fetch a mock incident by parsed sys_id or incident number."""

    # This intentionally searches the existing mock incident source. It mimics
    # the workflow we would later replace with a real ServiceNow API lookup
    # without adding real ServiceNow credentials, auth, or network calls yet.
    identifier_type = identifier.get("type")
    identifier_value = identifier.get("value")

    if identifier_type not in {"sys_id", "number"} or not identifier_value:
        raise ValueError("Invalid incident identifier.")

    for incident in MOCK_INCIDENTS:
        if identifier_type == "sys_id" and incident.sys_id == identifier_value:
            return incident

        if identifier_type == "number" and incident.number.upper() == identifier_value.upper():
            return incident

    raise LookupError("Incident not found in mock incident source.")
