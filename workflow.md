# Claude command workflow
## CURRENT STATE
- Frontend: `Nextjs_kanon/book-insight-ui/` — Next.js app, already has the goal form,
  reading-level picker, and results screen.
- Backend: `api/` — FastAPI service, already has `model.py` (loads the book CSV, embeds
  it and the user's goal with `all-MiniLM-L6-v2`, ranks by `cosine_similarity`) and `main.py`
  (exposes `POST /recommend`).
- Both are already live: frontend on **Vercel**, backend on **Render**.
- Remaining task: modify `api/model.py` and `api/main.py` to also filter/rank by reading level.
  (Do not recreate the Next.js app or the FastAPI service from scratch.)

### Repos (two, not one 😅)
- **`sidmirpuri/bookpath`**, branch `add-book-recommender-app` — the shared team repo.
  Push backend and general changes here. **Render** (the API) deploys from this branch.
- **`kanon-dayo/book-insight`**, `main` — a personal mirror **Vercel** deploys the frontend
  from.

  **Why two repos:** <u>**Vercel's GitHub connection only has access to repos under the
  account that installed it.** </u> `sidmirpuri/bookpath` doesn't belong to me, and granting
  a third-party app access to someone else's repo needs *their* permission, not just
  read access — being a collaborator wasn't enough.(Claude is saying so, BUT I couldn't find the way to ask permission.) Rather than block on that, the
  working branch was pushed to a personal repo instead, which Vercel could access
  immediately.

  **If you hit this too:** either ask the repo owner to grant Vercel's GitHub App
  access to `sidmirpuri/bookpath` (Settings → Applications → Installed GitHub Apps),
  or mirror the branch to your own repo the same way, as a fallback.
- Not yet merged my branch (`add-book-recommender-app`) into `sidmirpuri/bookpath`'s `main`.

## OVERVIEW
  *Everything below this point is the literal prompt — copy from here down when you paste into Claude* ***WITH DATA***
  - Create website which is book recommendation depending on user's level website
  - The system is developed by using ML model by python and Next.js

### 1. Pass Claude dataset
  1. Pass the final version of dataset(which includes cleaned toc, title, difficulties ...etc)

### 2. Import Sentence Transformer and cosine similarity
  1. Pick up the model `all-MiniLM-L6-v2`
  2. Encode the query(which is the input sentences on UI landing page)
  3. Encode all of the toc_text
  4. Using `cosine_similarity`, and calculate similarity score

### 3. Show the results
  1. As for frontend, using Next.js, as for python prediction model, using FastAPI
  2. Filter the ranked books to only those whose difficulty level exactly matches
     the user's selected reading level (books with no difficulty label are excluded
     automatically, since they won't match any level)
  3. Take the top 5 from that filtered, ranked list

### 4. Prompt example
  *"A structure is 1. embed toc of books we have model is 'all-MiniLM-L6-v2' 2. encode input sentence on UI (e.g. I have became a CFO of a startup company) model is 'all-MiniLM-L6-v2' 3. using cosine similarity, rank all the books by how well they match 4. filter the ranked list to only those whose difficulty level exactly matches the user's selected level (books with no difficulty label are excluded automatically, since they won't match any level) 5. take the top 5 from that filtered list. Can you create app by using this csv? If I need some tasks before asking you, let me know."*

![workflow chart](difficulty-layer-workflow.png)
