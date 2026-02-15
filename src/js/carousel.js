document.addEventListener('click', function(e) {
  const prevBtn = e.target.closest('.carousel-prev');
  const nextBtn = e.target.closest('.carousel-next');
  const dot = e.target.closest('.carousel-dot');

  if (prevBtn || nextBtn || dot) {
    e.preventDefault();
    const carousel = e.target.closest('.carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    if (!track || slides.length === 0) return;

    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('is-active'));
    if (currentIndex === -1) currentIndex = 0;

    let newIndex = currentIndex;

    if (prevBtn) {
      newIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
    } else if (nextBtn) {
      newIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
    } else if (dot) {
      newIndex = Array.from(dots).indexOf(dot);
    }

    // Update track position
    track.style.transform = `translateX(-${newIndex * 100}%)`;

    // Update active states
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === newIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === newIndex);
    });
  }
});

// Initialize first slide as active
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const firstSlide = carousel.querySelector('.carousel-slide');
    const firstDot = carousel.querySelector('.carousel-dot');
    
    if (firstSlide) firstSlide.classList.add('is-active');
    if (firstDot) firstDot.classList.add('is-active');
  });
});
