export interface FontOption {
  name: string;
  value: string;
  category: string;
}

export const FONT_FAMILIES: FontOption[] = [
  { name: 'Inter (Modern Sans)', value: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", category: 'Sans-Serif' },
  { name: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif", category: 'Sans-Serif' },
  { name: 'Roboto', value: "'Roboto', sans-serif", category: 'Sans-Serif' },
  { name: 'Poppins', value: "'Poppins', sans-serif", category: 'Sans-Serif' },
  { name: 'System Default', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", category: 'System' },
  { name: 'Fira Code (Developer Mono)', value: "'Fira Code', monospace", category: 'Monospace' },
  { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace", category: 'Monospace' },
  { name: 'Georgia (Editorial Serif)', value: "Georgia, 'Times New Roman', serif", category: 'Serif' },
  { name: 'Playfair Display', value: "'Playfair Display', Georgia, serif", category: 'Serif' },
];
