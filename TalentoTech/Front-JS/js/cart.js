document.addEventListener('DOMContentLoaded', async () => {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const tbody = document.querySelector('#tabla-carrito tbody');
  const totalUnidadesEl = document.getElementById('total-unidades');
  const totalPrecioEl = document.getElementById('total-precio');

  async function obtenerDetalles() {
    return Promise.all(carrito.map(async item => {
      const res = await fetch(`https://fakestoreapi.com/products/${item.id}`);
      const prod = await res.json();
      return { ...prod, cantidad: item.cantidad };
    }));
  }

  function renderTabla(productos) {
    tbody.innerHTML = '';
    let totalUnidades = 0;
    let totalPrecio = 0;

    productos.forEach(prod => {
      const subtotal = prod.price * prod.cantidad;
      totalUnidades += prod.cantidad;
      totalPrecio += subtotal;

      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${prod.title}</td>
        <td>$${prod.price.toFixed(2)}</td>
        <td>${prod.cantidad}</td>
        <td>$${subtotal.toFixed(2)}</td>
        <td class="acciones">
          <button class="sumar" data-id="${prod.id}">+</button>
          <button class="restar" data-id="${prod.id}">−</button>
        </td>
      `;
      tbody.appendChild(fila);
    });

    totalUnidadesEl.textContent = totalUnidades;
    totalPrecioEl.textContent = totalPrecio.toFixed(2);

    agregarEventos();
  }

  function agregarEventos() {
    document.querySelectorAll('.sumar').forEach(btn => {
      btn.addEventListener('click', () => modificarCantidad(+btn.dataset.id, 1));
    });
    document.querySelectorAll('.restar').forEach(btn => {
      btn.addEventListener('click', () => modificarCantidad(+btn.dataset.id, -1));
    });
  }

  // Cambiar cantidades
  function modificarCantidad(id, cambio) {
    const index = carrito.findIndex(p => p.id === id);
    if (index !== -1) {
      carrito[index].cantidad += cambio;
      if (carrito[index].cantidad < 1) {
        carrito.splice(index, 1);
      }
      localStorage.setItem('carrito', JSON.stringify(carrito));
      init();
    }
  }

  // Vaciar Carrito
  const btnVaciar = document.getElementById('vaciar-carrito');
  if (btnVaciar) {
    btnVaciar.addEventListener('click', () => {
      if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
        localStorage.removeItem('carrito');
        sessionStorage.removeItem('carrito'); // opcional
        location.reload();
      }
    });
  }

  async function init() {
    const productos = await obtenerDetalles();
    renderTabla(productos);
  }

  init() ;
}) ;