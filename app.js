// ======================= app.js =======================
// Chicos: lógica del "Hacer pedido" para playeras.
// Lee el formulario, calcula total (modelo * cantidad + extras + envío)
// y muestra un resumen. Está escrito paso a paso y con comentarios.

/** Utilidad: formatea a moneda MXN */
function toMXN(num) {
  return Number(num || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

/** Utilidad: toma precio desde data-precio (en selects/checks) */
function getPrecioFromDataset(el) {
  const raw = el?.dataset?.precio;
  return raw ? Number(raw) : 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos que usaremos:
  const form = document.getElementById('formPedido');
  const outNombre = document.getElementById('outNombre');
  const outLista  = document.getElementById('outLista');
  const outTotal  = document.getElementById('outTotal');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const confirmNombre = document.getElementById('confirmNombre');

  // Toast UX (aviso corto)
  const toastBtn = document.getElementById('btnToast');
  const toastEl  = document.getElementById('toastAviso');
  const toast    = bootstrap.Toast.getOrCreateInstance(toastEl);
  toastBtn.addEventListener('click', () => toast.show());

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recargar la página

    // 1) Leemos campos base
    const nombre = document.getElementById('nombreCliente').value.trim();
    const selModelo = document.getElementById('selModelo');
    const selTalla  = document.getElementById('selTalla');
    const selColor  = document.getElementById('selColor');
    const cantidad  = Number(document.getElementById('inpCantidad').value || 0);

    // Validación mínima:
    if (!nombre || !selModelo.value || !selTalla.value || !selColor.value || cantidad < 1) {
      alert('Completa nombre, modelo, talla, color y cantidad (mínimo 1).');
      return;
    }

    // 2) Precios base
    const optModelo = selModelo.options[selModelo.selectedIndex];
    const precioModelo = getPrecioFromDataset(optModelo); // precio unitario del modelo
    let total = precioModelo * cantidad;

    // 3) Extras / personalización
    const chkNombreNumero = document.getElementById('chkNombreNumero');
    const chkParcheLiga   = document.getElementById('chkParcheLiga');

    const extrasSeleccionados = [];
    if (chkNombreNumero.checked) {
      total += getPrecioFromDataset(chkNombreNumero) * cantidad; // costo por prenda
      extrasSeleccionados.push('Nombre y número');
    }
    if (chkParcheLiga.checked) {
      total += getPrecioFromDataset(chkParcheLiga) * cantidad; // costo por prenda
      extrasSeleccionados.push('Parche de liga');
    }

    // Campos condicionales (solo se muestran en resumen si tienen contenido)
    const inpNombre = document.getElementById('inpNombre').value.trim();
    const inpNumero = document.getElementById('inpNumero').value.trim();

    // 4) Envío e instrucciones
    const selEnvio = document.getElementById('selEnvio');
    const optEnvio = selEnvio.options[selEnvio.selectedIndex];
    const costoEnvio = getPrecioFromDataset(optEnvio);
    total += costoEnvio;

    const txtInstr = document.getElementById('txtInstrucciones').value.trim();

    // 5) Pintamos resumen
    outNombre.textContent = nombre;

    // Lista HTML del pedido
    outLista.innerHTML = `
      <li><strong>Modelo:</strong> ${selModelo.value} — ${toMXN(precioModelo)} c/u × ${cantidad}</li>
      <li><strong>Talla:</strong> ${selTalla.value}</li>
      <li><strong>Color:</strong> ${selColor.value}</li>
      <li><strong>Extras:</strong> ${extrasSeleccionados.length ? extrasSeleccionados.join(', ') : 'Ninguno'}</li>
      ${inpNombre || inpNumero ? `<li><strong>Personalización:</strong> ${inpNombre ? 'Nombre: ' + inpNombre : ''} ${inpNumero ? ' | Número: ' + inpNumero : ''}</li>` : ''}
      <li><strong>Envío:</strong> ${selEnvio.value} — ${toMXN(costoEnvio)}</li>
      ${txtInstr ? `<li><strong>Instrucciones:</strong> ${txtInstr}</li>` : ''}
    `;

    outTotal.textContent = toMXN(total);

    // Habilitamos confirmar y pasamos nombre al modal
    btnConfirmar.disabled = false;
    confirmNombre.textContent = nombre;
  });

  // Reset: limpiar también el resumen
  form.addEventListener('reset', () => {
    setTimeout(() => {
      outNombre.textContent = '—';
      outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido.</li>';
      outTotal.textContent = '$0';
      btnConfirmar.disabled = true;
    }, 0);
  });
});
// ===================== /app.js ======================

