class Producto {
    constructor(nombre, precio, unidad, distribuidor, fechaCaducidad, fechaCompra, costoTotal, ingredientes) {
        this.nombre = nombre;
        this.precio = precio;
        this.unidad = unidad;
        this.distribuidor = distribuidor;
        this.fechaCaducidad = fechaCaducidad;
        this.fechaCompra = fechaCompra;
        this.costoTotal = costoTotal;
        this.cantidadActual = 0;
        this.imagen = '';
        this.ingredientes = ingredientes || []; // Nueva propiedad
    }
}

class Inventario {
    constructor() {
        this.productos = {};
    }

    agregarProducto(producto, cantidad) {
        if (producto.nombre in this.productos) {
            this.productos[producto.nombre].cantidadActual += cantidad;
        } else {
            this.productos[producto.nombre] = producto;
            this.productos[producto.nombre].cantidadActual = cantidad;
        }
    }

    removerProducto(nombre, cantidad) {
        if (nombre in this.productos && this.productos[nombre].cantidadActual >= cantidad) {
            this.productos[nombre].cantidadActual -= cantidad;
            return true;
        }
        return false;
    }
}

class Pedido {
    constructor() {
        this.items = {};
        this.total = 0;
    }

    agregarItem(producto, cantidad) {
        if (producto.nombre in this.items) {
            this.items[producto.nombre].cantidad += cantidad;
        } else {
            this.items[producto.nombre] = { ...producto, cantidad };
        }
        this.total += producto.precio * cantidad;
    }
}

class Mesa {
    constructor(numero) {
        this.numero = numero;
        this.pedido = new Pedido();
    }
}

class Venta {
    constructor(mesa, items, total, fecha) {
        this.mesa = mesa;
        this.items = items;
        this.total = total;
        this.fecha = fecha;
    }
}

class Restaurante {
    constructor() {
        this.inventarioCocina = new Inventario();
        this.ventas = [];
        this.mesas = Array.from({ length: 10 }, (_, i) => new Mesa(i + 1));
        this.iva = 0.19;
        this.propina = 0.10;
        this.productosMenu = {};
    }

    agregarProductoMenu(producto) {
        this.productosMenu[producto.nombre] = producto;
    }

    abastecerCocina(producto, cantidad) {
        this.inventarioCocina.agregarProducto(producto, cantidad);
    }

    realizarVenta(mesa) {
        const venta = new Venta(mesa.numero, mesa.pedido.items, mesa.pedido.total, new Date());
        this.ventas.push(venta);
        mesa.pedido = new Pedido();
        return true;
    }

    filtrarVentas(inicio, fin) {
        return this.ventas.filter(venta => venta.fecha >= inicio && venta.fecha <= fin);
    }
}

const restaurante = new Restaurante();

function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function inicializarHeader() {
    let header = document.querySelector('header');
    let configButton = document.createElement('button');
    configButton.innerHTML = '<i class="fas fa-cog"></i> Configurar IVA y Propina';
    configButton.onclick = mostrarConfiguracionIvaPropina;
    header.appendChild(configButton);
}

function guardarConfiguracionIvaPropina() {
    let iva = parseFloat(document.getElementById('iva').value) / 100;
    let propina = parseFloat(document.getElementById('propina').value) / 100;
    
    if (isNaN(iva) || isNaN(propina) || iva < 0 || propina < 0) {
        alert('Por favor, ingrese valores válidos para IVA y propina.');
        return;
    }

    restaurante.iva = iva;
    restaurante.propina = propina;
    closeModal();
    alert('Configuración guardada exitosamente.');
}

function mostrarConfiguracionIvaPropina() {
    let content = `
        <h3>Configurar IVA y Propina</h3>
        <div>
            <label for="iva">IVA (%):</label>
            <input type="number" id="iva" value="${restaurante.iva * 100}" min="0" max="100">
        </div>
        <div>
            <label for="propina">Propina (%):</label>
            <input type="number" id="propina" value="${restaurante.propina * 100}" min="0" max="100">
        </div>
        <button onclick="guardarConfiguracionIvaPropina()">Guardar</button>
    `;
    showModal('Configuración', content);
}

document.querySelector('.close').onclick = closeModal;

window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        closeModal();
    }
}

