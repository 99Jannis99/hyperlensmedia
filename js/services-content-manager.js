import { supabase } from './supabase-config.js';

class ServicesContentManager {
    constructor() {
        this.loadContent();
    }

    async loadContent() {
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('*')
                .eq('page', 'services');

            if (error) throw error;

            if (data) {
                this.applyContent(data);
            }
        } catch (error) {
            console.error('Error loading services content:', error);
        }
    }

    applyContent(contentData) {
        contentData.forEach(content => {
            const element = document.querySelector(`[data-content="${content.identifier}"]`);
            if (element) {
                element.innerHTML = content.content_text;
            }
        });
    }
}

export default new ServicesContentManager(); 