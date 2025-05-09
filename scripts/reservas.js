(function() {
  emailjs.init("j4CBoG8o9GCBGIZvr");
})();

const firebaseConfig = {
  apiKey: "AIzaSyC05s84tQfQbiJua0G0LHnQsZP76HqxMk4",
  authDomain: "undertango.firebaseapp.com",
  projectId: "undertango",
  storageBucket: "undertango.appspot.com",
  messagingSenderId: "21199358960",
  appId: "1:21199358960:web:6b751db7c333403057ab35",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variables DOM
const bookingForm = document.getElementById("bookingForm");
const buttons = document.querySelectorAll(".select-button");
const hiddenInput = document.getElementById("show-type");
const messageDiv = document.getElementById("message");
const commentsTextarea = document.getElementById("comments");
const charCount = document.getElementById("char-count");
const submitButton = document.querySelector(".submit-button");

function showMessage(message, isSuccess) {
  messageDiv.innerHTML = message;
  messageDiv.className = isSuccess ? "success" : "error";
  
  setTimeout(() => {
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = document.getElementById("date").value;
  const showType = hiddenInput.value;
  
  if (!name) {
    showMessage("Por favor, ingresa tu nombre.", false);
    return false;
  }
  
  if (!email || !isValidEmail(email)) {
    showMessage("Por favor, ingresa un correo electrónico válido.", false);
    return false;
  }
  
  if (!date) {
    showMessage("Por favor, selecciona una fecha para el espectáculo.", false);
    return false;
  }
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    showMessage("Por favor, selecciona una fecha futura para tu reserva.", false);
    return false;
  }
  
  if (!showType) {
    showMessage("Por favor, selecciona un tipo de espectáculo.", false);
    return false;
  }
  
  return true;
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const sendEmail = (templateId, params) => {
  return emailjs.send("undertango", templateId, params);
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

function getShowTypeName(code) {
  const types = {
    'show-danza': 'Danza de Tango',
    'show-musica': 'Música de Tango',
    'show-hibrido': 'Show Híbrido',
    'show-triplefrontera': 'Show Triple Frontera',
    'megaevento': 'Megaevento',
    'otros': 'Otros formatos'
  };
  
  return types[code] || code;
}

document.addEventListener('DOMContentLoaded', function() {
  // Manejar selección de botones
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      hiddenInput.value = button.getAttribute("data-value");
    });
  });
  
  commentsTextarea.addEventListener("input", function() {
    const remaining = 300 - this.value.length;
    charCount.textContent = `${this.value.length}/300 caracteres`;
    
    // Cambiar color cuando se acerca al límite
    if (this.value.length > 250) {
      charCount.style.color = '#dc3545';
    } else {
      charCount.style.color = '#777';
    }
  });
  
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
  
  bookingForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const showType = hiddenInput.value;
    const comments = document.getElementById("comments").value;
    const formattedDate = formatDate(date);
    const showTypeName = getShowTypeName(showType);
    
    db.collection("showBookings")
      .add({
        name: name,
        email: email,
        date: date,
        showType: showType,
        showTypeName: showTypeName,
        comments: comments,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pendiente'
      })
      .then((docRef) => {
        console.log("Reserva registrada con ID: ", docRef.id);
        
        // Preparar datos para los emails
        const clientEmailParams = {
          to_name: name,
          email: email,
          from_name: "UnderTango Club",
          from_email: "undertangoclub@gmail.com",
          show_type: showTypeName,
          date: formattedDate,
          comments: comments,
          booking_id: docRef.id,
          message: `Gracias por su interés en nuestro espectáculo de ${showTypeName}. Hemos recibido su solicitud para el día ${formattedDate}. Nos pondremos en contacto con usted lo antes posible para confirmar los detalles.`
        };
        
        const teamEmailParams = {
          to_name: "Equipo UnderTango",
          from_name: name,
          from_email: email,
          show_type: showTypeName,
          date: formattedDate,
          email: email,
          comments: comments,
          booking_id: docRef.id,
          message: `Nueva reserva recibida para ${showTypeName} el día ${formattedDate}.`
        };
        
        const clientEmailPromise = sendEmail("template_client", clientEmailParams);
        const teamEmailPromise = sendEmail("template_team", teamEmailParams);
        
        return Promise.all([clientEmailPromise, teamEmailPromise]);
      })
      .then((responses) => {
        console.log("Correos enviados exitosamente", responses);
        showMessage("¡Solicitud de reserva enviada con éxito! Te hemos enviado un correo electrónico con los detalles de tu reserva. Nuestro equipo se pondrá en contacto contigo próximamente.", true);
        
        bookingForm.reset();
        buttons.forEach((btn) => btn.classList.remove("active"));
        hiddenInput.value = "";
        charCount.textContent = "0/300 caracteres";
        charCount.style.color = '#777';
        
        submitButton.disabled = false;
        submitButton.innerHTML = 'Enviar Solicitud';
      })
      .catch((error) => {
        console.error("Error en el proceso de reserva:", error);
        showMessage("Error al procesar la solicitud. Por favor, intenta de nuevo más tarde o contáctanos directamente por WhatsApp.", false);
        
        submitButton.disabled = false;
        submitButton.innerHTML = 'Enviar Solicitud';
      });
  });
  
  const animateOnScroll = () => {
    const cards = document.querySelectorAll('.highlight-card');
    
    cards.forEach(card => {
      const cardPosition = card.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (cardPosition < screenPosition) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  };
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();
});