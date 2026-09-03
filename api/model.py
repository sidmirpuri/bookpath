"""Loads the book catalog, embeds it with sentence-transformers, and answers
similarity searches against a user's learning goal.

Embedding model: all-MiniLM-L6-v2 (same model used for both the catalog and
the user's input sentence, so they land in the same vector space).
"""

from __future__ import annotations

import functools
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

DATA_DIR = Path(__file__).parent / "data"
CSV_PATH = DATA_DIR / "books_with_summary.csv"
EMBEDDINGS_CACHE_PATH = DATA_DIR / "book_embeddings.npy"

# features_summary falls back to this placeholder when the source book had no
# usable Amazon feature text to summarize. Treat it as "no summary" rather
# than showing it to users as the book's description.
FEATURES_SUMMARY_PLACEHOLDER = "Please check Amazon link for more infomation"

MODEL_NAME = "all-MiniLM-L6-v2"

# difficulty_score is 1-5 (some books have no score at all). Map the UI's
# three reading-level buttons onto that scale. A book with no score matches
# none of these sets, so it's excluded automatically — not a separate check.
READING_LEVEL_TO_SCORES: dict[str, set[int]] = {
    "beginner": {1, 2},
    "intermediate": {3},
    "advanced": {4, 5},
}


@dataclass
class BookMatch:
    title: str
    category: str
    description: str
    why_this_book: str
    amazon_url: str | None
    cover_image_url: str | None


def _load_catalog() -> pd.DataFrame:
    df = pd.read_csv(CSV_PATH)
    df["toc_text"] = df["toc_text"].fillna("")
    df["features_summary"] = df["features_summary"].fillna("")
    df["category"] = df["category"].fillna("General")
    df["difficulty_score"] = pd.to_numeric(df["difficulty_score"], errors="coerce")
    return df


def _embedding_text(row: pd.Series) -> str:
    return f"{row['title']}. {row['toc_text']}"


class BookRecommender:
    def __init__(self) -> None:
        self.catalog = _load_catalog()
        self.model = SentenceTransformer(MODEL_NAME)
        self.embeddings = self._load_or_build_embeddings()

    def _load_or_build_embeddings(self) -> np.ndarray:
        if EMBEDDINGS_CACHE_PATH.exists():
            cached = np.load(EMBEDDINGS_CACHE_PATH)
            if cached.shape[0] == len(self.catalog):
                return cached

        texts = [_embedding_text(row) for _, row in self.catalog.iterrows()]
        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=True,
            batch_size=64,
        )
        np.save(EMBEDDINGS_CACHE_PATH, embeddings)
        return embeddings

    def search(
        self, goal: str, reading_level: str, top_k: int = 5
    ) -> list[BookMatch]:
        query_embedding = self.model.encode(
            [goal],
            normalize_embeddings=True,
        )[0]

        scores = self.embeddings @ query_embedding
        ranked_indices = np.argsort(-scores)

        allowed_scores = READING_LEVEL_TO_SCORES.get(reading_level, set())
        difficulty_column = self.catalog["difficulty_score"].to_numpy()

        matches: list[BookMatch] = []
        for index in ranked_indices:
            if len(matches) >= top_k:
                break
            difficulty = difficulty_column[index]
            if difficulty not in allowed_scores:
                continue

            row = self.catalog.iloc[index]
            toc = str(row["toc_text"]).strip()
            summary = str(row["features_summary"]).strip()
            description = (
                summary if summary and summary != FEATURES_SUMMARY_PLACEHOLDER else toc
            )
            matches.append(
                BookMatch(
                    title=str(row["title"]),
                    category=str(row["category"]),
                    description=_truncate(description, 300),
                    why_this_book=_why_this_book(toc),
                    amazon_url=_amazon_url(row["parent_asin"]),
                    cover_image_url=_cover_image_url(row["cover_image_url"]),
                )
            )
        return matches


def _amazon_url(parent_asin: object) -> str | None:
    asin = str(parent_asin).strip()
    if not asin or asin.lower() == "nan":
        return None
    return f"https://www.amazon.com/dp/{asin}"


def _cover_image_url(cover_image_url: object) -> str | None:
    url = str(cover_image_url).strip()
    if not url or url.lower() == "nan":
        return None
    return url


def _truncate(text: str, max_chars: int) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rsplit(" ", 1)[0] + "…"


def _why_this_book(toc: str) -> str:
    return _truncate(toc, 1800)


@functools.lru_cache(maxsize=1)
def get_recommender() -> BookRecommender:
    return BookRecommender()
