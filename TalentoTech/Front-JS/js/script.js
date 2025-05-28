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