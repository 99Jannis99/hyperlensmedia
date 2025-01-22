document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('wf-form-Contact-4-Form');
    if (form) {
        // Zuerst die aktuelle E-Mail-Adresse aus Supabase holen und loggen
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4a3V3eHFocnllaWZwd2Fkc2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Mzg5MTUsImV4cCI6MjA1MjQxNDkxNX0.iYtuUZqZrxR8jXuiMhoi_Y8x-BeZMdaHKV5uFF4XktU';
        
        fetch('https://fxkuwxqhryeifpwadsio.supabase.co/rest/v1/settings?select=value&key=eq.contact_email', {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0 && data[0].value) {
                console.log('Aktuelle E-Mail-Adresse in Supabase:', data[0].value);
            } else {
                console.error('Keine E-Mail-Adresse in der Datenbank gefunden');
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden der E-Mail-Adresse:', error);
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            
            // Debug: Zeige die gesendeten Daten
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            fetch('/process_form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Server response:', data);
                if (data.sent_to) {
                    console.log('E-Mail wurde gesendet an:', data.sent_to);
                }
                
                const successMessage = document.querySelector('.success-message');
                const errorMessage = document.querySelector('.error-message');
                
                if (data.success) {
                    if (successMessage) successMessage.style.display = 'block';
                    if (errorMessage) errorMessage.style.display = 'none';
                    form.reset();
                } else {
                    if (errorMessage) errorMessage.style.display = 'block';
                    if (successMessage) successMessage.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Detailed error:', error);
                const errorMessage = document.querySelector('.error-message');
                const successMessage = document.querySelector('.success-message');
                
                if (errorMessage) errorMessage.style.display = 'block';
                if (successMessage) successMessage.style.display = 'none';
            });
        });
    } else {
        console.warn('Kontaktformular konnte nicht gefunden werden');
    }
}); 