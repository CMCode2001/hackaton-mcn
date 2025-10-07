import artworksData from "./artworks.json";

export interface Artwork {
  id: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  img: string;
  audio?: string;
  category?: string;
  room: string;
  position: [number, number, number];
}

// On regroupe par salle
export const ARTWORKS_BY_ROOM: Record<string, Artwork[]> = artworksData.reduce(
  (acc: Record<string, Artwork[]>, artwork: Artwork) => {
    const roomName = artwork.room || "Salle inconnue";
    if (!acc[roomName]) acc[roomName] = [];
    acc[roomName].push(artwork);
    return acc;
  },
  {}
);
