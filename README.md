# BookPath

Shared notebooks and reusable utilities for the BookPath project.

## installation instructions
1. clone the repository
2. create the virtual environment

```
pyenv virtualenv 3.10.6 bookpath
pyenv local bookpath
```

3. install the project in editable mode with its dependencies

```
python -m pip install -e .

```

Editable installation is the workflow taught in Day 28 MLOps: edits to the
`bookpath/` package are immediately available to notebooks and scripts in the
same environment.

## NLTK WordNet setup

NLTK is required for the optional lemmatization experiment. Its WordNet data is
a separate, one-time download. Run this in the same notebook kernel:

```python
from bookpath.nltk_resources import download_wordnet_resources

download_wordnet_resources()
```

## Notebook convention

Keep raw data unchanged. Optional NLP variants must be created in separate
columns and never overwrite the original text.
