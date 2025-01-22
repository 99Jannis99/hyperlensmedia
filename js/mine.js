document.addEventListener("DOMContentLoaded", function() {
    // Slider-Funktionalität
    const slider = document.querySelector('.home_testimonial_component');
    if (slider) {  // Nur ausführen, wenn der Slider existiert
        const slides = slider.querySelectorAll('.home_testimonial_slide');
        const prevButton = slider.querySelector('.w-slider-arrow-left');
        const nextButton = slider.querySelector('.w-slider-arrow-right');
        const nav = slider.querySelector('.w-slider-nav');
        const autoplay = slider.getAttribute('data-autoplay') === 'true';
        let currentIndex = 0;
        let timer;

        function updateSlider() {
            const slideWidth = slides[0].clientWidth;
            slider.querySelector('.w-slider-mask').style.transform = `translateX(${-currentIndex * slideWidth}px)`;
            nav.querySelectorAll('div').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function createNavigation() {
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateSlider();
                    resetAutoplay();
                });
                nav.appendChild(dot);
            });
        }

        function prevSlide() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateSlider();
            resetAutoplay();
        }

        function nextSlide() {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
            resetAutoplay();
        }

        function startAutoplay() {
            if (autoplay) {
                timer = setInterval(nextSlide, parseInt(slider.getAttribute('data-delay'), 10));
            }
        }

        function resetAutoplay() {
            if (autoplay) {
                clearInterval(timer);
                startAutoplay();
            }
        }

        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);

        window.addEventListener('resize', updateSlider);

        createNavigation();
        updateSlider();
        startAutoplay();
    }

    // Kontaktformular-Handler
    const contactForm = document.getElementById('wf-form-Contact-4-Form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            try {
                // Hole die E-Mail-Adresse aus den Einstellungen
                const { data: settings, error: settingsError } = await supabase
                    .from('settings')
                    .select('value')
                    .eq('key', 'contact_email')
                    .single();

                if (settingsError) throw settingsError;

                // Hier können Sie die E-Mail an settings.value senden
                console.log('Sende E-Mail an:', settings.value);
                console.log('Formulardaten:', formObject);

                // Erfolgsmeldung anzeigen
                const successMessage = document.querySelector('.success-message');
                const errorMessage = document.querySelector('.error-message');
                
                if (successMessage) successMessage.style.display = 'block';
                if (errorMessage) errorMessage.style.display = 'none';
                
                this.reset();
            } catch (error) {
                console.error('Fehler beim Senden des Formulars:', error);
                const errorMessage = document.querySelector('.error-message');
                const successMessage = document.querySelector('.success-message');
                
                if (errorMessage) errorMessage.style.display = 'block';
                if (successMessage) successMessage.style.display = 'none';
            }
        });
    }

    // Mobile Menu Handler
    const menuButton = document.querySelector('.navbar5_menu-button');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuButton && menuOverlay) {
        menuButton.addEventListener('click', function() {
            if (menuOverlay.style.display === 'none' || !menuOverlay.style.display) {
                menuOverlay.style.display = 'block';
                menuOverlay.style.height = '0';
                setTimeout(() => {
                    menuOverlay.style.height = '100vh';
                }, 10);
            } else {
                menuOverlay.style.height = '0';
                setTimeout(() => {
                    menuOverlay.style.display = 'none';
                }, 300);
            }
        });
    }
});