// ================== Actividades DOM (Banner, Testimonios, Contacto) ==================
document.addEventListener('DOMContentLoaded', () => {
  // -------- Actividad 1: Banner con getElementById --------
  // Chicos: selecciono el banner por ID y el botón de demo.
  const banner = document.getElementById('banner');
  const btnPromo = document.getElementById('btnPromo');

  // Al hacer clic, cambio clases de Bootstrap (ej. bg-dark -> bg-warning).
  btnPromo?.addEventListener('click', () => {
    // Limpio posibles fondos previos del banner
    banner.classList.remove('bg-dark', 'bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning');
    // Aplico un nuevo color de fondo (warning = amarillo)
    banner.classList.add('bg-warning');
    // Ajusto contraste del texto
    banner.classList.remove('text-white');
    banner.classList.add('text-dark');
  });

  // -------- Actividad 2: Testimonios --------
  // 2.1 VIP en azul (text-primary) usando getElementsByClassName
  // Chicos: HTML marca VIP con .testimonio-vip; aquí iteramos y estilizamos.
  const vipItems = document.getElementsByClassName('testimonio-vip');
  for (const item of vipItems) {
    item.classList.add('text-primary'); // color azul Bootstrap
  }

  // 2.2 TODOS los párrafos en rojo (text-danger) usando getElementsByTagName
  // OJO: esto afecta toda la página como pide la actividad.
  // Si solo quieres afectar la sección de testimonios, usa la línea comentada.
  const allParagraphs = document.getElementsByTagName('p');
  // const allParagraphs = document.querySelectorAll('#testimonios p'); // <- opción localizada
  for (const p of allParagraphs) {
    p.classList.add('text-danger');
  }

  // -------- Actividad 3: Formulario de contacto --------
  // 3.1 Primer input de texto con querySelector (le pongo bg-success para resaltarlo)
  // Chicos: querySelector toma el primer match del selector CSS dado.
  const firstTextInput = document.querySelector('#formContacto input[type="text"]');
  firstTextInput?.classList.add('bg-success', 'bg-opacity-10'); // fondo verdoso suave

  // 3.2 Todos los botones del formulario a btn-danger con querySelectorAll
  const contactoButtons = document.querySelectorAll('#formContacto button');
  contactoButtons.forEach(btn => {
    // Quito estilos previos "suaves" y paso a rojo Bootstrap
    btn.classList.remove('btn-primary', 'btn-outline-secondary');
    btn.classList.add('btn-danger');
  });

  // 3.3 Campo "nombre" via getElementsByName -> color de texto text-warning
  // Chicos: getElementsByName devuelve una NodeList por atributo name.
  const nombreInputs = document.getElementsByName('nombre');
  if (nombreInputs.length > 0) {
    const nombreInput = nombreInputs[0];
    nombreInput.classList.add('text-warning'); // texto del input en amarillo
    // Opcional: también pinto el <label> asociado
    const label = document.querySelector('label[for="cNombre"]');
    label?.classList.add('text-warning');
  }
});

// ======= WhatsApp flotante: mostrar tras scroll + mensaje por horario =======
document.addEventListener('DOMContentLoaded', () => {
  const waBtn = document.querySelector('.whatsapp-float');
  if (!waBtn) return; // Si no hay botón en la página, salimos

  // 1) Mensaje dinámico según hora local (9 a 18 h "en línea")
  const h = new Date().getHours();
  const enHorario = h >= 9 && h < 18;
  const msg = enHorario ? '¡Respondo ahora!' : 'Fuera de horario, te contesto pronto';
  waBtn.title = `WhatsApp — ${msg}`;
  waBtn.setAttribute('aria-label', `Chatea por WhatsApp — ${msg}`);

  // (Opcional) Prefill del texto en el chat
  const telefono = '527221234567'; // Chicos: 52 + 10 dígitos (México)
  const texto = encodeURIComponent('Hola, vengo del sitio de Profe Joako. Me interesa una playera.');
  waBtn.href = `https://wa.me/${telefono}?text=${texto}`;

  // 2) Mostrar/ocultar por scroll (aparece al bajar 300px)
  const UMBRAL = 300;
  const toggleWA = () => {
    if (window.scrollY > UMBRAL) {
      waBtn.classList.add('show');
    } else {
      waBtn.classList.remove('show');
    }
  };

  // Estado inicial y listener
  toggleWA();
  window.addEventListener('scroll', toggleWA, { passive: true });
});
// ======== Cambio de fondo dinámico con movimiento del mouse ========
document.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  // genera colores HSL dinámicos con base al movimiento
  const hue = Math.floor(x * 360);
  const lightness = 50 + y * 10; // brillo cambia con el eje Y

  document.body.style.backgroundColor = `hsl(${hue}, 80%, ${lightness}%)`;
});
// ========= LÓGICA DEL CARRITO DE COMPRAS (INICIA) =========

// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    let cart = []; // Array para guardar los productos

    // --- Selectores de elementos del DOM ---
    const cartIconCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    const cartFooter = document.getElementById('cart-footer');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // --- Función principal: Actualizar la UI del carrito ---
    function updateCartUI() {
        // 1. Limpiar la lista actual
        cartItemsList.innerHTML = '';

        // 2. Revisar si el carrito está vacío
        if (cart.length === 0) {
            cartEmptyMsg.style.display = 'block';
            cartFooter.style.display = 'none';
            cartIconCount.textContent = '0';
        } else {
            cartEmptyMsg.style.display = 'none';
            cartFooter.style.display = 'block';
            
            let total = 0;
            let totalItems = 0;

            // 3. Recorrer el carrito y crear el HTML
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                totalItems += item.quantity;

                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';
                // Guardamos el id en el elemento para saber cuál borrar
                li.dataset.id = item.id; 

                li.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${item.img}" alt="${item.name}" class="cart-item-img me-2">
                        <div>
                            <small class="fw-bold d-block">${item.name}</small>
                            <small class="text-muted">${item.quantity} × $${item.price.toFixed(2)}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-2 mt-md-0">
                        <strong class="me-3">$${itemTotal.toFixed(2)}</strong>
                        <button class="btn btn-danger btn-sm btn-remove-item" aria-label="Eliminar item">
                            &times;
                        </button>
                    </div>
                `;
                cartItemsList.appendChild(li);
            });

            // 4. Actualizar contadores y total
            cartIconCount.textContent = totalItems;
            cartTotalPrice.textContent = `$${total.toFixed(2)} MXN`;
        }
    }

    // --- Función: Agregar item al carrito ---
    function addToCart(product) {
        // Buscar si el producto ya existe en el carrito
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            // Si existe, solo aumenta la cantidad
            existingItem.quantity++;
        } else {
            // Si no existe, lo agrega con cantidad 1
            cart.push({ ...product, quantity: 1 });
        }

        // Actualiza la UI
        updateCartUI();
    }

    // --- Función: Remover item del carrito ---
    function removeFromCart(productId) {
        // Filtra el array, conservando todos MENOS el que coincida con el id
        cart = cart.filter(item => item.id !== productId);
        
        // Actualiza la UI
        updateCartUI();
    }


    // --- Manejador de Clics (Event Delegation) ---
    document.body.addEventListener('click', (e) => {
        
        // 1. Clic en "Agregar al Carrito"
        const addBtn = e.target.closest('.btn-add-to-cart');
        if (addBtn) {
            // Previene el comportamiento default del botón
            e.preventDefault(); 
            
            // Obtiene los datos del producto desde los atributos data-*
            const product = {
                id: addBtn.dataset.id,
                name: addBtn.dataset.name,
                price: parseFloat(addBtn.dataset.price),
                img: addBtn.dataset.img
            };
            
            addToCart(product);

            // Opcional: Abrir el carrito automáticamente al agregar
            const offcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
            offcanvas.show();
        }

        // 2. Clic en "Eliminar" (botón rojo con '×')
        const removeBtn = e.target.closest('.btn-remove-item');
        if (removeBtn) {
            e.preventDefault();
            // Busca el <li> padre que tiene el data-id
            const itemId = removeBtn.closest('li').dataset.id;
            removeFromCart(itemId);
        }

    });

    // --- Inicializar la UI al cargar la página ---
    updateCartUI();

});
// ========= LÓGICA DEL CARRITO DE COMPRAS (TERMINA) =========