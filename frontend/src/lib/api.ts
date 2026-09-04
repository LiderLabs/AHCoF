const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = (RAW_API_URL || "http://localhost:8000").replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${baseUrl}${normalizedPath}`;

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (networkError: any) {
    console.error(`[API Network Error] Failed to reach ${fullUrl}:`, networkError);
    throw new Error(
      `Cannot connect to server at ${baseUrl}. Please verify your connection or server status.`
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}