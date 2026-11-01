
import {
  SavedDesign,
  ComponentType,
  ComponentSettings,
} from '../types/playground';
import { supabase } from '../lib/supabase';

interface SaveDesignData {
  name: string;
  componentType: ComponentType;
  settings: ComponentSettings;
  responsive?: {
    tablet?: Partial<ComponentSettings>;
    mobile?: Partial<ComponentSettings>;
  };
}

interface SavedDesignRow {
  id: string;
  name: string;
  component_type: ComponentType;
  category: 'basic' | 'ui' | 'advanced';
  created_at: string;
  settings: ComponentSettings;
  responsive: SavedDesign['responsive'];
}

function mapRow(row: SavedDesignRow): SavedDesign {
  return {
    id: row.id,
    name: row.name,
    componentType: row.component_type,
    category: row.category,
    createdAt: row.created_at,
    settings: row.settings,
    responsive: row.responsive ?? undefined,
  };
}

export async function getSavedDesigns(): Promise<SavedDesign[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('Please log in to view your saved designs.');

  const { data, error } = await supabase
    .from('saved_designs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => mapRow(row as SavedDesignRow));
}

export async function saveDesign(
  data: SaveDesignData
): Promise<SavedDesign> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('Please log in before saving a design.');

  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `design-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const payload = {
    id,
    user_id: user.id,
    name: data.name.trim() || 'Untitled Design',
    component_type: data.componentType,
    category: 'basic',
    settings: data.settings,
    responsive: data.responsive ?? null,
  };

  const { data: savedRow, error } = await supabase
    .from('saved_designs')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;

  return mapRow(savedRow as SavedDesignRow);
}

export async function deleteDesign(id: string): Promise<boolean> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('Please log in to delete a design.');

  const { error } = await supabase
    .from('saved_designs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;

  return true;
}

export async function getDesignById(
  id: string
): Promise<SavedDesign | undefined> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('Please log in to view this design.');

  const { data, error } = await supabase
    .from('saved_designs')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;

  return mapRow(data as SavedDesignRow);
}