function agregarProducto() {
    let content = `
        <input id="nombre" placeholder="Nombre del producto">
        <input id="precio" type="number" placeholder="Precio del producto">
        <input id="imagen" placeholder="URL de la imagen">
        <select id="clasificacion">
            <option value="entradas">Entradas</option>
            <option value="platoPrincipal">Plato Principal</option>
            <option value="postres">Postres</option>
            <option value="bebidas">Bebidas</option>
        </select>
        <div id="ingredientes-container">
            <div class="ingrediente-input">
                <input class="ingrediente-nombre" placeholder="Nombre del ingrediente">
                <input class="ingrediente-cantidad" type="number" placeholder="Cantidad">
                <select class="ingrediente-unidad">
                    <option value="gramos">Gramos</option>
                    <option value="kilos">Kilos</option>
                    <option value="litros">Litros</option>
                    <option value="onzas">Onzas</option>
                    <option value="unidad">Unidad</option>
                </select>
                <button onclick="eliminarIngrediente(this)" class="btn-eliminar"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <button onclick="agregarIngredienteInput()">Agregar otro ingrediente</button>
        <button onclick="confirmarAgregarProducto()">Agregar Producto</button>
    `;
    showModal('Agregar Producto al Menú', content);
}

function agregarIngredienteInput() {
    let nuevoIngrediente = document.createElement('div');
    nuevoIngrediente.className = 'ingrediente-input';
    nuevoIngrediente.innerHTML = `
        <input class="ingrediente-nombre" placeholder="Nombre del ingrediente">
        <input class="ingrediente-cantidad" type="number" placeholder="Cantidad">
        <select class="ingrediente-unidad">
            <option value="gramos">Gramos</option>
            <option value="kilos">Kilos</option>
            <option value="litros">Litros</option>
            <option value="onzas">Onzas</option>
            <option value="unidad">Unidad</option>
        </select>
        <button onclick="eliminarIngrediente(this)" class="btn-eliminar"><i class="fas fa-times"></i></button>
    `;
    document.getElementById('ingredientes-container').appendChild(nuevoIngrediente);
}

function eliminarIngrediente(boton) {
    boton.closest('.ingrediente-input').remove();
}

function confirmarAgregarProducto() {
    let nombre = document.getElementById('nombre').value;
    let precio = parseFloat(document.getElementById('precio').value);
    let imagen = document.getElementById('imagen').value;
    let clasificacion = document.getElementById('clasificacion').value;
    let ingredientes = [];

    document.querySelectorAll('.ingrediente-input').forEach(ingredienteInput => {
        let nombreIngrediente = ingredienteInput.querySelector('.ingrediente-nombre').value;
        let cantidadIngrediente = parseFloat(ingredienteInput.querySelector('.ingrediente-cantidad').value);
        let unidadIngrediente = ingredienteInput.querySelector('.ingrediente-unidad').value;

        if (nombreIngrediente && cantidadIngrediente && unidadIngrediente) {
            ingredientes.push({
                nombre: nombreIngrediente,
                cantidad: cantidadIngrediente,
                unidad: unidadIngrediente
            });
        }
    });

    if (nombre && precio && imagen && clasificacion && ingredientes.length > 0) {
        let producto = new Producto(nombre, precio, 'unidad', '', '', new Date().toISOString().split('T')[0], precio, ingredientes);
        producto.imagen = imagen;
        producto.clasificacion = clasificacion;
        restaurante.agregarProductoMenu(producto);
        showModal('Éxito', `${nombre} agregado al menú con ${ingredientes.length} ingredientes`);
    } else {
        showModal('Error', 'Por favor, complete todos los campos y agregue al menos un ingrediente');
    }
}

function realizarVenta() {
    let content = `
        <select id="mesa">
            ${restaurante.mesas.map(mesa => `<option value="${mesa.numero}">Mesa ${mesa.numero}</option>`).join('')}
        </select>
        <div id="menu-tabs">
            <button class="tab-button active" onclick="cambiarTab(event, 'entradas')">Entradas</button>
            <button class="tab-button" onclick="cambiarTab(event, 'platoPrincipal')">Plato Principal</button>
            <button class="tab-button" onclick="cambiarTab(event, 'postres')">Postres</button>
            <button class="tab-button" onclick="cambiarTab(event, 'bebidas')">Bebidas</button>
        </div>
        <div id="menu-content"></div>
        <div id="pedido-actual"></div>
        <button onclick="confirmarPedido()">Confirmar Pedido</button>
    `;
    showModal('Realizar Venta', content);
    mostrarProductosMenu('entradas');
}

