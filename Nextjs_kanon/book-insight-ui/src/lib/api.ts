import type { Book, ReadingLevel } from "@/lib/books";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface RecommendResponse {
  books: Book[];
}

export async function getRecommendations(
  goal: string,
  readingLevel: ReadingLevel
): Promise<Book[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, readingLevel }),
    });
  } catch {
    throw new Error(
      `Couldn't reach the recommendation service at ${API_BASE_URL}. Is the FastAPI server running?`
    );
  }

  if (!response.ok) {
    throw new Error(
      `The recommendation service returned an error (${response.status}).`
    );
  }

  const data: RecommendResponse = await response.json();
  return data.books;
}
