# Presentation Idea
## What is bookpath
  - Match the best fitted book to the learning goal.
## How to do it?
### What data? Why this data?
  - Amazon-Reviews-2023 dataset https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023
  - *-why we chose this data not kaggle one-*
### What this dataset contains?
  - *-columns we use-*
  - Difficulty (*-how did we label difficulty-*)
### Methodology
  - Overview: Users input their learning goal and current level, then Transformer model(here we use `all-MiniLM-L6-v2`)
              encode users learning goal(sentence).
              We also encode tables of contents of books in our datasets, then by using cosine similarity to find matched books.
  - *-Why `all-MiniLM-L6-v2`-*
  - What is cosine similarity: a way to measure how close two pieces of text are in meaning once they're turned into vectors: 1.0
    means nearly identical meaning, 0 means unrelated. It's the standard way to compare embeddings.
  - *-Why TOC not description-*
  - Then we filter by difficulties when we show the output
#### (Prior Research -not sure yet, maybe not necessary)
  **A book recommender system for enhancing reading engagement: a systematic review (Malakul,Songmuang, 2026)**
  - For book recommendation system, data sparsity in reviews often happens.
  - Therefore, we also switched collaborative filtering to content based filtering.
## Demonstorate Website
 - maybe for 3minutes
## Where it goes / Further ideas
