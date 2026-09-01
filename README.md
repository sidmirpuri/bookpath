# BookPath

Shared notebooks and reusable utilities for the BookPath project.

## Current application architecture

- **Frontend:** Next.js in `Nextjs_kanon/book-insight-ui`, currently hosted on
  [Vercel](https://book-insight-sable.vercel.app/) from
  `kanon-dayo/book-insight` (`main`).
- **Backend:** FastAPI in `api`, currently hosted on
  [Render](https://book-insight-api-e023.onrender.com/health) from
  `sidmirpuri/bookpath` (`add-book-recommender-app`).
- **Recommendations:** `all-MiniLM-L6-v2` compares the user's goal with the
  precomputed book embeddings in `api/data/book_embeddings.npy`.
- **Data:** `api/data/exercise_data.csv` is the current book catalog. There is
  no external database; the CSV and NumPy embeddings are packaged with the API.

The current Vercel and Render deployments are connected to the repositories
and branches listed above. Merging another branch into `sidmirpuri/bookpath`
`main` will not update those deployments until their Git settings are changed
to deploy from this repository and branch.

## Run the application with Docker

Docker runs the Next.js frontend and FastAPI recommendation service without
requiring Node.js or Python dependencies to be installed on the host machine.
Install and start Docker Desktop before continuing, then verify that its engine
is available:

```bash
docker ps
```

Run all commands below from the repository root.

| Service | Address |
| --- | --- |
| Next.js frontend | <http://localhost:3000> |
| FastAPI service | <http://localhost:8000> |
| FastAPI health check | <http://localhost:8000/health> |

### Start everything with Docker Compose

Start the frontend and API together with one command:

```bash
docker compose up --build
```

The first run downloads the container images, Python dependencies, and
embedding model, so it can take a few minutes. Compose waits for the API health
check before starting Next.js. When both services are ready, open
<http://localhost:3000>.

Keep the terminal open while using the application. Press `Ctrl+C` to stop the
services, then remove the stopped containers and network:

```bash
docker compose down
```

The `web_node_modules` Docker volume keeps frontend dependencies outside the
host filesystem. To remove that volume and force a completely fresh dependency
installation, run `docker compose down --volumes`.

If ports 3000 or 8000 are already in use, choose different host ports:

```bash
WEB_PORT=3001 API_PORT=8001 docker compose up --build
```

### Manual Docker alternative

The commands below run the same services separately when individual container
logs or lifecycle control are useful. Keep two terminal windows open.

#### 1. Build and start the API

In the first terminal:

```bash
docker build -t book-insight-api ./api

docker run --rm \
  --name book-insight-api \
  -p 8000:8000 \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  book-insight-api
```

The first build downloads the Python dependencies and embedding model, so it
can take a few minutes. Wait for `Application startup complete`, then verify
the service from another terminal:

```bash
curl -sS http://localhost:8000/health
```

The expected response is:

```json
{"status":"ok"}
```

An optional recommendation request can be tested with:

```bash
curl -sS \
  -X POST http://localhost:8000/recommend \
  -H 'Content-Type: application/json' \
  -d '{"goal":"Learn startup finance","readingLevel":"beginner"}'
```

#### 2. Start the frontend

Keep the API running. In the second terminal, from the repository root:

```bash
docker run --rm -it \
  --name book-insight-web \
  -p 3000:3000 \
  -v "$PWD/Nextjs_kanon/book-insight-ui:/app" \
  -v /app/node_modules \
  -w /app \
  node:24-bookworm-slim \
  sh -lc 'npm ci && npm run dev -- --hostname 0.0.0.0'
```

Wait for Next.js to report that it is ready, then open
<http://localhost:3000>. The browser will send recommendation requests to the
API running on port 8000.

### Validate the frontend build

To run linting, TypeScript checks, and the production build without installing
Node.js locally:

```bash
docker run --rm \
  -v "$PWD/Nextjs_kanon/book-insight-ui:/app" \
  -v /app/node_modules \
  -w /app \
  node:24-bookworm-slim \
  sh -lc 'npm ci && npm run lint && npm run build'
```

### Optional local Node.js installation

Docker does not require Node.js to be installed on the host. Teammates who
prefer to run the frontend directly on macOS can install the Node.js 24 LTS
release with Homebrew:

```bash
brew install node@24
export PATH="$(brew --prefix node@24)/bin:$PATH"

node --version
npm --version
```

To make Node.js available in future zsh sessions, add the following line to
`~/.zshrc`, then restart the terminal or run `source ~/.zshrc`:

```bash
export PATH="$(brew --prefix node@24)/bin:$PATH"
```

From the repository root, enter the frontend directory, then install and run
the frontend directly:

```bash
cd Nextjs_kanon/book-insight-ui
npm ci
npm run dev
```

### Stop manually started containers

Press `Ctrl+C` in each terminal. The `--rm` option removes each container after
it stops. If either container is still running, stop it explicitly:

```bash
docker stop book-insight-web book-insight-api
```

If Docker reports that it cannot connect to `docker.sock`, start Docker Desktop
and wait for the engine to become ready. On macOS, allow Terminal to communicate
with Docker Desktop if the operating system asks for permission.

## Python installation instructions

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
