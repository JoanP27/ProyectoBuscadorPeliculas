
// =========================================================================
// 1. INSERCIÓN DE PELÍCULAS 
// =========================================================================
const peliculas = db.films.insertMany([
  {
    titulo: 'Inception',
    director: 'Christopher Nolan',
    anyo: 2010,
    sinopsis: 'Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños.',
    genero: 'Ciencia Ficción',
    imagen: ''
  },
  {
    titulo: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    anyo: 1994,
    sinopsis: 'Las vidas de dos asesinos de la mafia, un boxeador, la esposa de un gángster y un par de bandidos se entrelazan.',
    genero: 'Crimen',
    imagen: ''
  },
  {
    titulo: 'Interstellar',
    director: 'Christopher Nolan',
    anyo: 2014,
    sinopsis: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por asegurar la supervivencia de la humanidad.',
    genero: 'Ciencia Ficción',
    imagen: ''
  }
]);

// Obtener los ObjectIds que MongoDB acaba de generar para cada película
const idInception = peliculas.insertedIds[0];
const idPulpFiction = peliculas.insertedIds[1];
const idInterstellar = peliculas.insertedIds[2];

// =========================================================================
// 2. INSERCIÓN DE DETALLES / VALORACIONES (Colección: details)
// Usamos las variables anteriores para que coincidan exactamente con la 'ref'
// =========================================================================
db.details.insertMany([
  {
    filmId: idInception,
    nick: 'Cinefilo99',
    texto: 'Una obra maestra de la ciencia ficción, la banda sonora es increíble.',
    valoracion: 5,
    fecha: new Date()
  },
  {
    filmId: idInception,
    nick: 'MovieLover',
    texto: 'Un poco confusa al principio, pero visualmente es espectacular.',
    valoracion: 4,
    fecha: new Date()
  },
  {
    filmId: idPulpFiction,
    nick: 'TarantinoFan',
    texto: 'Diálogos memorables y una narrativa no lineal perfecta.',
    valoracion: 5,
    fecha: new Date()
  },
  {
    filmId: idInterstellar,
    nick: 'Astronauta',
    texto: 'Me hizo llorar. Científicamente fascinante y muy emotiva.',
    valoracion: 5,
    fecha: new Date()
  },
  {
    filmId: idInterstellar,
    nick: 'HaterGonnaHate',
    texto: 'Demasiado larga y el final no me convenció del todo.',
    valoracion: 2,
    fecha: new Date()
  }
]);

print("¡Inserciones completadas con éxito!");