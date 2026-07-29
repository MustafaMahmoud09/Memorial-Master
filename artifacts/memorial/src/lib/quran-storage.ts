/**
 * Quran App – Persistent Storage Layer
 *
 * Primary:   IndexedDB  (structured data, bookmarks, history)
 * Secondary: localStorage (synchronous fallback for critical last-position fields)
 *
 * All public functions are safe to call even when IndexedDB is unavailable
 * (private browsing, storage quota exceeded, etc.) – they silently fall back.
 */

const DB_NAME = "quran-app-db";
const DB_VERSION = 1;

const STORE = {
  PREFS: "preferences",
  BOOKMARKS: "bookmarks",
  KHATMA: "khatma",
  HISTORY: "history",
} as const;

// ── IndexedDB bootstrap ──────────────────────────────────────────────────────

let _dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => { _dbPromise = null; reject(req.error); };
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE.PREFS))
        db.createObjectStore(STORE.PREFS);
      if (!db.objectStoreNames.contains(STORE.BOOKMARKS))
        db.createObjectStore(STORE.BOOKMARKS, { keyPath: "verseKey" });
      if (!db.objectStoreNames.contains(STORE.KHATMA))
        db.createObjectStore(STORE.KHATMA);
      if (!db.objectStoreNames.contains(STORE.HISTORY))
        db.createObjectStore(STORE.HISTORY, { autoIncrement: true });
    };
  });
  return _dbPromise;
}

async function idbGet<T>(store: string, key: IDBValidKey): Promise<T | undefined> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store, "readonly").objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => reject(req.error);
    });
  } catch { return undefined; }
}

async function idbPut(store: string, value: unknown, key?: IDBValidKey): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const os = db.transaction(store, "readwrite").objectStore(store);
      const req = key !== undefined ? os.put(value, key) : os.put(value);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch { /* ignore — we tried our best */ }
}

async function idbGetAll<T>(store: string): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store, "readonly").objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  } catch { return []; }
}

async function idbDelete(store: string, key: IDBValidKey): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const req = db.transaction(store, "readwrite").objectStore(store).delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {}
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface QuranPreferences {
  mode: "page" | "surah";
  currentPage: number;
  currentSurah: number;
  fontSize: number;        // px (16–40)
  playbackSpeed: number;   // 0.75 | 1.0 | 1.25 | 1.5
  volume: number;          // 0–1
}

export interface QuranBookmark {
  verseKey: string;        // e.g. "2:255" — used as IDB key
  verseId: number;
  chapterId: number;
  verseNumber: number;
  text: string;
  savedAt: number;
}

export interface HistoryEntry {
  page: number;
  visitedAt: number;
}

// ── localStorage sync keys (for synchronous initial reads) ──────────────────

const LS = {
  page: "quran_last_page",
  surah: "quran_last_surah",
  mode: "quran_last_mode",
  khatma: "quran_khatma_pages",
} as const;

// ── Preferences ──────────────────────────────────────────────────────────────

/** Synchronous best-effort load for initial state (before IndexedDB resolves). */
export function loadPreferencesSync(): QuranPreferences {
  const lsPage = parseInt(localStorage.getItem(LS.page) || "1");
  const lsSurah = parseInt(localStorage.getItem(LS.surah) || "1");
  return {
    mode: (localStorage.getItem(LS.mode) as "page" | "surah" | null) ?? "page",
    currentPage: isNaN(lsPage) ? 1 : Math.min(Math.max(1, lsPage), 604),
    currentSurah: isNaN(lsSurah) ? 1 : Math.min(Math.max(1, lsSurah), 114),
    fontSize: 24,
    playbackSpeed: 1.0,
    volume: 1.0,
  };
}

/** Full async load that merges IndexedDB over localStorage defaults. */
export async function loadPreferences(): Promise<QuranPreferences> {
  const base = loadPreferencesSync();
  const stored = await idbGet<Partial<QuranPreferences>>(STORE.PREFS, "main");
  if (!stored) return base;
  return {
    mode: stored.mode ?? base.mode,
    currentPage: stored.currentPage ?? base.currentPage,
    currentSurah: stored.currentSurah ?? base.currentSurah,
    fontSize: stored.fontSize ?? base.fontSize,
    playbackSpeed: stored.playbackSpeed ?? base.playbackSpeed,
    volume: stored.volume ?? base.volume,
  };
}

/** Save a partial preferences update. Always syncs critical fields to localStorage too. */
export async function savePreferences(prefs: Partial<QuranPreferences>): Promise<void> {
  const current = (await idbGet<Partial<QuranPreferences>>(STORE.PREFS, "main")) ?? {};
  await idbPut(STORE.PREFS, { ...current, ...prefs }, "main");
  // Keep localStorage in sync for synchronous access on next load
  if (prefs.currentPage !== undefined) localStorage.setItem(LS.page, String(prefs.currentPage));
  if (prefs.currentSurah !== undefined) localStorage.setItem(LS.surah, String(prefs.currentSurah));
  if (prefs.mode !== undefined) localStorage.setItem(LS.mode, prefs.mode);
}

// ── Bookmarks ────────────────────────────────────────────────────────────────

export async function loadBookmarks(): Promise<QuranBookmark[]> {
  return idbGetAll<QuranBookmark>(STORE.BOOKMARKS);
}

export async function saveBookmark(b: QuranBookmark): Promise<void> {
  await idbPut(STORE.BOOKMARKS, b);
}

export async function deleteBookmark(verseKey: string): Promise<void> {
  await idbDelete(STORE.BOOKMARKS, verseKey);
}

// ── Khatma ───────────────────────────────────────────────────────────────────

export async function loadKhatmaPages(): Promise<Set<number>> {
  try {
    const arr = await idbGet<number[]>(STORE.KHATMA, "pages");
    if (arr) return new Set(arr);
  } catch {}
  try { return new Set<number>(JSON.parse(localStorage.getItem(LS.khatma) || "[]")); }
  catch { return new Set(); }
}

export async function saveKhatmaPages(pages: Set<number>): Promise<void> {
  const arr = [...pages];
  await idbPut(STORE.KHATMA, arr, "pages");
  localStorage.setItem(LS.khatma, JSON.stringify(arr));
}

// ── History ──────────────────────────────────────────────────────────────────

export async function addToHistory(page: number): Promise<void> {
  await idbPut(STORE.HISTORY, { page, visitedAt: Date.now() } satisfies HistoryEntry);
}

export async function getRecentHistory(): Promise<HistoryEntry[]> {
  const all = await idbGetAll<HistoryEntry>(STORE.HISTORY);
  return all.sort((a, b) => b.visitedAt - a.visitedAt).slice(0, 30);
}
