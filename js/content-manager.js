import { supabase } from './supabase-config.js';

class ContentManager {
    constructor() {
        this.loadContent();
    }

    async loadContent() {
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('*')
                .eq('page', 'home');

            if (error) throw error;

            if (data) {
                this.applyContent(data);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Inhalte:', error);
        }
    }

    applyContent(contentData) {
        contentData.forEach(content => {
            const element = document.querySelector(`[data-content="${content.identifier}"]`);
            if (element) {
                element.textContent = content.content_text;
            }
        });
    }
}

export default new ContentManager(); 