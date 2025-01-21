import { supabase } from '../../js/supabase-config.js';

async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
        // Nicht eingeloggt - Weiterleitung zur Login-Seite
        window.location.href = 'login.html';
        return;
    }

    // Session in localStorage speichern
    localStorage.setItem('supabase.auth.token', session.access_token);
}

// Prüfe Authentifizierung beim Laden der Seite
checkAuth(); 