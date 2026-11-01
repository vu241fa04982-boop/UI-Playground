import { SavedDesign, ComponentType, ComponentSettings } from '../types/playground';
import { getDefaultSettings } from '../data/initialComponents';

const STORAGE_KEY = 'ui-playground-designs';

export function getSavedDesigns(): SavedDesign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedStarterDesigns();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    console.error('Failed to load saved designs from localStorage', e);
    return [];
  }
}

export function saveDesign(data: {
  name: string;
  componentType: ComponentType;
  settings: ComponentSettings;
  responsive?: {
    tablet?: Partial<ComponentSettings>;
    mobile?: Partial<ComponentSettings>;
  };
}): SavedDesign {
  const existing = getSavedDesigns();
  const newDesign: SavedDesign = {
    id: 'design-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: data.name.trim() || 'Untitled Design',
    componentType: data.componentType,
    category: 'basic',
    createdAt: new Date().toISOString(),
    settings: JSON.parse(JSON.stringify(data.settings)),
    responsive: data.responsive ? JSON.parse(JSON.stringify(data.responsive)) : undefined,
  };

  const updated = [newDesign, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save design to localStorage', e);
  }
  return newDesign;
}

export function deleteDesign(id: string): boolean {
  try {
    const existing = getSavedDesigns();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete design from localStorage', e);
    return false;
  }
}

export function getDesignById(id: string): SavedDesign | undefined {
  const all = getSavedDesigns();
  return all.find((d) => d.id === id);
}

function seedStarterDesigns(): SavedDesign[] {
  const cardDefaults = getDefaultSettings('card');
  const buttonDefaults = getDefaultSettings('button');
  const inputDefaults = getDefaultSettings('input');

  const starters: SavedDesign[] = [
    {
      id: 'starter-neon-card',
      name: 'Cyberpunk Glow Card',
      componentType: 'card',
      category: 'basic',
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      settings: {
        ...cardDefaults,
        content: {
          ...cardDefaults.content,
          heading: 'Create Something Beautiful',
          description: 'A simple and powerful way to turn your ideas into stunning user interfaces.',
          buttonText: 'Get Started →',
        },
      },
    },
    {
      id: 'starter-gradient-btn',
      name: 'Vibrant Action Button',
      componentType: 'button',
      category: 'basic',
      createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      settings: buttonDefaults,
    },
    {
      id: 'starter-modern-input',
      name: 'Dark Navy Search Input',
      componentType: 'input',
      category: 'basic',
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      settings: inputDefaults,
    },
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starters));
  } catch (e) {
    // fallback
  }
  return starters;
}
