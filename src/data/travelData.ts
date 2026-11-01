export interface TravelItem {
  id: string;
  folder: string;
  zh: { location: string; date: string; description: string; short_description: string };
  en: { location: string; date: string; description: string; short_description: string };
  ja: { location: string; date: string; description: string; short_description: string };
}

export type PhotosByTravelId = Record<string, string[]>;

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

/**
 * 带缓存的加载器：同一份 JSON 只请求一次。
 * 失败时会清空缓存，这样调用方重试（比如点"重试"按钮）能真正重新发起请求，
 * 而不是立刻拿到上一次被拒绝的 promise。
 */
const createCachedLoader = <T,>(factory: () => Promise<T>) => {
  let promise: Promise<T> | null = null;

  return () => {
    promise ??= factory().catch((error: unknown) => {
      promise = null;
      throw error;
    });

    return promise;
  };
};

export const loadTravels = createCachedLoader(() =>
  fetchJson<TravelItem[]>('/data/travels.json')
);

export const loadPhotosByTravelId = createCachedLoader(() =>
  fetchJson<PhotosByTravelId>('/data/photos.json')
);

export const loadTravelData = async () => {
  const [travels, photosByTravelId] = await Promise.all([
    loadTravels(),
    loadPhotosByTravelId(),
  ]);

  return { travels, photosByTravelId };
};
