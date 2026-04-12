from typing import Annotated
from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from dependencies import FolderServiceDependency
from models import Folder


folders = APIRouter(prefix="/api")


@folders.get("/folders")
async def get_folders(folder_service: FolderServiceDependency):
    return folder_service.get_list()


@folders.get("/folder/{folder_id}", response_model=Folder)
async def get_folder(
    folder_service: FolderServiceDependency,
    folder_id: str
):
    return folder_service.get_folder_by_id(folder_id)


@folders.post("/folder/new")
async def new_folder(
    folder: Annotated[Folder, Body()],
    folder_service: FolderServiceDependency
):
    folder_id = folder_service.create_folder(folder)
    return JSONResponse({"id": folder_id})


@folders.post("/folder/update")
async def update_folder(
    folder: Annotated[Folder, Body()],
    folder_service: FolderServiceDependency
):
    folder_id = folder_service.update_folder(folder)
    return JSONResponse({"id": folder_id})


@folders.delete("/folder/with-posts/{folder_id}")
async def delete_with_posts(
    folder_id: str,
    folder_service: FolderServiceDependency
):
    return folder_service.delete_with_posts(folder_id)


@folders.delete("/folder/save-posts/{folder_id}")
async def delete_save_posts(
    folder_id: str,
    folder_service: FolderServiceDependency
):
    return folder_service.delete_save_posts(folder_id)
