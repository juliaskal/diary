from datetime import datetime
from pydantic import BaseModel, field_validator
from utils import prosess_created_at


class Folder(BaseModel):
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
