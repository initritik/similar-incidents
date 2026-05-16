import re
from typing import Dict
from urllib.parse import parse_qs, urlparse


INCIDENT_NUMBER_PATTERN = re.compile(r"\bINC\d{7}\b", re.IGNORECASE)
SYS_ID_PATTERN = re.compile(r"^[A-Za-z0-9]{6,32}$")


def extract_incident_identifier(input_text: str) -> Dict[str, str]:
    """Extract an incident sys_id or number from user input."""

    # Incident-link workflows are common in enterprise support teams because
    # analysts often paste a ServiceNow URL or ticket number into a tool and
    # expect the assistant to understand the incident context automatically.
    if not input_text or not input_text.strip():
        raise ValueError("Incident input cannot be empty.")

    value = input_text.strip()
    parsed_url = urlparse(value)

    if parsed_url.scheme and parsed_url.netloc:
        query_params = parse_qs(parsed_url.query)
        sys_id_values = query_params.get("sys_id", [])

        if sys_id_values:
            sys_id = sys_id_values[0].strip()

            if not SYS_ID_PATTERN.match(sys_id):
                raise ValueError("Malformed sys_id in incident link.")

            return {"type": "sys_id", "value": sys_id}

        incident_match = INCIDENT_NUMBER_PATTERN.search(value)
        if incident_match:
            return {"type": "number", "value": incident_match.group(0).upper()}

        raise ValueError("Incident link does not contain a sys_id or incident number.")

    incident_match = INCIDENT_NUMBER_PATTERN.fullmatch(value)
    if incident_match:
        return {"type": "number", "value": incident_match.group(0).upper()}

    raise ValueError("Input must be a ServiceNow incident link or incident number.")
