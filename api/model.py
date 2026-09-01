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
CSV_PATH = DATA_DIR / "exercise_data.csv"
EMBEDDINGS_CACHE_PATH = DATA_DIR / "book_embeddings.npy"

MODEL_NAME = "all-MiniLM-L6-v2"


@dataclass
class BookMatch:
    title: str
    description: str
    why_this_book: str
    score: float
    amazon_url: str | None


def _load_catalog() -> pd.DataFrame:
    df = pd.read_csv(CSV_PATH)
    df["toc_text_letters_only"] = df["toc_text_letters_only"].fillna("")
    df["subcategory"] = df["subcategory"].fillna("General")
    return df


def _embedding_text(row: pd.Series) -> str:
    return f"{row['title']}. {row['toc_text_letters_only']}"


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

    def search(self, goal: str, top_k: int = 5) -> list[BookMatch]:
        query_embedding = self.model.encode(
            [goal],
            normalize_embeddings=True,
        )[0]

        scores = self.embeddings @ query_embedding
        top_indices = np.argsort(-scores)[:top_k]

        matches: list[BookMatch] = []
        for index in top_indices:
            row = self.catalog.iloc[index]
            toc = str(row["toc_text_letters_only"]).strip()
            score = float(scores[index])
            matches.append(
                BookMatch(
                    title=str(row["title"]),
                    description=_truncate(toc, 220),
                    why_this_book=_why_this_book(row["subcategory"], toc, score),
                    score=score,
                    amazon_url=_amazon_url(row["parent_asin"]),
                )
            )
        return matches


def _amazon_url(parent_asin: object) -> str | None:
    asin = str(parent_asin).strip()
    if not asin or asin.lower() == "nan":
        return None
    return f"https://www.amazon.com/dp/{asin}"


def _truncate(text: str, max_chars: int) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rsplit(" ", 1)[0] + "…"


def _why_this_book(subcategory: str, toc: str, score: float) -> str:
    excerpt = _truncate(toc, 260)
    return (
        f"Matched from the \"{subcategory}\" category with a topic-similarity "
        f"score of {score:.0%} against your goal. Its table of contents covers: "
        f"{excerpt}"
    )


@functools.lru_cache(maxsize=1)
def get_recommender() -> BookRecommender:
    return BookRecommender()
