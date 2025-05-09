document.addEventListener('DOMContentLoaded', () => {
    const revealButton = document.getElementById('reveal-button');
    const locationDetails = document.getElementById('location-details');
  
    revealButton.addEventListener('click', () => {
      locationDetails.classList.toggle('hidden');
      revealButton.textContent = locationDetails.classList.contains('hidden') ? '¿Dónde bailamos?' : 'Ocultar';
    });
  });

  let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-item');

document.addEventListener("DOMContentLoaded", function() {
  const slides = document.querySelectorAll(".slide");
  const indicators = document.querySelectorAll(".indicator");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  let currentIndex = 0;
  let autoPlayInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  prevButton.addEventListener("click", () => {
    prevSlide();
    stopAutoPlay();
  });

  nextButton.addEventListener("click", () => {
    nextSlide();
    stopAutoPlay();
  });

  indicators.forEach((indicator, i) => {
    indicator.addEventListener("click", () => {
      currentIndex = i;
      showSlide(currentIndex);
      stopAutoPlay();
    });
  });

  startAutoPlay();
});