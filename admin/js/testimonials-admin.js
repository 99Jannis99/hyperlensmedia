import { supabase } from '../../js/supabase-config.js';

class TestimonialsAdmin {
    constructor() {
        this.initializeForm();
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
        const container = document.getElementById('testimonialsList');
        if (!container) return;

        container.innerHTML = '';
        
        testimonials.forEach(testimonial => {
            const testimonialElement = document.createElement('div');
            testimonialElement.className = 'testimonial-item';
            testimonialElement.innerHTML = `
                <div class="testimonial-content">
                    <p>${testimonial.text}</p>
                    <p class="testimonial-author">${testimonial.author}</p>
                </div>
                <div class="testimonial-actions">
                    <button class="button is-small edit-testimonial" data-id="${testimonial.id}">Bearbeiten</button>
                    <button class="button is-small delete-testimonial" data-id="${testimonial.id}">Löschen</button>
                </div>
            `;
            container.appendChild(testimonialElement);
        });

        // Event-Listener für Bearbeiten und Löschen
        this.addEventListeners();
    }

    initializeForm() {
        const form = document.getElementById('addTestimonialForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const text = form.elements.testimonial_text.value;
                const author = form.elements.testimonial_author.value;

                try {
                    const { error } = await supabase
                        .from('testimonials')
                        .insert([{ text, author }]);

                    if (error) throw error;

                    alert('Testimonial erfolgreich hinzugefügt!');
                    form.reset();
                    this.loadTestimonials();
                } catch (error) {
                    console.error('Fehler beim Speichern:', error);
                    alert('Fehler beim Speichern des Testimonials');
                }
            });
        }
    }

    async deleteTestimonial(id) {
        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Testimonial erfolgreich gelöscht!');
            this.loadTestimonials();
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            alert('Fehler beim Löschen des Testimonials');
        }
    }

    addEventListeners() {
        document.querySelectorAll('.delete-testimonial').forEach(button => {
            button.addEventListener('click', (e) => {
                if (confirm('Möchten Sie dieses Testimonial wirklich löschen?')) {
                    this.deleteTestimonial(e.target.dataset.id);
                }
            });
        });

        document.querySelectorAll('.edit-testimonial').forEach(button => {
            button.addEventListener('click', (e) => {
                // Implementierung der Bearbeitung
                const id = e.target.dataset.id;
                // TODO: Öffne Modal oder Form für die Bearbeitung
            });
        });
    }
}

new TestimonialsAdmin(); 