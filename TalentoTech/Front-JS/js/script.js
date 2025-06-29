// Seleccionamos todas las cards
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    // Primero cerramos todas las cards
    cards.forEach(c => {
      if (c !== card) c.classList.remove('active');
    });
    // Luego toggleamos la card clickeada
    card.classList.toggle('active');
  });
});

// Para validar el formulario
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form form");
  const errorMsg = document.getElementById("error-msg");

  form.addEventListener("submit", function (e) {
    e.preventDefault();         // Evita el envío por defecto

    // Obtener valores
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    // Validaciones básicas
    if (!nombre || !apellido || !email || !mensaje) {
      errorMsg.textContent = "Por favor completá todos los campos obligatorios.";
      return;
    }

    // Validación email básica. Va a tener que tener la forma xxxx@yyyy.zzz
    const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errorMsg.textContent = "Ingresá un email válido.";
      return;
    }

    if (mensaje.length < 15) {
      errorMsg.textContent = "El mensaje debe tener al menos 15 caracteres.";
      return;
    }

    // Si todo está bien
    errorMsg.textContent = "";
    alert("Formulario enviado correctamente. ¡Gracias por contactarnos!");
    form.reset();
  });
});
