from math import ceil

from pydantic import BaseModel

from models.domain.post import Post


class PostPage(BaseModel):
    items: list[Post]
    total: int
    page: int
    page_size: int
    pages: int

    @classmethod
    def create(
        cls,
        items: list[Post],
        total: int,
        page: int,
        page_size: int,
    ) -> "PostPage":
        pages = ceil(total / page_size) if total > 0 else 0
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            pages=pages,
        )