function mostrarProductosMenu(categoria) {
    let productosHTML = '';
    for (let producto of Object.values(restaurante.productosMenu)) {
        if (producto.clasificacion === categoria) {
            productosHTML += `
                <div class="producto-menu-item">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: ${formatearMoneda(producto.precio)}</p>
                    <button onclick="agregarAlPedido('${producto.nombre}')">Agregar al Pedido</button>
                </div>
            `;
        }
    }
    document.getElementById('menu-content').innerHTML = productosHTML;
}

function cambiarTab(event, categoria) {
    let tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";
    mostrarProductosMenu(categoria);
}

function agregarAlPedido(nombreProducto) {
    let mesaNumero = document.getElementById('mesa').value;
    let mesa = restaurante.mesas[mesaNumero - 1];
    let producto = restaurante.productosMenu[nombreProducto];
    
    if (!mesa.pedido.items[nombreProducto]) {
        mesa.pedido.agregarItem(producto, 1);
    } else {
        mesa.pedido.items[nombreProducto].cantidad += 1;
    }
    
    actualizarPedidoActual(mesa);
}

function actualizarPedidoActual(mesa) {
    let pedidoHTML = '<h3>Pedido Actual:</h3>';
    for (let item of Object.values(mesa.pedido.items)) {
        pedidoHTML += `
            <div class="item-pedido">
                <span>${item.nombre} - Cantidad: ${item.cantidad}</span>
                <button onclick="eliminarDelPedido('${item.nombre}')">Eliminar</button>
            </div>
        `;
    }
    pedidoHTML += `<p><strong>Total: ${formatearMoneda(mesa.pedido.total)}</strong></p>`;
    document.getElementById('pedido-actual').innerHTML = pedidoHTML;
}

function eliminarDelPedido(nombreProducto) {
    let mesaNumero = document.getElementById('mesa').value;
    let mesa = restaurante.mesas[mesaNumero - 1];
    
    if (mesa.pedido.items[nombreProducto].cantidad > 1) {
        mesa.pedido.items[nombreProducto].cantidad -= 1;
    } else {
        delete mesa.pedido.items[nombreProducto];
    }
    
    mesa.pedido.total = Object.values(mesa.pedido.items).reduce((total, item) => total + (item.precio * item.cantidad), 0);
    actualizarPedidoActual(mesa);
}

function confirmarPedido() {
    let mesaNumero = document.getElementById('mesa').value;
    let mesa = restaurante.mesas[mesaNumero - 1];
    
    if (Object.keys(mesa.pedido.items).length > 0) {
        showModal('Éxito', `Pedido confirmado para la Mesa ${mesaNumero}. Total: ${formatearMoneda(mesa.pedido.total)}`);
        actualizarEstadoMesas();
    } else {
        showModal('Error', 'No hay items en el pedido');
    }
}

function confirmarRealizarVenta() {
    let mesaNumero = parseInt(document.getElementById('mesa').value);
    let productoNombre = document.getElementById('producto').value;
    let cantidad = parseInt(document.getElementById('cantidad').value);
    if (mesaNumero && productoNombre && cantidad) {
        let mesa = restaurante.mesas[mesaNumero - 1];
        let producto = restaurante.productosMenu[productoNombre];
        mesa.pedido.agregarItem(producto, cantidad);
        showModal('Éxito', `Pedido agregado a la Mesa ${mesaNumero}`);
        actualizarEstadoMesas();
    } else {
        showModal('Error', 'Por favor, complete todos los campos');
    }
}

