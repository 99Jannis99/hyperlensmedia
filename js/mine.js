document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector('.home_testimonial_component');
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
  });