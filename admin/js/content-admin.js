import { supabase } from '../../js/supabase-config.js';

class ContentAdmin {
    constructor() {
        this.initializeForms();
        this.loadCurrentContent();
    }

    async loadCurrentContent() {
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('*')
                .eq('page', 'home');

            if (error) throw error;

            if (data) {
                this.fillForms(data);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Inhalte:', error);
        }
    }

    fillForms(contentData) {
        contentData.forEach(content => {
            const input = document.querySelector(`[name="${content.identifier}"]`);
            if (input) {
                input.value = content.content_text;
            }
        });
    }

    async handleFormSubmit(formId, e) {
        e.preventDefault();
        
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const updates = [];

        const sectionMapping = {
            'main_headline': 'header',
            'main_description': 'header',
            'sub_headline': 'header',
            'secondary_headline': 'cta',
            'primary_button': 'cta',
            'secondary_button': 'cta',
            'feature_description': 'feature',
            'feature_title_1': 'feature',
            'feature_text_1': 'feature',
            'feature_button_1': 'feature',
            'feature_title_2': 'feature',
            'feature_text_2': 'feature',
            'feature_button_2': 'feature',
            'services_subtitle': 'services',
            'services_title': 'services',
            'services_description': 'services',
            'service_1_title': 'services',
            'service_1_text': 'services',
            'service_2_title': 'services',
            'service_2_text': 'services',
            'service_3_title': 'services',
            'service_3_text': 'services',
            'services_button_1': 'services',
            'services_button_2': 'services',
            'hiring_subtitle': 'hiring',
            'hiring_title': 'hiring',
            'hiring_description': 'hiring',
            'hiring_button': 'hiring',
            'testimonials_subtitle': 'testimonials',
            'testimonials_title': 'testimonials'
        };

        for (let [identifier, content_text] of formData.entries()) {
            updates.push({
                page: 'home',
                section: sectionMapping[identifier] || 'header',
                identifier,
                content_text
            });
        }

        try {
            const { error } = await supabase
                .from('page_content')
                .upsert(updates, {
                    onConflict: 'page,identifier',
                    ignoreDuplicates: false
                });

            if (error) throw error;

            alert('Inhalte erfolgreich aktualisiert!');
            window.location.reload();
            
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            alert('Fehler beim Speichern der Inhalte');
        }
    }

    initializeForms() {
        const formIds = ['homePageContentForm', 'homeFeatureForm', 'homeButtonsForm', 'homeServicesForm', 'homeHiringForm', 'testimonialsHeaderForm'];
        
        formIds.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', (e) => this.handleFormSubmit(formId, e));
            }
        });
    }
}

new ContentAdmin(); 