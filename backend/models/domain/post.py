from datetime import datetime
from pydantic import BaseModel, field_serializer
from models.domain.folder import Folder
from models.post_request import PostRequest
from models.domain.sentiment import Sentiment


class Post(BaseModel):
    id: str | None = None
    title: str | None = None
    created_at: datetime
    folder: Folder | None = None
    content: str = ""
    content_html: str = ""
    is_archived: bool = False
    is_deleted: bool = False
    emotion: Sentiment | None = None

    @field_serializer("emotion")
    def serialize_emotion(self, emotion: Sentiment | None) -> str | None:
        return emotion.value if emotion is not None else None

    @classmethod
    def from_request(cls, post_request: PostRequest, folder: Folder | None = None):
        return cls(
            id=post_request.id,
            title=post_request.title,
            created_at=post_request.created_at,
            content=post_request.content,
            content_html=post_request.content_html,
            is_archived=post_request.is_archived,
            folder=folder,
            is_deleted=post_request.is_deleted
        )
