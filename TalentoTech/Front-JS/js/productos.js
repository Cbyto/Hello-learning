document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.querySelector('.productos-container');
    const carritoIcon = document.querySelector('.cart-icon');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    async function cargarProductos() {
        try {
            // Traer sólo productos de "electronics"
            const resp = await fetch('https://fakestoreapi.com/products/category/electronics');
            const productos = await resp.json();
            productosContainer.innerHTML = '';

            productos.slice(0, 12).forEach(prod => {
                const card = document.createElement('div');
                card.className = 'producto-card';
                card.innerHTML = `
                    <img src="${prod.image}" alt="${prod.title}" class="detalle-img" data-id="${prod.id}">
                    <p class="producto-label">${prod.title}</p>
                    <p class="producto-precio">$${prod.price.toFixed(2)}</p>
                    <button data-id="${prod.id}" class="agregar-carrito">Agregar al carrito</button>
                `;
                productosContainer.appendChild(card);
            });

            // listeners
            //document.querySelectorAll('.detalle-img')
            //    .forEach(img => img.addEventListener('click', e => {
            //        const id = e.target.dataset.id;
            //        window.location.href = `detalle.html?id=${id}`;
            //    }));
            
            //document.querySelectorAll('.agregar-carrito')
            //    .forEach(btn => btn.addEventListener('click', e => {
            //        agregarAlCarrito(+e.target.dataset.id);
            //    }));

            // Boton agregar al carrito. Cambia con clic la leyenda y vuelve a la original
            document.querySelectorAll('.agregar-carrito')
                .forEach(btn => btn.addEventListener('click', e => {
                    const id = +e.target.dataset.id;
                    agregarAlCarrito(id);

                    // Feedback visual en el botón
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Agregado ✔';
                    e.target.disabled = true;

                    setTimeout(() => {
                        e.target.textContent = originalText;
                        e.target.disabled = false;
                    }, 1500);
                }));

        } catch (err) {
            productosContainer.innerHTML = '<p>Error al cargar productos.</p>';
            console.error(err);
        }
    }

    function agregarAlCarrito(id) {
        const item = carrito.find(x => x.id === id);
        if (item) {
            item.cantidad++;
        } else {
            // para no re-fetch la info completa, podés guardar sólo id y recuperar detalle en cart
            carrito.push({ id, cantidad: 1 });
        }
        guardarCarrito();
    }

    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarBadge();
    }

    function actualizarBadge() {
        const total = carrito.reduce((sum, i) => sum + i.cantidad, 0);
        carritoIcon.innerHTML = `<i class="fas fa-shopping-cart"></i> (${total})`;
    }

    carritoIcon.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    cargarProductos();
    actualizarBadge();
});
