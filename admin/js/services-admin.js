import { supabase } from '../../js/supabase-config.js';
import toastManager from './toast-manager.js';

class ServicesAdmin {
    constructor() {
        this.initializeForm();
        this.initializeEditForm();
        this.loadServices();
        this.setupModalClose();
    }

    async loadServices() {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;

            if (data) {
                this.displayServices(data);
            }
        } catch (error) {
            console.error('Error loading services:', error);
        }
    }

    displayServices(services) {
        const container = document.getElementById('servicesList');
        if (!container) return;

        container.innerHTML = '';
        
        services.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.className = 'service-item';
            serviceElement.innerHTML = `
                <div class="service-content">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                    <p class="service-price">${service.price}</p>
                </div>
                <div class="service-actions">
                    <button class="button is-small edit-service" data-id="${service.id}">Edit</button>
                    <button class="button is-small delete-service" data-id="${service.id}">Delete</button>
                </div>
            `;
            container.appendChild(serviceElement);
        });

        this.addEventListeners();
    }

    initializeForm() {
        const form = document.getElementById('addServiceForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const title = form.elements.service_title.value;
                const description = form.elements.service_description.value;
                const price = form.elements.service_price.value;

                try {
                    const { error } = await supabase
                        .from('services')
                        .insert([{ title, description, price }]);

                    if (error) throw error;

                    toastManager.show('Service added successfully!', 'success');
                    form.reset();
                    this.loadServices();
                } catch (error) {
                    console.error('Error saving service:', error);
                    toastManager.show('Error saving service', 'error');
                }
            });
        }
    }

    async deleteService(id) {
        try {
            if (confirm('Are you sure you want to delete this service?')) {
                const { error } = await supabase
                    .from('services')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                toastManager.show('Service deleted successfully!', 'success');
                this.loadServices();
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            toastManager.show('Error deleting service', 'error');
        }
    }

    setupModalClose() {
        const modal = document.getElementById('editServiceModal');
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    initializeEditForm() {
        const form = document.getElementById('editServiceForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const id = form.elements.id.value;
                const title = form.elements.title.value;
                const description = form.elements.description.value;
                const price = form.elements.price.value;

                try {
                    const { error: deleteError } = await supabase
                        .from('services')
                        .delete()
                        .eq('id', id);

                    if (deleteError) throw deleteError;

                    const { error: insertError } = await supabase
                        .from('services')
                        .insert([{ 
                            id: parseInt(id), 
                            title,
                            description,
                            price 
                        }]);

                    if (insertError) throw insertError;

                    toastManager.show('Service updated successfully!', 'success');
                    document.getElementById('editServiceModal').style.display = 'none';
                    this.loadServices();
                } catch (error) {
                    console.error('Error updating service:', error);
                    toastManager.show('Error updating service', 'error');
                }
            });
        }
    }

    async openEditModal(id) {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                const modal = document.getElementById('editServiceModal');
                const form = document.getElementById('editServiceForm');
                
                form.elements.id.value = data.id;
                form.elements.title.value = data.title;
                form.elements.description.value = data.description;
                form.elements.price.value = data.price;
                
                modal.style.display = 'block';
                modal.classList.add('show');
            }
        } catch (error) {
            console.error('Error loading service:', error);
            toastManager.show('Error loading service', 'error');
        }
    }

    addEventListeners() {
        document.querySelectorAll('.delete-service').forEach(button => {
            button.addEventListener('click', (e) => {
                this.deleteService(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.edit-service').forEach(button => {
            button.addEventListener('click', (e) => {
                this.openEditModal(e.target.dataset.id);
            });
        });
    }
}

export default new ServicesAdmin(); 