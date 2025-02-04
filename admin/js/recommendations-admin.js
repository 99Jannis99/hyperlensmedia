import { supabase } from '../../js/supabase-config.js';
import toastManager from './toast-manager.js';

class RecommendationsAdmin {
    constructor() {
        this.initializeForm();
        this.initializeEditForm();
        this.initializeAddPartForm();
        this.initializeEditPartForm();
        this.loadRecommendations();
        this.setupModalClose();
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
        const container = document.getElementById('recommendationsList');
        if (!container) return;

        container.innerHTML = '';
        
        recommendations.forEach(recommendation => {
            const element = document.createElement('div');
            element.className = 'recommendation-item';
            element.innerHTML = `
                <div class="recommendation-content">
                    <div class="recommendation-header">
                        <img src="${recommendation.image_url}" alt="${recommendation.title}" class="recommendation-image">
                        <div>
                            <h3>${recommendation.title}</h3>
                            <p>${recommendation.description}</p>
                        </div>
                    </div>
                    <div class="parts-list">
                        ${this.renderParts(recommendation.drone_parts)}
                    </div>
                </div>
                <div class="recommendation-actions">
                    <button class="button is-small edit-recommendation" data-id="${recommendation.id}">Edit</button>
                    <button class="button is-small delete-recommendation" data-id="${recommendation.id}">Delete</button>
                    <button class="button is-small add-part" data-id="${recommendation.id}">Add Part</button>
                </div>
            `;
            container.appendChild(element);
        });

        this.addEventListeners();
    }

    renderParts(parts) {
        if (!parts || parts.length === 0) return '<p>No parts added yet</p>';

        return parts.map(part => `
            <div class="part-item">
                <img src="${part.image_url}" alt="${part.name}">
                <p>${part.name}</p>
                <div class="part-actions">
                    <button class="button is-small edit-part" data-id="${part.id}">Edit</button>
                    <button class="button is-small delete-part" data-id="${part.id}">Delete</button>
                </div>
            </div>
        `).join('');
    }

