// Departamentos y sus ciudades
const ubicaciones = {
  'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia'],
  'Bolívar': ['Cartagena', 'Magangué', 'Turbaco'],
  'Sucre': ['Sincelejo', 'Corozal', 'Tolú'],
};

const overlay = document.getElementById('overlay');
const form = document.getElementById('formUbicacion');
const selectDpto = document.getElementById('departamento');
const selectCiudad = document.getElementById('ciudad');
const textoUbicacion = document.getElementById('ubicacionActual');

// Llenar la lista de departamentos
Object.keys(ubicaciones).forEach((dpto) => {
  selectDpto.add(new Option(dpto, dpto));
});

// Al cambiar el departamento, mostrar solo sus ciudades
selectDpto.addEventListener('change', () => {
  const ciudades = ubicaciones[selectDpto.value] || [];
  selectCiudad.innerHTML = '';
  selectCiudad.add(new Option(ciudades.length ? 'Selecciona una ciudad' : 'Primero elige un departamento', ''));
  ciudades.forEach((ciudad) => selectCiudad.add(new Option(ciudad, ciudad)));
  selectCiudad.disabled = ciudades.length === 0;
});

function abrirModal() {
  overlay.hidden = false;
  selectDpto.focus();
}

function cerrarModal() {
  overlay.hidden = true;
}

// Guardar la elección
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ubicacion = `${selectCiudad.value}, ${selectDpto.value}`;
  textoUbicacion.textContent = ubicacion;
  try {
    localStorage.setItem('ubicacion', JSON.stringify({ dpto: selectDpto.value, ciudad: selectCiudad.value }));
  } catch (err) { /* sin almacenamiento disponible */ }
  cerrarModal();
});

// Formas de abrir y cerrar
document.getElementById('abrirModal').addEventListener('click', abrirModal);
document.getElementById('cerrarModal').addEventListener('click', cerrarModal);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) cerrarModal(); // clic fuera de la tarjeta
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !overlay.hidden) cerrarModal();
});

// Al cargar: si ya eligió antes, mostrarlo; si no, abrir el modal
let guardado = null;
try {
  guardado = JSON.parse(localStorage.getItem('ubicacion'));
} catch (err) { /* nada guardado */ }

if (guardado && ubicaciones[guardado.dpto]) {
  textoUbicacion.textContent = `${guardado.ciudad}, ${guardado.dpto}`;
  selectDpto.value = guardado.dpto;
  selectDpto.dispatchEvent(new Event('change'));
  selectCiudad.value = guardado.ciudad;
} else {
  abrirModal();
}
