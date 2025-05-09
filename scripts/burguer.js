document.addEventListener('DOMContentLoaded', function() {
  console.log("Script de menú hamburguesa cargado");
  
  const menuToggle = document.getElementById('menu-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const navbar = document.getElementById('navbar');
  
  // Si no existe el botón de menú hamburguesa, lo creamos
  if (!menuToggle && navbar) {
      console.log("Creando botón de menú hamburguesa");
      
      // Crear el botón
      const newMenuToggle = document.createElement('button');
      newMenuToggle.id = 'menu-toggle';
      newMenuToggle.setAttribute('aria-label', 'Toggle menu');
      newMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      
      // Añadir el botón al navbar
      navbar.appendChild(newMenuToggle);
      
      // Actualizar la referencia
      let menuToggle = newMenuToggle;
  }
  
  // Si no existe el ID del menú, lo añadimos
  if (navbar && !navbarMenu) {
      const ulElement = navbar.querySelector('ul');
      if (ulElement) {
          ulElement.id = 'navbar-menu';
          // Actualizar la referencia
          let navbarMenu = ulElement;
      }
  }
  
  // Ahora configuramos el evento click
  if (menuToggle && navbarMenu) {
      console.log("Configurando eventos del menú");
      
      menuToggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("Botón de menú clickeado");
          
          navbarMenu.classList.toggle('active');
          this.classList.toggle('active');
          
          // Cambiar el ícono cuando se activa/desactiva
          const icon = this.querySelector('i');
          if (icon) {
              if (this.classList.contains('active')) {
                  icon.classList.remove('fa-bars');
                  icon.classList.add('fa-times');
              } else {
                  icon.classList.remove('fa-times');
                  icon.classList.add('fa-bars');
              }
          }
      });
      
      // Cerrar el menú al hacer clic fuera de él
      document.addEventListener('click', function(event) {
          const isClickInsideMenu = navbarMenu.contains(event.target);
          const isClickOnToggle = menuToggle.contains(event.target);
          
          if (!isClickInsideMenu && !isClickOnToggle && navbarMenu.classList.contains('active')) {
              navbarMenu.classList.remove('active');
              menuToggle.classList.remove('active');
              
              const icon = menuToggle.querySelector('i');
              if (icon) {
                  icon.classList.remove('fa-times');
                  icon.classList.add('fa-bars');
              }
          }
      });
      
      const menuLinks = navbarMenu.querySelectorAll('a');
      menuLinks.forEach(link => {
          link.addEventListener('click', function() {
              navbarMenu.classList.remove('active');
              menuToggle.classList.remove('active');
              
              const icon = menuToggle.querySelector('i');
              if (icon) {
                  icon.classList.remove('fa-times');
                  icon.classList.add('fa-bars');
              }
          });
      });
  } else {
      console.error("No se encontraron los elementos del menú");
  }
  
  function checkMenuToggleVisibility() {
      if (window.innerWidth <= 768 && menuToggle) {
          menuToggle.style.display = 'flex';
      } else if (menuToggle) {
          menuToggle.style.display = 'none';
      }
  }
  
  checkMenuToggleVisibility();
  window.addEventListener('resize', checkMenuToggleVisibility);
});