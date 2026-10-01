/**
 * Espejo de los DTOs del backend (CuidaTuAguaBackend/DTOs/HogarDtos.cs).
 * Mantener sincronizado si cambian los campos del lado del servidor.
 */

export interface Hogar {
  id: number;
  usuarioId: number | null;
  nombre: string;
  direccion: string;
  telefono: string;
  pais: string;
  estrato: string;
  habitantes: number;
  createdAt: string;
  updatedAt: string;
}

export interface HogarFormData {
  nombre: string;
  direccion: string;
  telefono: string;
  pais: string;
  countryCode: string;
  estrato: string;
  habitantes: string;
}

export interface HogarCreatePayload {
  nombre: string;
  direccion: string;
  telefono: string;
  pais: string;
  estrato: string;
  habitantes: number;
  usuarioId?: number | null;
}

export type HogarUpdatePayload = HogarCreatePayload;

export const emptyHogarFormData: HogarFormData = {
  nombre: "",
  direccion: "",
  telefono: "",
  pais: "Colombia",
  countryCode: "+57",
  estrato: "",
  habitantes: "",
};
