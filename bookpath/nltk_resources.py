"""Explicit setup helpers for optional NLTK language data.

NLTK is a Python dependency; corpora such as WordNet are separate downloads.
This module never downloads data during import.
"""

from __future__ import annotations

import nltk

WORDNET_RESOURCES = ("wordnet", "omw-1.4")


def download_wordnet_resources() -> None:
    """Download the WordNet resources required for lemmatization."""

    for resource in WORDNET_RESOURCES:
        nltk.download(resource)
