# Ejemplo de proyecto Node con Express, Nunjucks, Vite y Tailwind

## Modos de ejecución

En **desarrollo**, ejecutar en dos terminales distintos:

* `npm run dev` para poner en marcha el servidor Express
* `npm run dev:assets` para lanzar Vite en el puerto 5173 y llamarlo para que renderice los *assets* necesarios
* Acceder a la raíz del servidor (`http://localhost:3000` en este ejemplo)

En **producción**:

* `npm run build` para que Vite genere la estructura del sitio
* `npm run start` para poner en marcha el servidor
* Acceder a la raíz del servidor (`http://localhost:3000` en este ejemplo)
