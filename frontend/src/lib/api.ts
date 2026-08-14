const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

export async function guestLogin() {
  const response = await fetch(
    `${API_URL}/auth/guest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Guest login failed");
  }

  return response.json();
}