function abastecerCocina() {
    let content = `
        <div id="productos-container">
            <div class="producto-input">
                <input class="nombre" placeholder="Nombre del producto">
                <input class="cantidad" type="number" placeholder="Cantidad">
                <select class="unidad">
                    <option value="gramos">Gramos</option>
                    <option value="kilos">Kilos</option>
                    <option value="litros">Litros</option>
                    <option value="onzas">Onzas</option>
                    <option value="unidad">Unidad</option>
                </select>
                <input class="precio" type="number" placeholder="Precio por unidad">
                <input class="distribuidor" placeholder="Distribuidor">
                <input class="fechaCaducidad" type="date" placeholder="Fecha de caducidad">
                <input class="fechaCompra" type="date" placeholder="Fecha de compra">
            </div>
        </div>
        <button onclick="agregarProductoInput()">Agregar otro producto</button>
        <input id="costoTotal" type="number" placeholder="Costo total de la factura">
        <button onclick="confirmarAbastecerCocina()">Abastecer</button>
    `;
    showModal('Abastecer Cocina', content);
}

function agregarProductoInput() {
    let nuevoProducto = document.createElement('div');
    nuevoProducto.className = 'producto-input';
    nuevoProducto.innerHTML = `
        <input class="nombre" placeholder="Nombre del producto">
        <input class="cantidad" type="number" placeholder="Cantidad">
        <select class="unidad">
            <option value="gramos">Gramos</option>
            <option value="kilos">Kilos</option>
            <option value="litros">Litros</option>
            <option value="onzas">Onzas</option>
            <option value="unidad">Unidad</option>
        </select>
        <input class="precio" type="number" placeholder="Precio por unidad">
        <input class="distribuidor" placeholder="Distribuidor">
        <input class="fechaCaducidad" type="date" placeholder="Fecha de caducidad">
        <input class="fechaCompra" type="date" placeholder="Fecha de compra">
    `;
    document.getElementById('productos-container').appendChild(nuevoProducto);
}

function agregarProducto() {
    let content = `
        <input id="nombre" placeholder="Nombre del producto">
        <input id="precio" type="number" placeholder="Precio del producto">
        <input id="imagen" placeholder="URL de la imagen">
        <div id="ingredientes-container">
            <div class="ingrediente-input">
                <input class="ingrediente-nombre" placeholder="Nombre del ingrediente">
                <input class="ingrediente-cantidad" type="number" placeholder="Cantidad">
                <select class="ingrediente-unidad">
                    <option value="gramos">Gramos</option>
                    <option value="kilos">Kilos</option>
                    <option value="litros">Litros</option>
                    <option value="onzas">Onzas</option>
                    <option value="unidad">Unidad</option>
                </select>
            </div>
        </div>
        <button onclick="agregarIngredienteInput()">Agregar otro ingrediente</button>
        <button onclick="confirmarAgregarProducto()">Agregar Producto</button>
    `;
    showModal('Agregar Producto al Menú', content);
}

function agregarIngredienteInput() {
    let nuevoIngrediente = document.createElement('div');
    nuevoIngrediente.className = 'ingrediente-input';
    nuevoIngrediente.innerHTML = `
        <input class="ingrediente-nombre" placeholder="Nombre del ingrediente">
        <input class="ingrediente-cantidad" type="number" placeholder="Cantidad">
        <select class="ingrediente-unidad">
            <option value="gramos">Gramos</option>
            <option value="kilos">Kilos</option>
            <option value="litros">Litros</option>
            <option value="onzas">Onzas</option>
            <option value="unidad">Unidad</option>
        </select>
    `;
    document.getElementById('ingredientes-container').appendChild(nuevoIngrediente);
}

function confirmarAgregarProducto() {
    let nombre = document.getElementById('nombre').value;
    let precio = parseFloat(document.getElementById('precio').value);
    let imagen = document.getElementById('imagen').value;
    let ingredientes = [];

    document.querySelectorAll('.ingrediente-input').forEach(ingredienteInput => {
        let nombreIngrediente = ingredienteInput.querySelector('.ingrediente-nombre').value;
        let cantidadIngrediente = parseFloat(ingredienteInput.querySelector('.ingrediente-cantidad').value);
        let unidadIngrediente = ingredienteInput.querySelector('.ingrediente-unidad').value;

        if (nombreIngrediente && cantidadIngrediente && unidadIngrediente) {
            ingredientes.push({
                nombre: nombreIngrediente,
                cantidad: cantidadIngrediente,
                unidad: unidadIngrediente
            });
        }
    });

    if (nombre && precio && imagen && ingredientes.length > 0) {
        let producto = new Producto(nombre, precio, 'unidad', '', '', new Date().toISOString().split('T')[0], precio, ingredientes);
        producto.imagen = imagen;
        restaurante.agregarProductoMenu(producto);
        showModal('Éxito', `${nombre} agregado al menú con ${ingredientes.length} ingredientes`);
    } else {
        showModal('Error', 'Por favor, complete todos los campos y agregue al menos un ingrediente');
    }
}

