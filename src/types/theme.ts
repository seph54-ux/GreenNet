export type ThemeId =
  | 'botanical-dark'
  | 'daylight-clean'
  | 'sunlight-contrast'
  | 'muted-sage'
  | 'hydro-biolab'
  | 'harvest-amber';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  category: 'Dark' | 'Light' | 'High Contrast' | 'Low Contrast' | 'Specialized';
  description: string;
  utility: string;
  swatches: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'botanical-dark',
    name: 'Botanical Dark',
    category: 'Dark',
    description: 'Deep forest foliage palette with vibrant emerald status indicators.',
    utility: 'Standard balanced mode for 24/7 greenhouse monitoring consoles.',
    swatches: {
      bg: '#0b130e',
      card: '#0f1912',
      accent: '#10b981',
      text: '#f1f5f9',
    },
  },
  {
    id: 'daylight-clean',
    name: 'Daylight Clean',
    category: 'Light',
    description: 'Crisp white & pale botanical canvas with high-contrast slate text.',
    utility: 'Engineered for bright ambient daytime inspection inside sunny glasshouses.',
    swatches: {
      bg: '#f4f6f4',
      card: '#ffffff',
      accent: '#059669',
      text: '#0f172a',
    },
  },
  {
    id: 'sunlight-contrast',
    name: 'Sunlight High-Contrast',
    category: 'High Contrast',
    description: 'True OLED pitch black with hyper-luminescent lime accents & bold borders.',
    utility: 'Designed for tablet operators inspecting towers under harsh, direct outdoor sunlight glare.',
    swatches: {
      bg: '#000000',
      card: '#080c09',
      accent: '#00ff88',
      text: '#ffffff',
    },
  },
  {
    id: 'muted-sage',
    name: 'Muted Sage',
    category: 'Low Contrast',
    description: 'Soft desaturated olive-sage tones with reduced blue-light luminance.',
    utility: 'Eye-comfort mode to prevent visual fatigue during prolonged twilight & overnight shifts.',
    swatches: {
      bg: '#121814',
      card: '#18201a',
      accent: '#84cc16',
      text: '#cbd5e1',
    },
  },
  {
    id: 'hydro-biolab',
    name: 'Hydro Bio-Lab',
    category: 'Specialized',
    description: 'Aquatic deep slate with crisp cyan, teal, and cobalt fluid telemetry accents.',
    utility: 'Emphasizes water reservoir chemistry, dissolved oxygen, and nutrient solution tracking.',
    swatches: {
      bg: '#081219',
      card: '#0d1b24',
      accent: '#06b6d4',
      text: '#e0f2fe',
    },
  },
  {
    id: 'harvest-amber',
    name: 'Harvest Amber',
    category: 'Specialized',
    description: 'Warm obsidian and bronze-amber tones evoking dusk and ripening photoperiods.',
    utility: 'Warm chromatic spectrum that minimizes disruption to flowering and photoperiod cycles.',
    swatches: {
      bg: '#14110e',
      card: '#1c1712',
      accent: '#f59e0b',
      text: '#fef3c7',
    },
  },
];
