import { supabase } from './supabase-config.js';

class SocialsContentManager {
    constructor() {
        this.loadContent();
    }

    async loadContent() {
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('*')
                .eq('page', 'socials');

            if (error) throw error;

            if (data) {
                this.applyContent(data);
            }
        } catch (error) {
            console.error('Error loading socials content:', error);
        }
    }

    applyContent(contentData) {
        contentData.forEach(content => {
            const element = document.querySelector(`[data-content="${content.identifier}"]`);
            if (element) {
                if (element.hasAttribute('data-link')) {
                    element.href = content.content_text;
                } else if (element.tagName.toLowerCase() === 'iframe') {
                    const videoId = content.content_text;
                    element.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
                } else {
                    element.innerHTML = content.content_text;
                }
            }
        });
    }
}

export default new SocialsContentManager(); 