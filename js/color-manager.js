import { supabase } from './supabase-config.js';

class ColorManager {
  constructor() {
    this.loadColors();
  }

  async loadColors() {
    try {
      const { data, error } = await supabase
        .from('color_scheme')
        .select('*')
        .eq('active', true)
        .single();

      if (error) throw error;

      if (data) {
        this.applyColors(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Farben:', error);
    }
  }

  applyColors(colorScheme) {
    document.documentElement.style.setProperty('--primary-color', colorScheme.primary_color);
    document.documentElement.style.setProperty('--secondary-color', colorScheme.secondary_color);
    document.documentElement.style.setProperty('--text-color', colorScheme.text_color);
    document.documentElement.style.setProperty('--background-color', colorScheme.background_color);
  }
}

export default new ColorManager(); 