
let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getShiprocketToken() {
  // Reuse token if it is still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.token) {
    throw new Error("Shiprocket authentication failed");
  }

  cachedToken = data.token;

  // Refresh 1 hour before the expected 10-day expiry
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;

  return cachedToken;
}
