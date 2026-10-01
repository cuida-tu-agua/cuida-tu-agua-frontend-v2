import { apiRequest } from "./api";
import type { Hogar, HogarCreatePayload, HogarUpdatePayload } from "../types/Hogar";

const BASE_PATH = "/hogares";

export const hogarService = {
  /** HU-008: Registrar un lugar. */
  create(payload: HogarCreatePayload): Promise<Hogar> {
    return apiRequest<Hogar>(BASE_PATH, { method: "POST", body: payload });
  },

  /** HU-009: Editar lugar. */
  update(id: number, payload: HogarUpdatePayload): Promise<Hogar> {
    return apiRequest<Hogar>(`${BASE_PATH}/${id}`, { method: "PUT", body: payload });
  },

  /** Usado por la pantalla de edición para precargar el formulario. */
  getById(id: number): Promise<Hogar> {
    return apiRequest<Hogar>(`${BASE_PATH}/${id}`);
  },

  getAll(): Promise<Hogar[]> {
    return apiRequest<Hogar[]>(BASE_PATH);
  },
};
