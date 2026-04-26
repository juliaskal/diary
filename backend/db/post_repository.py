from models import Post
from abc import ABC, abstractmethod


class PostRepository(ABC):

    @abstractmethod
    def add(self, model: Post) -> Post:
        raise NotImplementedError

    @abstractmethod
    def add_many(self, models: list[Post]) -> Post:
        raise NotImplementedError

    @abstractmethod
    def get(self, **filter) -> Post:
        raise NotImplementedError

    @abstractmethod
    def get_list(self, **filter) -> list[Post]:
        raise NotImplementedError

    @abstractmethod
    def get_range(self, start: int, end: int, model_type: type[Post], **filter):
        raise NotImplementedError

    @abstractmethod
    def count(self, **filter) -> int:
        raise NotImplementedError

    @abstractmethod
    def update(self, update: dict, **filter):
        raise NotImplementedError

    @abstractmethod
    def update_many(self, update: dict, **filter):
        raise NotImplementedError

    @abstractmethod
    def delete(self, **filter):
        raise NotImplementedError

    @abstractmethod
    def delete_many(self, **filter):
        raise NotImplementedError

    @abstractmethod
    def find(self, **filter) -> Post | None:
        raise NotImplementedError

    @abstractmethod
    def delete_by_folder(self, folder_id: str) -> int:
        raise NotImplementedError

    @abstractmethod
    def detach_from_folder(self, folder_id: str) -> int:
        raise NotImplementedError
