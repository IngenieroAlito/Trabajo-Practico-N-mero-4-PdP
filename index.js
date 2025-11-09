import readlineSync from "readline-sync";
const crearTarea = (
  Titulo,
  Descripcion = "",
  Estado = "pendiente",
  Creacion = new Date().toLocaleString(), 
  UltimaEdicion = null,
  Vencimiento = "",
  Dificultad = "fácil"
) => {
  if (!Titulo || Titulo.trim() === "")
    throw new Error("El titulo no puede estar vacio");
  if (Titulo.length > 100)
    throw new Error("El titulo no puede superar los 100 caracteres");
  if (Descripcion.length > 500)
    throw new Error("La descripcion no puede superar los 500 caracteres");
  if (!Estado || Estado.trim() === "") Estado = "pendiente";
  if (!UltimaEdicion) UltimaEdicion = Creacion;
  if (!Dificultad || Dificultad.trim() === "") Dificultad = "facil";
  return Object.freeze({
    Titulo: Titulo.trim(),
    Descripcion: Descripcion.trim(),
    Estado,
    Creacion,
    UltimaEdicion,
    Vencimiento,
    Dificultad,
  });
};
const mostrarTarea = (tarea) => { 
  console.log("Título: " + tarea.Titulo);
  console.log("Descripción: " + (tarea.Descripcion || ""));
  console.log("Estado: " + tarea.Estado);
  console.log("Creación: " + tarea.Creacion);
  console.log("Última edición: " + tarea.UltimaEdicion);
  console.log("Vencimiento: " + (tarea.Vencimiento || ""));
  console.log("Dificultad: " + tarea.Dificultad);
};
const mostrarTareas = (tareas) => { 
  if (!Array.isArray(tareas)) { 
    console.log("¡Error! la lista de tareas no es valida");
    return;
  }
  if (tareas.length === 0) {
    console.log("No hay tareas cargadas");
    return;
  }
  tareas.forEach((t, i) => {
    console.log("Tarea " + (i + 1) + ":");
    mostrarTarea(t);
  });
};
const buscarTarea = (titulo, tareas) => {
  if (!Array.isArray(tareas)) return undefined;
  return tareas.find((t) => t.Titulo === titulo);
};
const agregarTarea = (tareas, nuevaTarea) => {
  if (!Array.isArray(tareas)) tareas = [];
  return Object.freeze([...tareas, nuevaTarea]);
};
const editarTarea = (tareas, titulo, cambios) => {
  if (!Array.isArray(tareas)) return [];
  return Object.freeze(
    tareas.map((t) =>
      t.Titulo === titulo
        ? Object.freeze({
            ...t,
            ...cambios,
            UltimaEdicion: new Date().toLocaleString(),
          })
        : t
    )
  );
};
const menuVerTareas = (tareas) => {
let opcion2;
do {
console.log("1- Ver todas las tareas");
console.log("2- Ver tareas pendientes");
console.log("3- Ver tareas en curso");
console.log("4- Ver tareas terminadas");
console.log("5- Volver");
opcion2 = readlineSync.question("Elige una opcion: ");
switch (opcion2) {
case "1":
mostrarTareas(tareas);
break;
case "2":
mostrarTareas(tareas.filter((t) => t.Estado.toLowerCase().trim() === "pendiente"));
break;
case "3":
mostrarTareas(tareas.filter((t) => t.Estado.toLowerCase().trim() === "en curso"));
break;
case "4":
mostrarTareas(tareas.filter((t) => t.Estado.toLowerCase().trim() === "terminada"));
break;
case "5":
console.log("Volviendo...");
break;
default: 
console.log("Opción incorrecta");
}
} while (opcion2 !== "5");
};
function menu() {
  let tareas = [];
  let opcion = 0;
  do {
    console.log("1- Ver tareas");
    console.log("2- Buscar tarea");
    console.log("3- Agregar tarea");
    console.log("4- Editar tarea");
    console.log("5- Salir");
    console.log("Recordatorio: el titulo es obligatorio, los demas apartados son opciones o tendran opciones por defecto");
    const entrada = readlineSync.question("Elige una opcion: ");
    opcion = parseInt(entrada);
    switch (opcion) {
      case 1:
        menuVerTareas(tareas);
        break;
      case 2: {
        const titulo = readlineSync.question("Ingrese el titulo a buscar: ");
        const encontrada = buscarTarea(titulo, tareas);
        encontrada ? mostrarTarea(encontrada) : console.log("No se encontro la tarea.");
        break;
      }
      case 3: {
        try {
          const titulo = readlineSync.question("Titulo: ");
          const descripcion = readlineSync.question("Descripción: ");
          const estado = readlineSync.question("Estado: ");
          const vencimiento = readlineSync.question("Fecha de vencimiento: ");
          const dificultad = readlineSync.question("Dificultad: ");
          const nueva = crearTarea(
            titulo,
            descripcion,
            estado,
            undefined,
            undefined,
            vencimiento,
            dificultad
          );
          tareas = agregarTarea(tareas, nueva);
          console.log("Tarea agregada correctamente");
        } catch (e) {
          console.error(e.message);
        }
        break;
      }
      case 4: {
        const titulo = readlineSync.question("Ingrese el titulo de la tarea a editar: ");
        const cambios = {};
        cambios.Descripcion = readlineSync.question("Nueva descripcion: ");
        cambios.Estado = readlineSync.question("Nuevo estado: ");
        cambios.Vencimiento = readlineSync.question("Nuevo vencimiento: ");
        cambios.Dificultad = readlineSync.question("Nueva dificultad: ");
        tareas = editarTarea(tareas, titulo, cambios);
        console.log("Tarea editada correctamente");
        break;
      }
      case 5:
        console.log("Chau");
        break;
      default:
        console.log("Opcion incorrecta");
    }
  } while (opcion !== 5);
}
menu();