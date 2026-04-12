from models import Folder
from db import GenericRepository, PostRepository


class FolderService:

    def __init__(
            self,
            folder_repository: GenericRepository[Folder],
            post_repository: PostRepository
    ):
        self.folder_repository = folder_repository
        self.post_repository = post_repository

    def get_list(self, **filter):
        return self.folder_repository.get_list(**filter)

    def get_folder_by_id(self, folder_id: str) -> Folder:
        return self.folder_repository.get(id=folder_id)

    def delete_with_posts(self, folder_id: str) -> int:
        deleted_folders = self.folder_repository.delete(id=folder_id)
        deleted_posts = self.post_repository.delete_by_folder(folder_id)

        return deleted_folders + deleted_posts

    def delete_save_posts(self, folder_id: str) -> int:
        deleted_folders = self.folder_repository.delete(id=folder_id)
        self.post_repository.detach_from_folder(folder_id)

        return deleted_folders

    def create_folder(self, folder: Folder) -> str:
        folder_id = self.folder_repository.add(folder)
        return str(folder_id)

    def update_folder(self, folder: Folder) -> str:
        self.folder_repository.update(folder.model_dump(), id=folder.id)

        params = {"folder.id": folder.id}
        self.post_repository.update_many({"folder": folder.model_dump()}, **params)

        return folder.id
