import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model import get_recommender

app = FastAPI(title="Book Insight Recommender")

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
    reading_level: str = Field(alias="readingLevel")

    model_config = {"populate_by_name": True}


class Book(BaseModel):
    title: str
    author: str | None = None
    description: str
    why_this_book: str = Field(serialization_alias="whyThisBook")
    amazon_url: str | None = Field(default=None, serialization_alias="amazonUrl")


class RecommendResponse(BaseModel):
    books: list[Book]


@app.post("/recommend", response_model=RecommendResponse)
def recommend(request: RecommendRequest) -> RecommendResponse:
    # readingLevel isn't used to rank or filter results yet — the catalog has
    # no difficulty data. Once that's added, filter/re-rank by request.reading_level here.
    recommender = get_recommender()
    matches = recommender.search(request.goal, top_k=5)

    return RecommendResponse(
        books=[
            Book(
                title=match.title,
                description=match.description,
                why_this_book=match.why_this_book,
                amazon_url=match.amazon_url,
            )
            for match in matches
        ]
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
