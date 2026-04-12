from typing import Annotated
from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from dependencies import PostServiceDependency
from models import Post, PostRequest


posts = APIRouter(prefix="/api")


@posts.get("/posts", response_model=list[Post])
async def get_posts(post_service: PostServiceDependency):
    return post_service.get_posts()


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
