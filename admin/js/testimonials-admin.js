import { supabase } from '../../js/supabase-config.js';
import toastManager from './toast-manager.js';

class TestimonialsAdmin {
    constructor() {
        this.initializeForm();
        this.initializeEditForm();
        this.loadTestimonials();
        this.setupModalClose();
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
                    <button class="button is-small edit-testimonial" data-id="${testimonial.id}">Edit</button>
                    <button class="button is-small delete-testimonial" data-id="${testimonial.id}">Delete</button>
                </div>
            `;
            container.appendChild(testimonialElement);
        });

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

                    toastManager.show('Testimonial added successfully!', 'success');
                    form.reset();
                    this.loadTestimonials();
                } catch (error) {
                    console.error('Error saving testimonial:', error);
                    toastManager.show('Error saving testimonial', 'error');
                }
            });
        }
    }

    async deleteTestimonial(id) {
        try {
            if (confirm('Are you sure you want to delete this testimonial?')) {
                const { error } = await supabase
                    .from('testimonials')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                toastManager.show('Testimonial deleted successfully!', 'success');
                this.loadTestimonials();
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            toastManager.show('Error deleting testimonial', 'error');
        }
    }

    setupModalClose() {
        const modal = document.getElementById('editTestimonialModal');
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    initializeEditForm() {
        const form = document.getElementById('editTestimonialForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const id = form.elements.id.value;
                const text = form.elements.text.value;
                const author = form.elements.author.value;

                try {
                    const { error: deleteError } = await supabase
                        .from('testimonials')
                        .delete()
                        .eq('id', id);

                    if (deleteError) throw deleteError;

                    const { error: insertError } = await supabase
                        .from('testimonials')
                        .insert([{ 
                            id: parseInt(id), 
                            text, 
                            author 
                        }]);

                    if (insertError) throw insertError;

                    toastManager.show('Testimonial updated successfully!', 'success');
                    document.getElementById('editTestimonialModal').style.display = 'none';
                    this.loadTestimonials();
                } catch (error) {
                    console.error('Error updating testimonial:', error);
                    toastManager.show('Error updating testimonial', 'error');
                }
            });
        }
    }

    async openEditModal(id) {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                const modal = document.getElementById('editTestimonialModal');
                const form = document.getElementById('editTestimonialForm');
                
                form.elements.id.value = data.id;
                form.elements.text.value = data.text;
                form.elements.author.value = data.author;
                
                modal.style.display = 'block';
                modal.classList.add('show');
            }
        } catch (error) {
            console.error('Error loading testimonial:', error);
            toastManager.show('Error loading testimonial', 'error');
        }
    }

    addEventListeners() {
        document.querySelectorAll('.delete-testimonial').forEach(button => {
            button.addEventListener('click', (e) => {
                if (confirm('Are you sure you want to delete this testimonial?')) {
                    this.deleteTestimonial(e.target.dataset.id);
                }
            });
        });

        document.querySelectorAll('.edit-testimonial').forEach(button => {
            button.addEventListener('click', (e) => {
                this.openEditModal(e.target.dataset.id);
            });
        });
    }
}

export default new TestimonialsAdmin(); 