function confirmarAbastecerCocina() {
    let productosContainer = document.getElementById('productos-container');
    if (!validarCampos(productosContainer)) {
        showModal('Error', 'Por favor, complete todos los campos correctamente');
        return;
    }

    let productosInputs = document.querySelectorAll('.producto-input');
    let costoTotal = parseFloat(document.getElementById('costoTotal').value);
    let productos = [];

    productosInputs.forEach(productoInput => {
        let nombre = productoInput.querySelector('.nombre').value;
        let cantidad = parseFloat(productoInput.querySelector('.cantidad').value);
        let unidad = productoInput.querySelector('.unidad').value;
        let precio = parseFloat(productoInput.querySelector('.precio').value);
        let distribuidor = productoInput.querySelector('.distribuidor').value;
        let fechaCaducidad = productoInput.querySelector('.fechaCaducidad').value;
        let fechaCompra = productoInput.querySelector('.fechaCompra').value;

        let producto = new Producto(nombre, precio, unidad, distribuidor, fechaCaducidad, fechaCompra, precio);
        productos.push({ producto, cantidad });
    });

    if (productos.length > 0 && costoTotal) {
        productos.forEach(({ producto, cantidad }) => {
            restaurante.abastecerCocina(producto, cantidad);
        });
        showModal('Éxito', `Se han abastecido ${productos.length} productos a la cocina. Costo total: ${formatearMoneda(costoTotal)}`);
        limpiarCampos(productosContainer);
    } else {
        showModal('Error', 'Por favor, complete todos los campos y asegúrese de agregar al menos un producto');
    }
}

function verInventario() {
    let inventarioMenu = generarInventarioMenu();
    let inventarioCocina = generarInventarioCocina();

    let content = `
        <div class="tabs">
            <button class="tab-button active" onclick="cambiarPestana(event, 'menu')">Productos del Menú</button>
            <button class="tab-button" onclick="cambiarPestana(event, 'cocina')">Inventario de Cocina</button>
        </div>
        <div id="menu" class="tab-content active">
            ${inventarioMenu}
        </div>
        <div id="cocina" class="tab-content">
            ${inventarioCocina}
        </div>
    `;

    showModal('Inventario', content);
}

// Modificación de la función generarInventarioMenu
function generarInventarioMenu() {
    let inventarioMenu = "<h3>Productos del Menú:</h3>";
    for (let [nombre, producto] of Object.entries(restaurante.productosMenu)) {
        inventarioMenu += `
        <div class="producto-menu">
            <h4>${nombre}</h4>
            <p>Precio: ${formatearMoneda(producto.precio)}</p>
            <h5>Ingredientes:</h5>
            <ul>
                ${producto.ingredientes.map(ingrediente => 
                    `<li>${ingrediente.nombre}: ${ingrediente.cantidad} ${ingrediente.unidad}</li>`
                ).join('')}
            </ul>
            <button onclick="editarProductoMenu('${nombre}')">Editar</button>
        </div>`;
    }
    return inventarioMenu;
}

// Nueva función para editar un producto del menú
function editarProductoMenu(nombreProducto) {
    let producto = restaurante.productosMenu[nombreProducto];
    let content = `
        <h3>Editar Producto: ${nombreProducto}</h3>
        <input id="edit-nombre" value="${nombreProducto}" placeholder="Nombre del producto">
        <input id="edit-precio" type="number" value="${producto.precio}" placeholder="Precio del producto">
        <input id="edit-imagen" value="${producto.imagen}" placeholder="URL de la imagen">
        <div id="edit-ingredientes-container">
            ${producto.ingredientes.map((ingrediente, index) => `
                <div class="ingrediente-input">
                    <input class="ingrediente-nombre" value="${ingrediente.nombre}" placeholder="Nombre del ingrediente">
                    <input class="ingrediente-cantidad" type="number" value="${ingrediente.cantidad}" placeholder="Cantidad">
                    <select class="ingrediente-unidad">
                        ${['gramos', 'kilos', 'litros', 'onzas', 'unidad'].map(unidad => 
                            `<option value="${unidad}" ${ingrediente.unidad === unidad ? 'selected' : ''}>${unidad}</option>`
                        ).join('')}
                    </select>
                    <button onclick="eliminarIngrediente(${index})">Eliminar</button>
                </div>
            `).join('')}
        </div>
        <button onclick="agregarIngredienteInput()">Agregar otro ingrediente</button>
        <button onclick="guardarEdicionProducto('${nombreProducto}')">Guardar Cambios</button>
    `;
    showModal('Editar Producto', content);
}

