FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
# Install the CPU-only torch build first — the default PyPI wheel drags in
# the full NVIDIA CUDA toolkit (~2GB+) that's useless on a CPU-only host like
# Render's free tier. Installing it first satisfies sentence-transformers'
# torch dependency without pip pulling the CUDA build afterward.
RUN pip install --no-cache-dir torch --extra-index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Bake the model weights into the image at build time, so a fresh container
# never has to download ~90MB from Hugging Face on its first real request
# (that download, on a slow/free-tier host, was blowing past the platform's
# proxy timeout).
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

ENV PORT=8000
EXPOSE 8000

# Render (and similar platforms) assign the actual port via $PORT at runtime,
# so this must read it rather than hardcode one. Shell form (not exec/array
# form) so $PORT actually expands. Falls back to the ENV default locally.
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
