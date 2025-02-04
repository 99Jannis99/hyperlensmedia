import { supabase } from './supabase-config.js';

class HomeContentManager {
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
            console.error('Error loading home content:', error);
        }
    }

    applyContent(contentData) {
        contentData.forEach(content => {
            const element = document.querySelector(`[data-content="${content.identifier}"]`);
            if (element) {
                if (element.hasAttribute('data-link')) {
                    element.href = content.content_text;
                } else {
                    element.innerHTML = content.content_text;
                }
            }
        });
    }
}

export default new HomeContentManager(); 