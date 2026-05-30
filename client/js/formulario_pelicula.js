const inputArchivos = document.getElementById('imagen');
const img = document.getElementById('resultado_imagen');
const icono = document.getElementById('icono_imagen')
const input_enviar = document.getElementById('imagen_enviar')
const imagen_error = document.getElementById('imagen_error')

// Escucha si el input de subir una imagen es usado y previsualiza la imagen y la convierte en base64 para enviarla al backend
inputArchivos.addEventListener('change', (event) => {

    // Obtiene los archivos de input
    const archivos = event.target.files;

    // Si no hay ningun archivo subido (se ha pulsado cancelar) entonces oculta la imagen y no hace bada mas
    if(archivos.length == 0) {
        icono.classList.remove('hidden');
        img.classList.add('hidden')
        img.src = ""
        return;
    }

    // Si hay un arcchivo subido se carga la previsualizacion de la imagen y carga el archivo en base64
    const archivo = archivos[0];
    img.src = URL.createObjectURL(archivo);
    icono.classList.add('hidden')
    img.classList.remove('hidden')


    // Si el archivo pesa mas de 200KB se manda un error de validacion y no hace nada mas
    if(archivo.size > 204800) {
        inputArchivos.setCustomValidity("Imagen demasiado grande, la imagen no puede superar los 200 KB");
        imagen_error.classList.remove('hidden')
        imagen_error.innerText = "Imagen demasiado grande, la imagen no puede superar los 200 KB";
        return;
    } else {
        imagen_error.classList.add('hidden')
        inputArchivos.setCustomValidity("")
    }

    // Se convierte el archivo a base64 y se carga en el input escondido en el formulario
    let resultado = '';

    const lector = new FileReader();
    lector.onloadend = (r) => {
        resultado = r.target.result
        input_enviar.value = resultado
    };
    lector.readAsDataURL(archivo)


   

})