function eliminarIngrediente(index) {
    let container = document.getElementById('edit-ingredientes-container');
    let ingredientes = container.getElementsByClassName('ingrediente-input');
    if (ingredientes[index]) {
        ingredientes[index].remove();
    }
}

function guardarEdicionProducto(nombreOriginal) {
    let nuevoNombre = document.getElementById('edit-nombre').value;
    let nuevoPrecio = parseFloat(document.getElementById('edit-precio').value);
    let nuevaImagen = document.getElementById('edit-imagen').value;
    let nuevosIngredientes = [];

    document.querySelectorAll('#edit-ingredientes-container .ingrediente-input').forEach(ingredienteInput => {
        let nombreIngrediente = ingredienteInput.querySelector('.ingrediente-nombre').value;
        let cantidadIngrediente = parseFloat(ingredienteInput.querySelector('.ingrediente-cantidad').value);
        let unidadIngrediente = ingredienteInput.querySelector('.ingrediente-unidad').value;

        if (nombreIngrediente && cantidadIngrediente && unidadIngrediente) {
            nuevosIngredientes.push({
                nombre: nombreIngrediente,
                cantidad: cantidadIngrediente,
                unidad: unidadIngrediente
            });
        }
    });

    if (nuevoNombre && nuevoPrecio && nuevaImagen && nuevosIngredientes.length > 0) {
        let productoActualizado = new Producto(nuevoNombre, nuevoPrecio, 'unidad', '', '', new Date().toISOString().split('T')[0], nuevoPrecio, nuevosIngredientes);
        productoActualizado.imagen = nuevaImagen;

        // Eliminar el producto original si el nombre ha cambiado
        if (nuevoNombre !== nombreOriginal) {
            delete restaurante.productosMenu[nombreOriginal];
        }

        restaurante.productosMenu[nuevoNombre] = productoActualizado;
        showModal('Éxito', `${nuevoNombre} actualizado en el menú`);
        verInventario(); // Actualizar la vista del inventario
    } else {
        showModal('Error', 'Por favor, complete todos los campos y agregue al menos un ingrediente');
    }
}

function generarInventarioCocina() {
    let inventarioCocina = "<h3>Inventario de Cocina:</h3>";
    for (let [nombre, producto] of Object.entries(restaurante.inventarioCocina.productos)) {
        inventarioCocina += `<div class="producto-cocina">
            <h4>${nombre}</h4>
            <p>Cantidad: ${producto.cantidadActual} ${producto.unidad}</p>
            <p>Precio: ${formatearMoneda(producto.precio)}/${producto.unidad}</p>
            <p>Distribuidor: ${producto.distribuidor}</p>
            <p>Fecha de caducidad: ${formatearFecha(producto.fechaCaducidad)}</p>
            <p>Fecha de compra: ${formatearFecha(producto.fechaCompra)}</p>
            <p>Costo total: ${formatearMoneda(producto.costoTotal)}</p>
        </div>`;
    }
    return inventarioCocina;
}

function generarInputIngrediente(ingrediente = {}, index) {
    return `
        <div class="ingrediente-input" data-index="${index}">
            <input class="ingrediente-nombre" value="${ingrediente.nombre || ''}" placeholder="Nombre del ingrediente">
            <input class="ingrediente-cantidad" type="number" value="${ingrediente.cantidad || ''}" placeholder="Cantidad">
            <select class="ingrediente-unidad">
                ${['gramos', 'kilos', 'litros', 'onzas', 'unidad'].map(unidad => 
                    `<option value="${unidad}" ${ingrediente.unidad === unidad ? 'selected' : ''}>${unidad}</option>`
                ).join('')}
            </select>
            <button onclick="eliminarIngrediente(${index})" class="btn-eliminar"><i class="fas fa-trash"></i></button>
        </div>
    `;
}

