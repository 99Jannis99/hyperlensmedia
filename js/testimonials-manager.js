import { supabase } from './supabase-config.js';

class TestimonialsManager {
    constructor() {
        this.splide = null;
        this.loadTestimonials();
    }

    async loadTestimonials() {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;

            if (data) {
                this.displayTestimonials(data);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Testimonials:', error);
        }
    }

    displayTestimonials(testimonials) {
        const container = document.querySelector('.splide__list');
        if (!container) return;

        container.innerHTML = testimonials.map(testimonial => `
            <li class="splide__slide">
                <div class="testemonial_container">
                    <p class="testemonial_text">${testimonial.text}</p>
                    <p class="testemonial_creator">${testimonial.author}</p>
                </div>
            </li>
        `).join('');

        if (this.splide) {
            this.splide.destroy();
        }

        this.initializeSplide();
    }

    initializeSplide() {
        this.splide = new Splide('#splide-carousel', {
            type: 'loop', // Enable loop mode
            arrows: false, // Disable default arrows
            autoplay: true, // Enable autoplay
        });

        // Progress Bar
        const progressBar = document.querySelector('.my-slider-progress-bar');
        
        if (progressBar) {
            // Setze initiale Breite
            progressBar.style.width = '0%';
            
            // Update Progress Bar
            this.splide.on('mounted move', () => {
                const end = this.splide.length;
                const rate = Math.min((this.splide.index + 1) / end, 1);
                progressBar.style.width = `${100 * rate}%`;
            });
        }

        // Event-Listener für die Custom-Buttons
        const prevButton = document.querySelector('.custom-button.prev');
        const nextButton = document.querySelector('.custom-button.next');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.splide.go('<');
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.splide.go('>');
            });
        }

        this.splide.mount();
    }
}

export default new TestimonialsManager(); 