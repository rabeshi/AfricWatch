from __future__ import annotations

from app.models.schemas import DiseaseInfo


def get_diseases() -> list[DiseaseInfo]:
    return [
        DiseaseInfo(
            slug="malaria",
            name="Malaria",
            enabled=True,
            phase=1,
            source="WHO Global Health Observatory",
        ),
        DiseaseInfo(
            slug="hpv",
            name="HPV / Cervical Cancer Burden",
            enabled=True,
            phase=1,
            source="WHO Global Health Observatory",
        ),
    ]
