export interface TravelItem {
  id: string;
  folder: string;
  zh: { location: string; date: string; description: string; short_description: string };
  en: { location: string; date: string; description: string; short_description: string };
  ja: { location: string; date: string; description: string; short_description: string };
}

export type PhotosByTravelId = Record<string, string[]>;

let travelsPromise: Promise<TravelItem[]> | null = null;
let photosPromise: Promise<PhotosByTravelId> | null = null;

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const loadTravels = () => {
  travelsPromise ??= fetchJson<TravelItem[]>('/data/travels.json');
  return travelsPromise;
};

export const loadPhotosByTravelId = () => {
  photosPromise ??= fetchJson<PhotosByTravelId>('/data/photos.json');
  return photosPromise;
};

export const loadTravelData = async () => {
  const [travels, photosByTravelId] = await Promise.all([
    loadTravels(),
    loadPhotosByTravelId(),
  ]);

  return { travels, photosByTravelId };
};
