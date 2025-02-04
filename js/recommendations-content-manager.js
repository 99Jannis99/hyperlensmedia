import { supabase } from './supabase-config.js';

class RecommendationsContentManager {
    constructor() {
        this.loadRecommendations();
    }

    async loadRecommendations() {
        try {
            const { data: recommendations, error } = await supabase
                .from('drone_recommendations')
                .select(`
                    *,
                    drone_parts (*)
                `)
                .order('id', { ascending: true });

            if (error) throw error;

            if (recommendations) {
                this.displayRecommendations(recommendations);
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    }

    displayRecommendations(recommendations) {
        const container = document.querySelector('.drone-garage_faq_list');
        if (!container) return;

        // Entferne die bestehende Recommendation
        const existingRecommendation = container.querySelector('.drone-garage_faq_accordion:first-child');
        if (existingRecommendation) {
            existingRecommendation.remove();
        }

        recommendations.forEach(recommendation => {
            const element = document.createElement('div');
            element.className = 'drone-garage_faq_accordion';
            element.innerHTML = `
                <div data-w-id="95dcaf3c-9b03-c12a-6965-961ea4c56f44"
                    class="drone-garage_faq_question drone-recommend-dis-container">
                    <div class="text-size-medium text-weight-bold drone-recommend-dis">
                        <img height="100px" src="${recommendation.image_url}" alt="${recommendation.title}">
                        <div>
                            <h5 class="margin-bottom margin-small">${recommendation.title}</h5>
                            <p>${recommendation.description}</p>
                        </div>
                    </div>
                    <div class="drone-garage_faq_icon-wrapper drone-recommend-dis-icon">
                        <div class="icon-embed-small w-embed">
                            <svg class="plus-minus-icon" width="100%" height="100%" viewbox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25.3333 15.667V16.3336C25.3333 16.7018 25.0349 17.0003 24.6667 17.0003H17V24.667C17 25.0351 16.7015 25.3336 16.3333 25.3336H15.6667C15.2985 25.3336 15 25.0351 15 24.667V17.0003H7.3333C6.96511 17.0003 6.66663 16.7018 6.66663 16.3336V15.667C6.66663 15.2988 6.96511 15.0003 7.3333 15.0003H15V7.33365C15 6.96546 15.2985 6.66699 15.6667 6.66699H16.3333C16.7015 6.66699 17 6.96546 17 7.33365V15.0003H24.6667C25.0349 15.0003 25.3333 15.2988 25.3333 15.667Z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="drone-garage_faq_answer">
                    <div class="margin-bottom margin-small">
                        ${this.renderParts(recommendation.drone_parts)}
                    </div>
                </div>
            `;

            // Füge die neue Recommendation am Anfang der Liste ein
            container.insertBefore(element, container.firstChild);
        });

        // Initialisiere Webflow-Interaktionen neu
        this.initializeAccordion();
    }

    initializeAccordion() {
        const accordions = document.querySelectorAll('.drone-garage_faq_question');
        accordions.forEach(accordion => {
            accordion.addEventListener('click', () => {
                const answer = accordion.nextElementSibling;
                const isOpen = answer.style.height !== '0px' && answer.style.height !== '';
                
                // Toggle Icon
                const icon = accordion.querySelector('.plus-minus-icon');
                icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(45deg)';
                
                // Toggle Content
                answer.style.height = isOpen ? '0px' : `${answer.scrollHeight}px`;
                answer.style.opacity = isOpen ? '0' : '1';
                answer.style.transition = 'height 0.3s ease-out, opacity 0.2s ease-out';
            });
        });

        // Initial state
        document.querySelectorAll('.drone-garage_faq_answer').forEach(answer => {
            answer.style.height = '0px';
            answer.style.opacity = '0';
            answer.style.overflow = 'hidden';
        });
    }

    renderParts(parts) {
        if (!parts || parts.length === 0) return '<p>No parts added yet</p>';

        return parts.map(part => `
            <div class="max-width-large margin-bottom margin-small">
                <div class="drone-recommend-dis-part">
                    <img height="100px" src="${part.image_url}" alt="${part.name}">
                    <p>${part.name}</p>
                </div>
            </div>
        `).join('');
    }
}

export default new RecommendationsContentManager(); 