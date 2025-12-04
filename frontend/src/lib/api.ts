const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5010";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Example usage:
export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint: string, data: any) => 
    apiRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: (endpoint: string, data: any) => 
    apiRequest(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: (endpoint: string) => 
    apiRequest(endpoint, { method: "DELETE" }),
};
