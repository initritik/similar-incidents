from typing import Any, Dict, List

from fastapi import APIRouter, Query

from app.schemas.incident import IncidentRecord, ReferenceField


router = APIRouter()


ASSIGNMENT_GROUPS = [
    ("Network Operations", "287ebd7da9fe198100f92cc8d1d2154e"),
    ("Email Support", "7f2a1c9e0b124af2a6e45018bcd401ab"),
    ("Application Support", "5b3d7d3c0f9c4ce196b4c16dbf0f3119"),
    ("Desktop Support", "0f61d3a12b5d48e7988fb9447f3e9ac2"),
    ("Security Operations", "31a22fb02f2e4e2e9653ceaa1c79d18f"),
]

INCIDENT_TEMPLATES = [
    {
        "short_description": "VPN users unable to connect",
        "description": "Remote users report VPN authentication failures after password reset.",
        "category": "network",
        "subcategory": "vpn",
        "priority": "2 - High",
        "severity": "2 - Major",
        "impact": "2 - Medium",
        "urgency": "1 - High",
    },
    {
        "short_description": "Email delivery delayed",
        "description": "Users are receiving external email with delays greater than 30 minutes.",
        "category": "software",
        "subcategory": "email",
        "priority": "3 - Moderate",
        "severity": "3 - Minor",
        "impact": "3 - Low",
        "urgency": "2 - Medium",
    },
    {
        "short_description": "Payroll application login error",
        "description": "Employees see a 500 error when signing in to the payroll portal.",
        "category": "application",
        "subcategory": "authentication",
        "priority": "1 - Critical",
        "severity": "1 - Critical",
        "impact": "1 - High",
        "urgency": "1 - High",
    },
    {
        "short_description": "Laptop disk encryption recovery required",
        "description": "Corporate laptop repeatedly prompts for BitLocker recovery on boot.",
        "category": "hardware",
        "subcategory": "laptop",
        "priority": "4 - Low",
        "severity": "3 - Minor",
        "impact": "3 - Low",
        "urgency": "3 - Low",
    },
    {
        "short_description": "Customer portal search returning no results",
        "description": "Knowledge base search returns empty results for common support terms.",
        "category": "application",
        "subcategory": "portal",
        "priority": "2 - High",
        "severity": "2 - Major",
        "impact": "2 - Medium",
        "urgency": "2 - Medium",
    },
    {
        "short_description": "Shared printer unavailable",
        "description": "Users on the third floor cannot print to the shared office printer.",
        "category": "hardware",
        "subcategory": "printer",
        "priority": "4 - Low",
        "severity": "4 - Low",
        "impact": "3 - Low",
        "urgency": "3 - Low",
    },
    {
        "short_description": "Suspicious sign-in alert",
        "description": "Security monitoring detected repeated failed sign-ins from a new location.",
        "category": "security",
        "subcategory": "identity",
        "priority": "2 - High",
        "severity": "2 - Major",
        "impact": "2 - Medium",
        "urgency": "1 - High",
    },
]

STATES = [
    ("1 - New", True),
    ("2 - In Progress", True),
    ("3 - On Hold", True),
    ("6 - Resolved", False),
]


def build_reference(table: str, sys_id: str) -> ReferenceField:
    """Create a ServiceNow-style reference object for related records."""

    return ReferenceField(
        link=f"https://example.service-now.com/api/now/table/{table}/{sys_id}",
        value=sys_id,
    )


def build_mock_incidents(total_records: int = 35) -> List[IncidentRecord]:
    """Generate enough mock incidents to make pagination behavior visible."""

    incidents = []

    for index in range(total_records):
        template = INCIDENT_TEMPLATES[index % len(INCIDENT_TEMPLATES)]
        group_name, group_id = ASSIGNMENT_GROUPS[index % len(ASSIGNMENT_GROUPS)]
        state, active = STATES[index % len(STATES)]
        sequence = index + 1

        incidents.append(
            IncidentRecord(
                sys_id=f"{sequence:032x}",
                number=f"INC{sequence:07d}",
                short_description=f"{template['short_description']} - {group_name}",
                description=template["description"],
                category=template["category"],
                subcategory=template["subcategory"],
                priority=template["priority"],
                severity=template["severity"],
                state=state,
                incident_state=state,
                impact=template["impact"],
                urgency=template["urgency"],
                active=active,
                opened_at=f"2026-05-{(sequence % 15) + 1:02d} 09:{sequence % 60:02d}:00",
                sys_created_on=f"2026-05-{(sequence % 15) + 1:02d} 09:{sequence % 60:02d}:00",
                sys_updated_on=f"2026-05-{(sequence % 15) + 1:02d} 10:{sequence % 60:02d}:00",
                close_notes="Resolved and confirmed with caller." if not active else "",
                resolution_notes="Workaround applied and service restored." if not active else "",
                assignment_group=build_reference("sys_user_group", group_id),
                assigned_to=build_reference("sys_user", f"{sequence + 1000:032x}"),
                caller_id=build_reference("sys_user", f"{sequence + 2000:032x}"),
                cmdb_ci=build_reference("cmdb_ci", f"{sequence + 3000:032x}"),
            )
        )

    return incidents


# Mock data stays in memory for now. This replaces ServiceNow only while we are
# developing the API shape; no database, vector search, embeddings, or AI layer
# is involved here.
MOCK_INCIDENTS = build_mock_incidents()


@router.get("/incidents", response_model=Dict[str, Any])
def get_incidents(
    limit: int = Query(default=10, ge=1),
    offset: int = Query(default=0, ge=0),
):
    """Return paginated mock ServiceNow-style incidents."""

    total_records = len(MOCK_INCIDENTS)
    paginated_incidents = MOCK_INCIDENTS[offset : offset + limit]

    # Pagination is critical in enterprise APIs because incident tables can
    # contain thousands or millions of records. ServiceNow APIs handle large
    # datasets with limit/offset-style batch retrieval so clients can process
    # data safely in chunks instead of pulling everything at once.
    #
    # This same batch pattern matters before embeddings or vectorization later:
    # records must be retrieved predictably in controlled pages before any
    # downstream indexing pipeline can process them reliably.
    return {
        "result": paginated_incidents,
        "pagination": {
            "total_records": total_records,
            "returned_records": len(paginated_incidents),
            "limit": limit,
            "offset": offset,
            "has_more": offset + len(paginated_incidents) < total_records,
        },
    }
