/**
 * Cliente HTTP mínimo compartido por todos los servicios.
 *
 * La URL base se toma de la variable de entorno pública de Expo
 * `EXPO_PUBLIC_API_URL`, que se puede definir en un archivo `.env` en la raíz
 * del proyecto (ver `.env.example`). Expo expone automáticamente cualquier
 * variable con el prefijo `EXPO_PUBLIC_` vía `process.env`, sin necesidad de
 * dependencias adicionales.
 *
 * Si la variable no está definida, se usa `http://localhost:5000/api` como
 * valor por defecto para desarrollo local.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

/**
 * Wrapper sobre fetch que:
 * - serializa/deserializa JSON automáticamente
 * - lanza ApiError con el detalle que devuelve el backend (ProblemDetails)
 *   para que las pantallas puedan mostrar mensajes específicos
 *   (ej. "Ya existe un hogar registrado con esa dirección").
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body } = options;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new ApiError("No se pudo conectar con el servidor.", 0);
  }

  const isJson = response.headers.get("content-type")?.includes("json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const detail = payload?.detail ?? payload?.title ?? undefined;
    throw new ApiError(detail ?? "Ocurrió un error al comunicarse con el servidor.", response.status, detail);
  }

  return payload as T;
}
