from bs4 import BeautifulSoup
from models import Post, Folder, PostRequest
from db import GenericRepository, PostRepository
from services.sentiment_service import SentimentService


class PostService:
    def __init__(
            self,
            post_repository: PostRepository,
            folder_repository: GenericRepository[Folder]
    ):
        self.post_repository = post_repository
        self.folder_repository = folder_repository
        self.emotion_service = SentimentService()

    def extract_text(self, content_html: str) -> str:
        soup = BeautifulSoup(content_html or "", "html.parser")

        for image in soup.find_all("img"):
            image.decompose()

        return " ".join(soup.get_text(separator=" ", strip=True).split())

    def build_post_from_request(self, post_request: PostRequest) -> Post:
        folder = self.folder_repository.find(id=post_request.folder)

        post = Post.from_request(
            post_request=post_request,
            folder=folder
        )
        post.content = self.extract_text(post.content_html)
        if post_request.get_emotion:
            post.emotion = self.emotion_service.predict_primary_emotion(post.content, allow_download=False)

        return post

    def create_post(self, post_request: PostRequest) -> str:
        post = self.build_post_from_request(post_request)
        post_id = self.post_repository.add(post)

        return str(post_id)

    def update_post(self, post_request: PostRequest) -> str:
        post = self.build_post_from_request(post_request)
        self.post_repository.update(post.model_dump(), id=post_request.id)

        return post_request.id

    def get_post_by_id(self, post_id: str) -> Post:
        return self.post_repository.get(id=post_id)

    def get_posts(self):
        posts = self.post_repository.get_list()
        return sorted(posts, key=lambda post: post.created_at, reverse=True)

    def delete_post(self, post_id: str) -> int:
        return self.post_repository.delete(id=post_id)
