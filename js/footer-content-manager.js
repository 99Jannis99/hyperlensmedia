import { supabase } from './supabase-config.js';

class FooterContentManager {
    constructor() {
        this.loadContent();
    }

    async loadContent() {
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('*')
                .eq('page', 'footer');

            if (error) throw error;

            if (data) {
                this.applyContent(data);
            }
        } catch (error) {
            console.error('Error loading footer content:', error);
        }
    }

    applyContent(contentData) {
        contentData.forEach(content => {
            const elements = document.querySelectorAll(`[data-content="${content.identifier}"]`);
            elements.forEach(element => {
                if (element.hasAttribute('data-link')) {
                    element.href = content.content_text;
                } else {
                    element.innerHTML = content.content_text;
                }
            });
        });
    }
}

export default new FooterContentManager(); 