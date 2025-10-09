// Pequeno helper de API para centralizar baseURL e headers de auth
export const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8001';

export function authHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    const trimmed = token.trim();
    headers['Authorization'] = trimmed.toLowerCase().startsWith('bearer ')
      ? trimmed
      : `Bearer ${trimmed}`;
  }
  return headers;
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: authHeaders(token),
    credentials: 'include',
  });
  if (!res.ok) throw await safeError(res);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (!res.ok) throw await safeError(res);
  return res.json();
}

async function safeError(res: Response) {
  try {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data: any = await res.json();
      // Normaliza mensagens comuns de APIs (FastAPI, DRF, etc.)
      const messages: string[] = [];

      if (Array.isArray(data?.detail)) {
        for (const item of data.detail) {
          if (typeof item === 'string') messages.push(item);
          else if (item?.msg) messages.push(item.msg);
          else if (item?.message) messages.push(item.message);
          else messages.push(JSON.stringify(item));
        }
      } else if (data?.detail) {
        messages.push(typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail));
      }

      if (Array.isArray(data?.errors)) {
        for (const e of data.errors) {
          if (typeof e === 'string') messages.push(e);
          else if (e?.message) messages.push(e.message);
          else messages.push(JSON.stringify(e));
        }
      }

      if (data?.message && typeof data.message === 'string') messages.push(data.message);

      const msg = messages.filter(Boolean).join('\n') || `HTTP ${res.status}`;
      return new Error(msg);
    }
    // Fallback: texto puro
    const text = await res.text();
    return new Error(text || `HTTP ${res.status}`);
  } catch {
    return new Error(`HTTP ${res.status}`);
  }
}


