// Texto cambiante en el slider
const texts = ["Vive la Pasión del Tango", "Siente el Ritmo en tu Alma", "Baila con el Corazón"]
let currentIndex = 0

function changeText() {
  const textElement = document.getElementById("slider-text")
  if (textElement) {
    textElement.style.opacity = "0"

    setTimeout(() => {
      textElement.textContent = texts[currentIndex]
      textElement.style.opacity = "1"
      currentIndex = (currentIndex + 1) % texts.length
    }, 500)
  }
}

// Cambiar texto cada 5 segundos
setInterval(changeText, 5000)

// Animación de scroll para navbar
function handleScroll() {
  const navbar = document.getElementById("navbar")
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
}

// Animación de secciones al hacer scroll
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar el observador para las secciones
  const sections = document.querySelectorAll("section")
  const timelineItems = document.querySelectorAll(".timeline-item")

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observar todas las secciones y elementos de la línea de tiempo
  sections.forEach((section) => observer.observe(section))
  timelineItems.forEach((item) => observer.observe(item))

  // Agregar noticias dinámicamente
  const newsContainer = document.getElementById("news-container")
  if (newsContainer) {
    const newsItems = [
      {
        title: "Un poco de historia del tango",
        content:
          "El tango es uno de los géneros musicales más icónicos y emblemáticos de la cultura argentina, y su origen se remonta a la ciudad de Buenos Aires a fines del siglo XIX.",
        link: "https://argentina-tango.net/2023/03/05/un-poco-de-historia-del-tango/",
      },
      {
        title: "Clases Online Disponibles",
        content:
          "Ahora puedes aprender tango desde la comodidad de tu hogar con nuestras nuevas clases en línea. Perfectas para principiantes y bailarines experimentados.",
        link: "https://hotmart.com/es/marketplace/productos/20-lecciones-de-tango/F62016758K",
      },
      {
        title: "Colección de Moda Otoño/Invierno",
        content:
          "Descubre nuestra nueva colección de ropa y accesorios inspirados en el tango argentino. Elegancia y estilo para cada ocasión.",
        link: "/public/pages/otonio-invierno-2025.pdf",
      },
    ]

    newsItems.forEach((item) => {
      const newsItem = document.createElement("a")
      newsItem.classList.add("news-item")
      newsItem.href = item.link
      newsItem.target = "_blank"
      newsItem.rel = "noopener noreferrer"
      newsItem.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.content}</p>
                <span class="read-more">Leer más →</span>
            `
      newsContainer.appendChild(newsItem)
    })
  }

  // Agregar evento de scroll para el navbar
  window.addEventListener("scroll", handleScroll)

  // Inicializar el navbar según la posición inicial
  handleScroll()

  // Smooth scroll para los enlaces del menú
  document.querySelectorAll('#navbar a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })

        // Cerrar el menú móvil si está abierto
        const menu = document.getElementById("navbar-menu")
        if (menu.classList.contains("active")) {
          menu.classList.remove("active")
          document.getElementById("menu-toggle").classList.remove("active")
        }
      }
    })
  })

  // Ajustar tamaños de imágenes inicialmente
  adjustImageSizes()

  // Ajustar tamaños de imágenes cuando cambia el tamaño de la ventana
  window.addEventListener("resize", adjustImageSizes)
})

// Añadir función para ajustar tamaños de imágenes según el dispositivo
function adjustImageSizes() {
  const windowWidth = window.innerWidth
  const imageContainers = document.querySelectorAll(".image-content")

  imageContainers.forEach((container) => {
    const img = container.querySelector("img")
    if (img) {
      // Ajustar tamaño de imagen según el ancho de la ventana
      if (windowWidth <= 360) {
        img.style.maxWidth = "75%"
      } else if (windowWidth <= 480) {
        img.style.maxWidth = "80%"
      } else if (windowWidth <= 768) {
        img.style.maxWidth = "85%"
      } else if (windowWidth <= 1024) {
        img.style.maxWidth = "90%"
      } else {
        img.style.maxWidth = "100%"
      }
    }
  })

  // Ajustar logos de clientes
  const clientLogos = document.querySelectorAll(".client-logos img")
  clientLogos.forEach((logo) => {
    if (windowWidth <= 360) {
      logo.style.maxWidth = "80px"
    } else if (windowWidth <= 480) {
      logo.style.maxWidth = "90px"
    } else if (windowWidth <= 768) {
      logo.style.maxWidth = "110px"
    } else if (windowWidth <= 1024) {
      logo.style.maxWidth = "150px"
    } else {
      logo.style.maxWidth = "180px"
    }
  })
}

