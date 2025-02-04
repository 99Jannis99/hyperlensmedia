import { supabase } from './supabase-config.js';

class NavbarContentManager {
    constructor() {
        this.loadContent();
    }

    async loadContent() {
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('*')
                .eq('page', 'navbar');

            if (error) throw error;

            if (data) {
                this.applyContent(data);
            }
        } catch (error) {
            console.error('Error loading navbar content:', error);
        }
    }

    applyContent(contentData) {
        contentData.forEach(content => {
            const elements = document.querySelectorAll(`[data-content="${content.identifier}"]`);
            elements.forEach(element => {
                element.innerHTML = content.content_text;
            });
        });
    }
}

export default new NavbarContentManager(); 