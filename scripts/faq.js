document.addEventListener('DOMContentLoaded', function() {
    // Manejo de las preguntas y respuestas
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        // Cerrar todas las demás preguntas
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        item.classList.toggle('active');
      });
    });
    
    // Manejo de los botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Quitar la clase active de todos los botones
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Añadir la clase active al botón clickeado
        button.classList.add('active');
        
        // Obtener la categoría seleccionada
        const filter = button.getAttribute('data-filter');
        
        // Filtrar los elementos según la categoría
        faqItems.forEach(item => {
          const category = item.getAttribute('data-category');
          
          if (filter === 'all' || filter === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
    
    // Función para abrir una pregunta específica desde la URL
    function openFaqFromHash() {
      const hash = window.location.hash;
      if (hash) {
        const targetCategory = hash.substring(1); // Eliminar el # del inicio
        
        // Activar el botón de filtro correspondiente
        filterButtons.forEach(btn => {
          const filter = btn.getAttribute('data-filter');
          if (filter === targetCategory) {
            btn.click();
          }
        });
        
        // Desplazarse a la sección de preguntas
        setTimeout(() => {
          document.querySelector('.faq-filter').scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
    
    // Ejecutar al cargar la página
    openFaqFromHash();
    
    // Escuchar cambios en el hash de la URL
    window.addEventListener('hashchange', openFaqFromHash);
    
    // Animación al hacer scroll
    const animateOnScroll = () => {
      const items = document.querySelectorAll('.faq-item');
      
      items.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (itemPosition < screenPosition) {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }
      });
    };
    
    // Aplicar estilos iniciales para la animación
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    // Ejecutar una vez al cargar la página
    setTimeout(animateOnScroll, 100);
  });