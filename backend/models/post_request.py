from datetime import datetime
from pydantic import field_validator
from models import FreezeModel
from utils import prosess_created_at


class PostRequest(FreezeModel):
    id: str | None = None
    title: str | None = None
    created_at: datetime
    folder: str | None = None
    content: str = ""
    content_html: str = ""
    is_archived: bool = False
    is_deleted: bool = False
    get_emotion: bool = True

    @field_validator('created_at', mode='before')
    def validate_created_date(cls, v):
        if isinstance(v, str | None):
            return prosess_created_at(v)
        return v
