from typing import Sequence
from models import Post
from mongodb import DictMongoRepository


class PostMongoRepository:

    def __init__(
        self,
        connection_string: str,
        database_name: str,
        collection_name: str,
        client_kwargs: dict | None = None
    ):
        self._mongo_repository = DictMongoRepository(connection_string, database_name, collection_name, client_kwargs)

    def model_to_document(self, model: Post):
        return model.model_dump()

    def add(self, model: Post) -> str:
        document = self.model_to_document(model)
        return self._mongo_repository.add(document).inserted_id

    def add_many(self, models: Sequence[Post]):
        documents = [self.model_to_document(model) for model in models]
        return self._mongo_repository.add_many(documents).inserted_ids

    def get(self, **filter):
        document = self._mongo_repository.get(**filter)
        if document is None:
            raise ValueError('Document not found')
        return Post(**document)

    def get_list(self, **filter):
        documents = self._mongo_repository.get_list(**filter)
        return list(map(lambda document: Post(**document), documents))

    def get_range(self, start: int, end: int, **filter):
        documents = self._mongo_repository.get_range(start, end, **filter)
        return list(map(lambda document: Post(**document), documents))

    def count(self, **filter):
        return self._mongo_repository.count(**filter)

    def update(self, update: dict, **filter) -> bool:
        return self._mongo_repository.update(update, **filter).did_upsert

    def update_many(self, update: dict, **filter):
        return self._mongo_repository.update_many(update, **filter).modified_count

    def delete(self, **filter) -> int:
        return self._mongo_repository.delete(**filter).deleted_count

    def delete_many(self, **filter):
        return self._mongo_repository.delete_many(**filter).deleted_count

    def find(self, **filter):
        if not (document := self._mongo_repository.find(**filter)):
            return document
        return Post(**document)

    def delete_by_folder(self, folder_id: str) -> int:
        params = {"folder.id": folder_id}
        result = self._mongo_repository.delete_many(**params)
        return result.deleted_count

    def detach_from_folder(self, folder_id: str) -> int:
        params = {"folder.id": folder_id}
        result = self._mongo_repository.update_many({"folder": None}, **params)
        return result.modified_count
