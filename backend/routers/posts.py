from typing import Annotated
from fastapi import APIRouter, Body, Query
from fastapi.responses import JSONResponse
from dependencies import PostServiceDependency
from models import Post, PostPage, PostRequest


posts = APIRouter(prefix="/api")


@posts.get("/posts", response_model=PostPage)
async def get_posts(
    post_service: PostServiceDependency,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
):
    return post_service.get_posts(page=page, page_size=page_size)


@posts.get("/post/{post_id}", response_model=Post)
async def get_post(
    post_service: PostServiceDependency,
    post_id: str
):
    return post_service.get_post_by_id(post_id)


@posts.post("/post/new")
async def new_post(
    post: Annotated[PostRequest, Body()],
    post_service: PostServiceDependency
):
    post_id = post_service.create_post(post)
    return JSONResponse({"id": post_id})


@posts.post("/post/update")
async def update_post(
    post: Annotated[PostRequest, Body()],
    post_service: PostServiceDependency
):
    post_id = post_service.update_post(post)
    return JSONResponse({"id": post_id})


@posts.delete("/post/{post_id}")
async def delete_post(post_id: str, post_service: PostServiceDependency):
    return post_service.delete_post(post_id)
