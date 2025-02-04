import { supabase } from '../../js/supabase-config.js';
import toastManager from './toast-manager.js';

class ContentAdmin {
    constructor() {
        this.initializeForms();
        this.loadCurrentContent();
        this.addLineBreakButtons();
    }

    async loadCurrentContent() {
        try {
            // Lade alle Inhalte auf einmal
            const { data, error } = await supabase
                .from('page_content')
                .select('*');

            if (error) throw error;

            if (data) {
                // Gruppiere die Daten nach Seiten
                const groupedData = data.reduce((acc, item) => {
                    if (!acc[item.page]) {
                        acc[item.page] = [];
                    }
                    acc[item.page].push(item);
                    return acc;
                }, {});

                // Fülle die Formulare für jede Seite
                Object.values(groupedData).forEach(pageData => {
                    this.fillForms(pageData);
                });
            }
        } catch (error) {
            console.error('Error loading content:', error);
            toastManager.show('Error loading content', 'error');
        }
    }

    fillForms(contentData) {
        contentData.forEach(content => {
            // Suche nach Input/Textarea mit dem entsprechenden Namen
            const formElement = document.querySelector(`[name="${content.identifier}"]`);
            if (formElement) {
                formElement.value = content.content_text || '';
            }

            // Suche auch nach Elementen mit data-content Attribut
            const contentElement = document.querySelector(`[data-content="${content.identifier}"]`);
            if (contentElement) {
                contentElement.innerHTML = content.content_text || '';
            }
        });

        // Debug-Ausgabe
        console.log('Loaded content data:', contentData);
    }

    async handleFormSubmit(formId, e) {
        e.preventDefault();
        
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const updates = [];

        const sectionMapping = {
            // Home page mappings
            'hero_title': 'home',
            'hero_subtitle': 'home',
            'about_title': 'home',
            'about_text': 'home',
            // ... andere home mappings ...

            // Services page mappings
            'services_header_title': 'services',
            'services_header_subtitle': 'services',
            'services_header_description': 'services',
            'services_header_button': 'services',
            'recommendations_title': 'services',
            'recommendations_description': 'services',
            'services_building_subtitle': 'services',
            'services_building_title': 'services',
            'services_building_description': 'services',
            'services_building_feature1_title': 'services',
            'services_building_feature1_text': 'services',
            'services_building_feature2_title': 'services',
            'services_building_feature2_text': 'services',
            'services_customization_subtitle': 'services',
            'services_customization_title': 'services',
            'services_customization_description': 'services',
            'services_customization_feature1_title': 'services',
            'services_customization_feature1_text': 'services',
            'services_customization_feature2_title': 'services',
            'services_customization_feature2_text': 'services',
            'services_repair_subtitle': 'services',
            'services_repair_title': 'services',
            'services_repair_description': 'services',
            'services_repair_feature1_title': 'services',
            'services_repair_feature1_text': 'services',
            'services_repair_feature2_title': 'services',
            'services_repair_feature2_text': 'services',
            'services_tuning_subtitle': 'services',
            'services_tuning_title': 'services',
            'services_tuning_description': 'services',
            'services_tuning_feature1_title': 'services',
            'services_tuning_feature1_text': 'services',
            'services_tuning_feature2_title': 'services',
            'services_tuning_feature2_text': 'services',

            // Booking page mappings
            'booking_header_title': 'booking',
            'booking_header_description': 'booking',
            'booking_feature_subtitle': 'booking',
            'booking_feature_title': 'booking',
            'booking_feature_description': 'booking',
            'booking_feature1_title': 'booking',
            'booking_feature1_text': 'booking',
            'booking_feature2_title': 'booking',
            'booking_feature2_text': 'booking',
            'booking_services_subtitle': 'booking',
            'booking_services_title': 'booking',
            'booking_services_description': 'booking',
            'booking_services_item1_title': 'booking',
            'booking_services_item1_text': 'booking',
            'booking_services_item2_title': 'booking',
            'booking_services_item2_text': 'booking',
            'booking_services_item3_title': 'booking',
            'booking_services_item3_text': 'booking',
            'booking_contact_subtitle': 'booking',
            'booking_contact_title': 'booking',
            'booking_contact_description': 'booking',
            'booking_contact_button': 'booking',

            // Socials page mappings
            'socials_header_subtitle': 'socials',
            'socials_header_title': 'socials',
            'socials_header_description': 'socials',
            'socials_instagram_title': 'socials',
            'socials_instagram_text': 'socials',
            'socials_youtube_title': 'socials',
            'socials_youtube_text': 'socials',
            'socials_instagram_button': 'socials',
            'socials_instagram_link': 'socials',
            'socials_youtube_button': 'socials',
            'socials_youtube_link': 'socials',
            'socials_highlights_title': 'socials',
            'socials_highlights_description': 'socials',
            'socials_video1_link': 'socials',
            'socials_video1_embed': 'socials',
            'socials_video2_link': 'socials',
            'socials_video2_embed': 'socials'
        };

        for (let [identifier, content_text] of formData.entries()) {
            updates.push({
                page: sectionMapping[identifier] || (formId.includes('services') ? 'services' : 'home'),
                section: 'header',
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

            toastManager.show('Content updated successfully!', 'success');
            
            if (window.opener) {
                window.opener.location.reload();
            }
            
        } catch (error) {
            console.error('Error saving content:', error);
            toastManager.show('Error saving content', 'error');
        }
    }

    initializeForms() {
        const formIds = [
            'homePageContentForm', 
            'homeFeatureForm', 
            'homeServicesForm', 
            'servicesHeaderForm',
            'servicesBuildingForm',
            'servicesCustomizationForm',
            'servicesRepairForm',
            'servicesTuningForm',
            'recommendationsHeaderForm',
            'bookingHeaderForm',
            'bookingFeatureForm',
            'bookingServicesForm',
            'bookingContactForm',
            'socialsHeaderForm',
            'socialsFeaturesForm',
            'socialsHighlightsForm'
        ];
        
        formIds.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', (e) => this.handleFormSubmit(formId, e));
            }
        });
    }

    addLineBreakButtons() {
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        
        inputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-wrapper';
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'line-break-button';
            button.textContent = 'Line Break';
            button.title = 'Insert a line break at cursor position';
            
            wrapper.appendChild(button);
            
            button.addEventListener('click', () => this.insertLineBreak(input));
        });
    }

    insertLineBreak(input) {
        // Speichere aktuelle Cursor-Position
        const start = input.selectionStart;
        const end = input.selectionEnd;
        
        // Füge <br> an der Cursor-Position ein
        const newValue = input.value.substring(0, start) + '<br>' + input.value.substring(end);
        input.value = newValue;
        
        // Setze Cursor hinter den eingefügten Tag
        input.selectionStart = start + 4;
        input.selectionEnd = start + 4;
        
        // Fokussiere das Input-Feld wieder
        input.focus();
    }
}

new ContentAdmin(); 