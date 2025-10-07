import { Oeuvre, ApiResponse } from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchAPI<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null as any,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getOeuvres(): Promise<ApiResponse<Oeuvre[]>> {
  return fetchAPI<Oeuvre[]>('/oeuvres');
}

export async function getOeuvreById(id: string): Promise<ApiResponse<Oeuvre>> {
  return fetchAPI<Oeuvre>(`/oeuvres/${id}`);
}

export async function getOeuvreByQR(qrCodeRef: string): Promise<ApiResponse<Oeuvre>> {
  return fetchAPI<Oeuvre>(`/oeuvres/qr/${qrCodeRef}`);
}

export async function getOeuvresFromLocalData(): Promise<Oeuvre[]> {
  try {
    const response = await fetch('/data/oeuvres.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load local data:', error);
    return [];
  }
}
