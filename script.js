let autosConsecionaria = [];

// Consumo de la API: (con datos de Prueba)
document.addEventListener("DOMContentLoaded", () => {
  fetch("autos.json")
    .then((res) => res.json())
    .then((data) => {
      autosConsecionaria = data;
    })
    .catch((err) => console.error("Error cargando autos:", err));
});

// Escuchar cambios en los radio buttons
document.querySelectorAll('input[name="accion"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    mostrarSeccion(e.target.value);
  });
});

function mostrarSeccion(accion) {
  const contenedor = document.getElementById("contenidoDinamico");
  contenedor.innerHTML = ""; // Limpiar el contenido

  if (accion === "cargar") {
    contenedor.innerHTML = `
      <h3>Cargar Auto</h3>
      <form onsubmit="guardarAuto(event)">
        <input class="form-control mb-2" type="text" id="vin" placeholder="VIN" required />
        <input class="form-control mb-2" type="text" id="marca" placeholder="Marca" required />
        <input class="form-control mb-2" type="text" id="modelo" placeholder="Modelo" required />
        <input class="form-control mb-2" type="number" id="anio" placeholder="Año" required />
        <input class="form-control mb-2" type="text" id="color" placeholder="Color" required />
        <button type="submit" class="btn btn-success">Guardar Auto</button>
      </form>
    `;
  } else if (accion === "buscar") {
    contenedor.innerHTML = `
      <h3>Buscar Auto por VIN</h3>
      <input class="form-control mb-2" type="text" id="buscarVin" placeholder="Ingresar VIN" />
      <button onclick="buscarPorVin()" class="btn btn-primary">Buscar</button>
      <div class="mt-3" id="resultadoBusqueda"></div>
    `;
  } else if (accion === "editar") {
    contenedor.innerHTML = `<p>Funcionalidad de editar auto (pendiente de implementación)</p>`;
  } else if (accion === "listar") {
    listarAutos();
  }
}

function guardarAuto(event) {
  event.preventDefault();
  const vin = document.getElementById("vin").value;
  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const anio = document.getElementById("anio").value;
  const color = document.getElementById("color").value;

  autosConsecionaria.push({ vin, marca, modelo, anio, color });

  Swal.fire({
    icon: "success",
    title: "Auto guardado",
    text: `${marca} ${modelo} ha sido agregado.`,
    //timer: 4000,
    showConfirmButton: true,
  });

  // Limpiar el formulario
  mostrarSeccion("cargar");
}

function buscarPorVin() {
  const vin = document.getElementById("buscarVin").value.trim().toUpperCase();
  const resultado = autosConsecionaria.find(
    (auto) => auto.vin.toUpperCase() === vin
  );
  const contenedor = document.getElementById("resultadoBusqueda");
  if (resultado) {
    contenedor.innerHTML = `<div class="alert alert-success">Auto encontrado: ${resultado.marca} ${resultado.modelo} (${resultado.anio}) - Color: ${resultado.color}</div>`;
  } else {
    contenedor.innerHTML = `<div class="alert alert-danger">No se encontró ningún auto con ese VIN.</div>`;
  }
}

function eliminarAuto(vin) {
  autosConsecionaria = autosConsecionaria.filter((a) => a.vin !== vin);
  Swal.fire({
    icon: "error",
    title: "Auto eliminado",
    text: `${vin} eliminado exitosamente.`,
    //timer: 4000,
    showConfirmButton: true,
  });
  listarAutos();
}

function listarAutos() {
  const contenedor = document.getElementById("contenidoDinamico");
  if (autosConsecionaria.length === 0) {
    contenedor.innerHTML = "<p>No hay autos cargados.</p>";
    return;
  }
  let html = '<h3>Lista de Autos</h3><ul class="list-group">';
  autosConsecionaria.forEach((auto) => {
    html += `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${auto.vin} - ${auto.marca} ${auto.modelo} (${auto.anio}) - ${auto.color}
            <button class="btn btn-sm btn-danger" onclick="eliminarAuto('${auto.vin}')">Eliminar</button>
    </li>`;
  });
  html += "</ul>";
  contenedor.innerHTML = html;
}

function mostrarFormularioEdicion(auto) {
  const contenedor = document.getElementById("contenidoDinamico");
  contenedor.innerHTML = `
    <h3>Editar Auto</h3>
    <form onsubmit="actualizarAuto(event, '${auto.vin}')">
      <input class="form-control mb-2" type="text" id="editMarca" value="${auto.marca}" required />
      <input class="form-control mb-2" type="text" id="editModelo" value="${auto.modelo}" required />
      <input class="form-control mb-2" type="number" id="editAnio" value="${auto.anio}" required />
      <input class="form-control mb-2" type="text" id="editColor" value="${auto.color}" required />
      <button type="submit" class="btn btn-warning">Actualizar Auto</button>
    </form>
  `;
}

function buscarAutoParaEditar() {
  const vin = document.getElementById("editarVin").value.trim().toUpperCase();
  const auto = autosConsecionaria.find((a) => a.vin.toUpperCase() === vin);
  if (auto) {
    mostrarFormularioEdicion(auto);
  } else {
    const contenedor = document.getElementById("contenidoDinamico");
    contenedor.innerHTML +=
      '<div class="alert alert-danger mt-3">No se encontró un auto con ese VIN.</div>';
  }
}

function actualizarAuto(event, vinOriginal) {
  event.preventDefault();
  const auto = autosConsecionaria.find(
    (a) => a.vin.toUpperCase() === vinOriginal.toUpperCase()
  );
  if (auto) {
    auto.marca = document.getElementById("editMarca").value;
    auto.modelo = document.getElementById("editModelo").value;
    auto.anio = document.getElementById("editAnio").value;
    auto.color = document.getElementById("editColor").value;

    Swal.fire({
      icon: "success",
      title: "Auto actualizado",
      text: `${auto.marca} ${auto.modelo} ha sido agregado.`,
      //timer: 4000,
      showConfirmButton: true,
    });

    mostrarSeccion("buscar");
  }
}

// Redefinir la sección editar para pedir VIN
if (typeof mostrarSeccion === "function") {
  const originalMostrarSeccion = mostrarSeccion;
  mostrarSeccion = function (accion) {
    const contenedor = document.getElementById("contenidoDinamico");
    contenedor.innerHTML = "";

    if (accion === "editar") {
      contenedor.innerHTML = `
        <h3>Editar Auto</h3>
        <input class="form-control mb-2" type="text" id="editarVin" placeholder="Ingresar VIN a editar" />
        <button onclick="buscarAutoParaEditar()" class="btn btn-warning">Buscar Auto</button>
      `;
    } else {
      originalMostrarSeccion(accion);
    }
  };
}
