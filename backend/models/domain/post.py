from datetime import datetime
from models import FreezeModel
from models.domain.folder import Folder
from models.post_request import PostRequest


class Post(FreezeModel):
    id: str | None = None
    title: str | None = None
    created_at: datetime
    folder: Folder | None = None
    content: str = ""
    content_html: str = ""
    is_archived: bool = False
    is_deleted: bool = False

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
