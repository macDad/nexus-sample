"use server";
export async function getManagementToken(): Promise<string> {
  const AUTH0_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
  const AUTH0_MANAGEMENT_API_CLIENT_SECRET =
    process.env.AUTH0_MANAGEMENT_API_CLIENT_SECRET;
  const AUTH0_MANAGEMENT_API_CLIENT_ID =
    process.env.AUTH0_MANAGEMENT_API_CLIENT_ID;
  const AUTH0_MANAGEMENT_API_AUDIENCE =
    process.env.AUTH0_MANAGEMENT_API_AUDIENCE;

  const response = await fetch(`${AUTH0_ISSUER_BASE_URL}/oauth/token`, {
    method: "POST",
    body: JSON.stringify({
      client_id: AUTH0_MANAGEMENT_API_CLIENT_ID,
      client_secret: AUTH0_MANAGEMENT_API_CLIENT_SECRET,
      audience: AUTH0_MANAGEMENT_API_AUDIENCE,
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data.access_token;
}
