from datetime import datetime
from models import FreezeModel
from pydantic import field_validator
from utils import prosess_created_at


class Folder(FreezeModel):
    id: str | None = None
    name: str
    icon: str | None = None
    cover: str | None = None
    created_at: datetime = datetime.now()

    @field_validator('created_at', mode='before')
    def validate_created_date(cls, v):
        if isinstance(v, str | None):
            return prosess_created_at(v)
        return v
