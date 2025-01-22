document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            
            fetch('/process_form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                const card = form.closest('.card');
                if (data.success) {
                    card.classList.remove('error');
                    card.classList.add('success');
                    form.reset();
                } else {
                    card.classList.remove('success');
                    card.classList.add('error');
                }
                // Nachricht anzeigen
                const messageElement = document.createElement('div');
                messageElement.textContent = data.message;
                messageElement.classList.add('form-message');
                form.appendChild(messageElement);
                
                // Nachricht nach 5 Sekunden ausblenden
                setTimeout(() => {
                    messageElement.remove();
                    card.classList.remove('success', 'error');
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                const card = form.closest('.card');
                card.classList.remove('success');
                card.classList.add('error');
                const messageElement = document.createElement('div');
                messageElement.textContent = 'Es gab einen Fehler beim Senden des Formulars. Bitte versuchen Sie es später erneut.';
                messageElement.classList.add('form-message');
                form.appendChild(messageElement);
                
                // Nachricht nach 5 Sekunden ausblenden
                setTimeout(() => {
                    messageElement.remove();
                    card.classList.remove('error');
                }, 5000);
            });
        });
    }
});
