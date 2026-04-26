from typing import TypeVar, Sequence, Generic
from pydantic import BaseModel
from abc import ABC, abstractmethod


T = TypeVar('T', bound=BaseModel)


class GenericRepository(ABC, Generic[T]):

    @abstractmethod
    def add(self, model: T) -> T:
        raise NotImplementedError

    @abstractmethod
    def add_many(self, models: Sequence[T]) -> T:
        raise NotImplementedError

    @abstractmethod
    def get(self, **filter) -> T:
        raise NotImplementedError

    @abstractmethod
    def get_list(self, **filter) -> list[T]:
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
    def find(self, **filter) -> T | None:
        raise NotImplementedError