function cambiarPestana(event, pestanaId) {
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    let tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    document.getElementById(pestanaId).classList.add("active");
    event.currentTarget.classList.add("active");
}

function verVentas() {
    let content = `
        <select id="filtro">
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="anio">Año</option>
        </select>
        <button onclick="filtrarVentas()">Filtrar</button>
        <div id="ventas-container"></div>
    `;
    showModal('Ventas', content);
    filtrarVentas();
}

function filtrarVentas() {
    let filtro = document.getElementById('filtro').value;
    let ahora = new Date();
    let inicio = new Date(ahora);

    switch(filtro) {
        case 'dia':
            inicio.setHours(0,0,0,0);
            break;
        case 'semana':
            inicio.setDate(ahora.getDate() - ahora.getDay());
            break;
        case 'mes':
            inicio.setDate(1);
            break;
        case 'anio':
            inicio.setMonth(0, 1);
            break;
    }

    let ventas = restaurante.filtrarVentas(inicio, ahora);
    let ventasHTML = "";

    ventas.forEach((venta, i) => {
        ventasHTML += `<h3>Venta ${i + 1} - Mesa ${venta.mesa}</h3>`;
        for (let item of Object.values(venta.items)) {
            ventasHTML += `
                <p>${item.nombre} - Cantidad: ${item.cantidad} - Valor: $${(item.precio * item.cantidad).toFixed(2)}</p>
            `;
        }
        ventasHTML += `<p><strong>Total: $${venta.total.toFixed(2)}</strong></p>
                       <p>Fecha: ${venta.fecha.toLocaleString()}</p>
                       <hr>`;
    });

    document.getElementById('ventas-container').innerHTML = ventasHTML;
}

function mostrarPedidoMesa(mesaNumero) {
    let mesa = restaurante.mesas[mesaNumero - 1];
    let content = `<h3>Pedido de Mesa ${mesaNumero}</h3>`;

    if (Object.keys(mesa.pedido.items).length === 0) {
        content += '<p>Esta mesa no tiene pedidos aún.</p>';
    } else {
        for (let item of Object.values(mesa.pedido.items)) {
            content += `
                <div class="producto-pedido">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="producto-info">
                        <h3>${item.nombre}</h3>
                        <p>Precio: ${formatearMoneda(item.precio)}</p>
                        <p>Cantidad: ${item.cantidad}</p>
                    </div>
                </div>
            `;
        }

        let subtotal = mesa.pedido.total;
        let iva = subtotal * restaurante.iva;
        let propina = subtotal * restaurante.propina;
        let total = subtotal + iva + propina;

        content += `
            <p><strong>Subtotal: ${formatearMoneda(subtotal)}</strong></p>
            <p>IVA (${(restaurante.iva * 100).toFixed(2)}%): ${formatearMoneda(iva)}</p>
            <p>Propina sugerida (${(restaurante.propina * 100).toFixed(2)}%): ${formatearMoneda(propina)}</p>
            <p><strong>Total: ${formatearMoneda(total)}</strong></p>
        `;
        content += `
            <button onclick="generarPreFactura(${mesaNumero})">Imprimir Pre-Factura</button>
            <button onclick="facturarMesa(${mesaNumero})">Facturar</button>
        `;
    }

    showModal(`Pedido Mesa ${mesaNumero}`, content);
}

