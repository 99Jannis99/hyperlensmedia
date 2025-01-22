import { supabase } from '../../js/supabase-config.js';

class AdminColorManager {
    constructor() {
        this.checkAuthAndInitialize();
    }

    async checkAuthAndInitialize() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error || !user) {
                this.showLoginMessage();
                return;
            }

            // Nur wenn der Benutzer eingeloggt ist
            this.initializeEventListeners();
            this.loadColorSchemes();
            this.loadSettings();
            initializeNavigation();
        } catch (error) {
            this.showLoginMessage();
        }
    }

    showLoginMessage() {
        const container = document.querySelector('.admin-container');
        container.innerHTML = `
            <div class="login-message-container">
                <h1>Sie müssen sich als Admin einloggen!</h1>
                <a href="login.html" class="button login-redirect-button">Zum Login</a>
            </div>
        `;
    }

    async loadColorSchemes() {
        try {
            const { data: colorSchemes, error } = await supabase
                .from('color_scheme')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.displayColorSchemes(colorSchemes);
        } catch (error) {
            console.error('Fehler beim Laden der Farbschemas:', error);
            alert('Fehler beim Laden der Farbschemas');
        }
    }

    displayColorSchemes(colorSchemes) {
        const container = document.getElementById('colorSchemesList');
        container.innerHTML = '';

        colorSchemes.forEach(scheme => {
            const card = this.createColorSchemeCard(scheme);
            container.appendChild(card);
        });
    }

    createColorSchemeCard(scheme) {
        const card = document.createElement('div');
        card.className = `color-scheme-card ${scheme.active ? 'active-scheme' : ''}`;
        
        card.innerHTML = `
            <h4>${scheme.name}</h4>
            <div class="color-preview">
                <div class="color-box" style="background-color: ${scheme.primary_color}"></div>
                <div class="color-box" style="background-color: ${scheme.secondary_color}"></div>
                <div class="color-box" style="background-color: ${scheme.text_color}"></div>
                <div class="color-box" style="background-color: ${scheme.background_color}"></div>
            </div>
            <button class="button" onclick="window.adminColorManager.activateScheme('${scheme.id}')" 
                    ${scheme.active ? 'disabled' : ''}>
                ${scheme.active ? 'Aktiv' : 'Aktivieren'}
            </button>
            <button class="button is-secondary" onclick="window.adminColorManager.deleteScheme('${scheme.id}')">
                Löschen
            </button>
        `;

        return card;
    }

    async activateScheme(schemeId) {
        try {
            // Hole alle Schemas
            const { data: allSchemes, error: fetchError } = await supabase
                .from('color_scheme')
                .select('*');

            if (fetchError) throw fetchError;

            // Bereite die Updates vor
            const updatedSchemes = allSchemes.map(scheme => ({
                ...scheme,
                active: scheme.id === schemeId
            }));

            // Führe alle Updates in einer Operation durch
            const { error } = await supabase
                .from('color_scheme')
                .upsert(updatedSchemes);

            if (error) throw error;

            this.loadColorSchemes();
        } catch (error) {
            console.error('Fehler beim Aktivieren des Farbschemas:', error);
            alert('Fehler beim Aktivieren des Farbschemas');
        }
    }

    async deleteScheme(schemeId) {
        if (!confirm('Möchten Sie dieses Farbschema wirklich löschen?')) return;

        try {
            const { error } = await supabase
                .from('color_scheme')
                .delete()
                .eq('id', schemeId);

            if (error) throw error;

            this.loadColorSchemes();
        } catch (error) {
            console.error('Fehler beim Löschen des Farbschemas:', error);
            alert('Fehler beim Löschen des Farbschemas');
        }
    }

    async loadSettings() {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('key', 'contact_email')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                document.getElementById('contactEmail').value = data.value;
            }
        } catch (error) {
            console.error('Fehler beim Laden der Einstellungen:', error);
            alert('Fehler beim Laden der Einstellungen');
        }
    }

    initializeEventListeners() {
        const form = document.getElementById('addColorSchemeForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const newScheme = {
                name: formData.get('name'),
                primary_color: formData.get('primary_color'),
                secondary_color: formData.get('secondary_color'),
                text_color: formData.get('text_color'),
                background_color: formData.get('background_color'),
                active: false
            };

            try {
                const { error } = await supabase
                    .from('color_scheme')
                    .insert([newScheme]);

                if (error) throw error;

                form.reset();
                this.loadColorSchemes();
            } catch (error) {
                console.error('Fehler beim Hinzufügen des Farbschemas:', error);
                alert('Fehler beim Hinzufügen des Farbschemas');
            }
        });

        // Logout-Funktionalität
        document.getElementById('logoutButton').addEventListener('click', async () => {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                
                // Nach erfolgreichem Logout zur Login-Seite weiterleiten
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Fehler beim Logout:', error);
                alert('Fehler beim Logout');
            }
        });

        // Settings Form Handler
        const settingsForm = document.getElementById('generalSettingsForm');
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('contactEmail').value;

            try {
                const { error } = await supabase
                    .from('settings')
                    .upsert({ 
                        key: 'contact_email',
                        value: email,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'key'  // Bei Konflikt nach key updaten
                    });

                if (error) throw error;

                alert('Einstellungen wurden erfolgreich gespeichert');
            } catch (error) {
                console.error('Fehler beim Speichern der Einstellungen:', error);
                alert('Fehler beim Speichern der Einstellungen');
            }
        });
    }
}

// Globale Instanz erstellen für den Zugriff aus dem HTML
window.adminColorManager = new AdminColorManager();

// Navigation Funktionalität
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Aktiven Link aktualisieren
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Aktive Section aktualisieren
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
} 