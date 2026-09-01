import os
from contextlib import asynccontextmanager
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model import get_recommender


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the model and embeddings before accepting traffic, rather than on
    # whichever request happens to arrive first. On a slow/free-tier host,
    # doing this lazily meant the first real user request could blow past
    # the platform's proxy timeout waiting on model load.
    get_recommender()
    yield


app = FastAPI(title="Book Insight Recommender", lifespan=lifespan)

# ALLOWED_ORIGINS is a comma-separated list, e.g.
# "http://localhost:3000,https://book-insight-ui.vercel.app"
_default_origins = "http://localhost:3000,http://127.0.0.1:3000"
allowed_origins = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", _default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class RecommendRequest(BaseModel):
    goal: str = Field(min_length=1, max_length=300)
    reading_level: Literal["beginner", "intermediate", "advanced"] = Field(
        alias="readingLevel"
    )

    model_config = {"populate_by_name": True}


class Book(BaseModel):
    title: str
    author: str | None = None
    description: str
    why_this_book: str = Field(serialization_alias="whyThisBook")
    amazon_url: str | None = Field(default=None, serialization_alias="amazonUrl")
    cover_image_url: str | None = Field(
        default=None, serialization_alias="coverImageUrl"
    )


class RecommendResponse(BaseModel):
    books: list[Book]


@app.post("/recommend", response_model=RecommendResponse)
def recommend(request: RecommendRequest) -> RecommendResponse:
    recommender = get_recommender()
    matches = recommender.search(request.goal, request.reading_level, top_k=5)

    return RecommendResponse(
        books=[
            Book(
                title=match.title,
                description=match.description,
                why_this_book=match.why_this_book,
                amazon_url=match.amazon_url,
                cover_image_url=match.cover_image_url,
            )
            for match in matches
        ]
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