function generarPreFactura(mesaNumero) {
    let mesa = restaurante.mesas[mesaNumero - 1];
    let subtotal = mesa.pedido.total;
    let iva = subtotal * restaurante.iva;
    let propina = subtotal * restaurante.propina;
    let total = subtotal + iva + propina;

    let preFacturaContent = `
        <html>
        <head>
            <title>Pre-Factura - Mesa ${mesaNumero}</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Bocatto criollo</h1>
            <h2>Nit: 123456789</h2>
            <h2>Pre-Factura - Mesa ${mesaNumero}</h2>
            <table>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                </tr>
    `;

    for (let item of Object.values(mesa.pedido.items)) {
        preFacturaContent += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>${formatearMoneda(item.precio)}</td>
                <td>${formatearMoneda(item.precio * item.cantidad)}</td>
            </tr>
        `;
    }

    preFacturaContent += `
                <tr>
                    <th colspan="3">Subtotal</th>
                    <td>${formatearMoneda(subtotal)}</td>
                </tr>
                <tr>
                    <th colspan="3">IVA (${(restaurante.iva * 100).toFixed(2)}%)</th>
                    <td>${formatearMoneda(iva)}</td>
                </tr>
                <tr>
                    <th colspan="3">Propina sugerida (${(restaurante.propina * 100).toFixed(2)}%)</th>
                    <td>${formatearMoneda(propina)}</td>
                </tr>
                <tr>
                    <th colspan="3">Total</th>
                    <th>${formatearMoneda(total)}</th>
                </tr>
            </table>
        </body>
        </html>
    `;

    let ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(preFacturaContent);
    ventanaImpresion.document.close();
    ventanaImpresion.print();
}

function actualizarTotalPreFactura() {
    let total = 0;
    document.querySelectorAll('.pre-factura-item').forEach(item => {
        const cantidad = parseFloat(item.querySelector('.item-cantidad').value);
        const precio = parseFloat(item.querySelector('.item-precio').value);
        const itemTotal = cantidad * precio;
        item.querySelector('.item-total').textContent = formatearMoneda(itemTotal);
        total += itemTotal;
    });
    document.getElementById('pre-factura-total').textContent = formatearMoneda(total);
}

function actualizarPreFactura(mesaNumero) {
    let mesa = restaurante.mesas[mesaNumero - 1];
    let nuevosPedidos = {};
    let nuevoTotal = 0;

    document.querySelectorAll('.pre-factura-item').forEach(item => {
        const nombre = item.querySelector('.item-nombre').value;
        const cantidad = parseInt(item.querySelector('.item-cantidad').value);
        const precio = parseFloat(item.querySelector('.item-precio').value);

        if (nombre && cantidad > 0 && precio >= 0) {
            nuevosPedidos[nombre] = {
                nombre: nombre,
                cantidad: cantidad,
                precio: precio
            };
            nuevoTotal += cantidad * precio;
        }
    });

    mesa.pedido.items = nuevosPedidos;
    mesa.pedido.total = nuevoTotal;

    showModal('Éxito', 'Pre-factura actualizada correctamente');
    generarPreFactura(mesaNumero);
}

function facturarMesaDesdePreFactura(mesaNumero) {
    actualizarPreFactura(mesaNumero);
    facturarMesa(mesaNumero);
}

function facturarMesa(mesaNumero) {
    let mesa = restaurante.mesas[mesaNumero - 1];
    if (restaurante.realizarVenta(mesa)) {
        showModal('Éxito', `Mesa ${mesaNumero} facturada. Total: $${mesa.pedido.total.toFixed(2)}`);
        actualizarEstadoMesas();
    } else {
        showModal('Error', 'No se pudo facturar. Verifique el inventario.');
    }
}

function inicializarMesas() {
    let gridMesas = document.getElementById('grid-mesas');
    for (let i = 1; i <= 10; i++) {
        let mesa = document.createElement('div');
        mesa.className = 'mesa';
        mesa.innerHTML = `<i class="fas fa-utensils"></i><br>Mesa ${i}`;
        mesa.onclick = () => mostrarPedidoMesa(i);
        gridMesas.appendChild(mesa);
    }
}

function actualizarEstadoMesas() {
    restaurante.mesas.forEach((mesa, index) => {
        let mesaElement = document.querySelectorAll('.mesa')[index];
        if (Object.keys(mesa.pedido.items).length > 0) {
            mesaElement.classList.add('ocupada');
        } else {
            mesaElement.classList.remove('ocupada');
        }
    });
}

function limpiarCampos(contenedor) {
    contenedor.querySelectorAll('input, select').forEach(elemento => {
        elemento.value = '';
    });
}

function validarCampos(contenedor) {
    let camposValidos = true;
    contenedor.querySelectorAll('input, select').forEach(elemento => {
        if (elemento.value.trim() === '') {
            camposValidos = false;
            elemento.classList.add('campo-invalido');
        } else {
            elemento.classList.remove('campo-invalido');
        }
    });
    return camposValidos;
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'COL'
    }).format(valor);
}

window.onload = function() {
    inicializarMesas();
    actualizarEstadoMesas();
    inicializarHeader(); 
}