const API_BASE = "http://localhost:5000";

export interface Exploit {
  id: string;
  name: string;
  category: string;
  description: string;
  payloads: string[];
}

export interface ExploitResult {
  success: boolean;
  payload_used: string;
  response: Record<string, unknown>;
  error: string | null;
}

export interface MitigationStatus {
  xss: boolean;
  sqli: boolean;
  csrf: boolean;
  lfi: boolean;
  [key: string]: boolean;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const resp = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!resp.ok) {
    const error = await resp.text();
    throw new Error(error || `Request failed: ${resp.status}`);
  }

  return resp.json();
}

export const api = {
  async getExploits(): Promise<Exploit[]> {
    return request<Exploit[]>("/exploits");
  },

  async getCategories(): Promise<string[]> {
    return request<string[]>("/exploits/categories");
  },

  async runExploit(
    exploitId: string,
    payloadIndex = 0,
  ): Promise<ExploitResult> {
    return request<ExploitResult>(`/exploit/${exploitId}`, {
      method: "POST",
      body: JSON.stringify({ payload_index: payloadIndex }),
    });
  },

  async getStatus(): Promise<MitigationStatus> {
    const resp = await request<{ mitigations: MitigationStatus }>("/status");
    return resp.mitigations;
  },

  async mitigate(type: string): Promise<MitigationStatus> {
    const resp = await request<{
      status: string;
      mitigations: MitigationStatus;
    }>(`/mitigate/${type}`, { method: "POST" });
    return resp.mitigations;
  },

  async mitigateAll(): Promise<MitigationStatus> {
    const resp = await request<{
      status: string;
      mitigations: MitigationStatus;
    }>("/mitigate", { method: "POST" });
    return resp.mitigations;
  },

  async reset(): Promise<MitigationStatus> {
    const resp = await request<{
      status: string;
      mitigations: MitigationStatus;
    }>("/reset", { method: "POST" });
    return resp.mitigations;
  },
};
