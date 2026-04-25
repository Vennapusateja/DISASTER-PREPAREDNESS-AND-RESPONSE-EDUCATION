const BASE_URL = import.meta.env.VITE_API_URL || "https://disaster-preparedness-and-response-0jh5.onrender.com";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export async function apiJson(path, { method = "GET", body, token } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  const authToken = token || getToken();
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

/** 
 * Admin & Faculty API extensions
 */
export const adminApi = {
  getStats: (token) => apiJson("/api/analytics/overview", { token }),
  getUsers: (token) => apiJson("/api/admin/users", { token }),
  getReport: (token) => apiJson("/api/admin/reports", { token }),
  getAlertStats: (token) => apiJson("/api/alerts/stats", { token }),
};


export const facultyApi = {
  getDrills: (token) => apiJson("/api/faculty/drills", { token }),
  getPerformance: (token) => apiJson("/api/faculty/performance", { token }),
};