    initializeForm() {
        const form = document.getElementById('addRecommendationForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); // Verhindert das Neuladen der Seite
                
                const title = form.elements.title.value;
                const description = form.elements.description.value;
                const image_url = form.elements.image_url.value;

                try {
                    const { data, error } = await supabase
                        .from('drone_recommendations')
                        .insert([{ 
                            title, 
                            description, 
                            image_url 
                        }])
                        .select();

                    if (error) throw error;

                    toastManager.show('Recommendation added successfully!', 'success');
                    form.reset();
                    this.loadRecommendations();
                } catch (error) {
                    console.error('Error saving recommendation:', error);
                    toastManager.show('Error saving recommendation', 'error');
                }
            });
        }
    }

    initializeEditForm() {
        const form = document.getElementById('editRecommendationForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const id = form.elements.id.value;
                const title = form.elements.title.value;
                const description = form.elements.description.value;
                const image_url = form.elements.image_url.value;

                try {
                    const { error } = await supabase
                        .from('drone_recommendations')
                        .update({ 
                            title, 
                            description, 
                            image_url 
                        })
                        .eq('id', id);

                    if (error) throw error;

                    toastManager.show('Recommendation updated successfully!', 'success');
                    document.getElementById('editRecommendationModal').style.display = 'none';
                    this.loadRecommendations();
                } catch (error) {
                    console.error('Error updating recommendation:', error);
                    toastManager.show('Error updating recommendation', 'error');
                }
            });
        }
    }

    initializeAddPartForm() {
        const form = document.getElementById('addPartForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const recommendation_id = form.elements.recommendation_id.value;
                const name = form.elements.name.value;
                const image_url = form.elements.image_url.value;

                try {
                    const { error } = await supabase
                        .from('drone_parts')
                        .insert([{ 
                            recommendation_id,
                            name,
                            image_url
                        }]);

                    if (error) throw error;

                    toastManager.show('Part added successfully!', 'success');
                    document.getElementById('addPartModal').style.display = 'none';
                    form.reset();
                    this.loadRecommendations();
                } catch (error) {
                    console.error('Error saving part:', error);
                    toastManager.show('Error saving part', 'error');
                }
            });
        }
    }

    openAddPartModal(recommendationId) {
        const modal = document.getElementById('addPartModal');
        const form = document.getElementById('addPartForm');
        
        if (modal && form) {
            form.elements.recommendation_id.value = recommendationId;
            modal.style.display = 'block';
            modal.classList.add('show');
        }
    }

    setupModalClose() {
        const modals = ['editRecommendationModal', 'addPartModal', 'editPartModal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                window.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            }
        });
    }

    addEventListeners() {
        document.querySelectorAll('.delete-recommendation').forEach(button => {
            button.addEventListener('click', (e) => {
                this.deleteRecommendation(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.edit-recommendation').forEach(button => {
            button.addEventListener('click', (e) => {
                this.openEditModal(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.add-part').forEach(button => {
            button.addEventListener('click', (e) => {
                this.openAddPartModal(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.edit-part').forEach(button => {
            button.addEventListener('click', (e) => {
                this.openEditPartModal(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.delete-part').forEach(button => {
            button.addEventListener('click', (e) => {
                this.deletePart(e.target.dataset.id);
            });
        });
    }

    async deleteRecommendation(id) {
        if (confirm('Are you sure you want to delete this recommendation?')) {
            try {
                const { error } = await supabase
                    .from('drone_recommendations')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                toastManager.show('Recommendation deleted successfully!', 'success');
                this.loadRecommendations();
            } catch (error) {
                console.error('Error deleting recommendation:', error);
                toastManager.show('Error deleting recommendation', 'error');
            }
        }
    }

    async deletePart(partId) {
        if (confirm('Are you sure you want to delete this part?')) {
            try {
                const { error } = await supabase
                    .from('drone_parts')
                    .delete()
                    .eq('id', partId);

                if (error) throw error;

                toastManager.show('Part deleted successfully!', 'success');
                this.loadRecommendations();
            } catch (error) {
                console.error('Error deleting part:', error);
                toastManager.show('Error deleting part', 'error');
            }
        }
    }

    async openEditModal(id) {
        try {
            const { data, error } = await supabase
                .from('drone_recommendations')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                const modal = document.getElementById('editRecommendationModal');
                const form = document.getElementById('editRecommendationForm');
                
                form.elements.id.value = data.id;
                form.elements.title.value = data.title;
                form.elements.description.value = data.description;
                form.elements.image_url.value = data.image_url;
                
                modal.style.display = 'block';
                modal.classList.add('show');
            }
        } catch (error) {
            console.error('Error loading recommendation:', error);
            toastManager.show('Error loading recommendation', 'error');
        }
    }

    async openEditPartModal(partId) {
        try {
            const { data, error } = await supabase
                .from('drone_parts')
                .select('*')
                .eq('id', partId)
                .single();

            if (error) throw error;

            if (data) {
                const modal = document.getElementById('editPartModal');
                const form = document.getElementById('editPartForm');
                
                form.elements.id.value = data.id;
                form.elements.name.value = data.name;
                form.elements.image_url.value = data.image_url;
                
                modal.style.display = 'block';
                modal.classList.add('show');
            }
        } catch (error) {
            console.error('Error loading part:', error);
            toastManager.show('Error loading part', 'error');
        }
    }

    initializeEditPartForm() {
        const form = document.getElementById('editPartForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const id = form.elements.id.value;
                const name = form.elements.name.value;
                const image_url = form.elements.image_url.value;

                try {
                    const { error } = await supabase
                        .from('drone_parts')
                        .update({ name, image_url })
                        .eq('id', id);

                    if (error) throw error;

                    toastManager.show('Part updated successfully!', 'success');
                    document.getElementById('editPartModal').style.display = 'none';
                    this.loadRecommendations();
                } catch (error) {
                    console.error('Error updating part:', error);
                    toastManager.show('Error updating part', 'error');
                }
            });
        }
    }

    // ... Rest der Klasse mit CRUD-Operationen für Recommendations und Parts
}

export default new RecommendationsAdmin(); 