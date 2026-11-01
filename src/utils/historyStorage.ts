import { HistoryItem, ComponentType, ComponentSettings, DeviceType } from '../types/playground';

const HISTORY_STORAGE_KEY = 'ui-playground-history';
const MAX_HISTORY_ITEMS = 25;

export function getHistoryItems(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    console.error('Failed to load history from localStorage', e);
    return [];
  }
}

export function saveHistoryItem(data: {
  sessionId?: string;
  name?: string;
  componentType: ComponentType;
  settings: ComponentSettings;
  device: DeviceType;
  responsive?: {
    tablet?: Partial<ComponentSettings>;
    mobile?: Partial<ComponentSettings>;
  };
}): HistoryItem {
  const existing = getHistoryItems();
  const now = new Date().toISOString();
  const displayName =
    data.name?.trim() ||
    data.settings.content?.heading?.trim() ||
    `${data.componentType.charAt(0).toUpperCase() + data.componentType.slice(1)} Session`;

  // If a session ID is given and matches an existing item, update it in place and move to front
  let updatedList: HistoryItem[];
  let targetItem: HistoryItem;

  const foundIndex = data.sessionId ? existing.findIndex((item) => item.id === data.sessionId) : -1;

  if (foundIndex !== -1) {
    // Update existing session
    targetItem = {
      ...existing[foundIndex],
      name: displayName,
      componentType: data.componentType,
      device: data.device,
      updatedAt: now,
      settings: JSON.parse(JSON.stringify(data.settings)),
      responsive: data.responsive ? JSON.parse(JSON.stringify(data.responsive)) : undefined,
    };
    // Move to front
    const remainder = existing.filter((_, idx) => idx !== foundIndex);
    updatedList = [targetItem, ...remainder];
  } else {
    // Create new history entry
    targetItem = {
      id: data.sessionId || 'hist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: displayName,
      componentType: data.componentType,
      category: 'basic',
      device: data.device,
      updatedAt: now,
      settings: JSON.parse(JSON.stringify(data.settings)),
      responsive: data.responsive ? JSON.parse(JSON.stringify(data.responsive)) : undefined,
    };
    updatedList = [targetItem, ...existing];
  }

  // Trim to maximum allowed history
  if (updatedList.length > MAX_HISTORY_ITEMS) {
    updatedList = updatedList.slice(0, MAX_HISTORY_ITEMS);
  }

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Failed to save history to localStorage', e);
  }

  return targetItem;
}

export function deleteHistoryItem(id: string): boolean {
  try {
    const existing = getHistoryItems();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete history item', e);
    return false;
  }
}

export function clearHistory(): boolean {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Failed to clear history', e);
    return false;
  }
}

export function getHistoryItemById(id: string): HistoryItem | undefined {
  const all = getHistoryItems();
  return all.find((h) => h.id === id);
}
