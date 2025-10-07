export interface DescriptionMultilingue {
  id: string;
  langue: 'fr' | 'en' | 'wo';
  texteComplet: string;
  audioUrl?: string;
  videoUrl?: string;
  historiqueEtContexte?: string;
}

export interface Oeuvre {
  id: string;
  qrCodeRef: string;
  titre: string;
  auteur: string;
  dateCreation: string;
  localisationMusee: string;
  modele3dUrl?: string;
  imageUrl?: string;
  descriptions: DescriptionMultilingue[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
