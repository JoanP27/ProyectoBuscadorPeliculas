const inputArchivos = document.getElementById('imagen');
const img = document.getElementById('resultado_imagen');
const icono = document.getElementById('icono_imagen')
const input_enviar = document.getElementById('imagen_enviar')
const imagen_error = document.getElementById('imagen_error')

inputArchivos.addEventListener('change', (event) => {
    const archivos = event.target.files;

    if(archivos.length == 0) {
        icono.classList.remove('hidden');
        img.classList.add('hidden')
        img.src = ""
        return;
    }

    const archivo = archivos[0];
    img.src = URL.createObjectURL(archivo);
    icono.classList.add('hidden')
    img.classList.remove('hidden')

    if(archivo.size > 204800) {
        inputArchivos.setCustomValidity("Imagen demasiado grande, la imagen no puede superar los 200 KB");
        imagen_error.classList.remove('hidden')
        imagen_error.innerText = "Imagen demasiado grande, la imagen no puede superar los 200 KB";
        return;
    } else {
        imagen_error.classList.add('hidden')
        inputArchivos.setCustomValidity("")
    }

    let resultado = '';

    const lector = new FileReader();
    lector.onloadend = (r) => {
        resultado = r.target.result
        input_enviar.value = resultado
    };
    lector.readAsDataURL(archivo)


   

})