    const miFormulario = document.getElementById('miFormulario');

    miFormulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dispositivoCheckboxes = document.querySelectorAll('input[name="dispositivo"]:checked');
        const canalCheckboxes = document.querySelectorAll('input[name="canal"]:checked');
        const plataformaCheckboxes = document.querySelectorAll('input[name="plataforma"]:checked');

        const dispositivosSeleccionados = Array.from(dispositivoCheckboxes).map(checkbox => checkbox.value);
        const canalesSeleccionados = Array.from(canalCheckboxes).map(checkbox => checkbox.value);
        const plataformasSeleccionadas = Array.from(plataformaCheckboxes).map(checkbox => checkbox.value);

        const userId = "6254769809129472"; // aqui debo obtener el arreglo de array 

        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const url = document.getElementById('url').value;

        let apiEndpoints = []; // Almacenar los endpoints 

        if (plataformasSeleccionadas.includes('Renta o Venta') || plataformasSeleccionadas.includes('Todos')) {
            apiEndpoints.push('https://inmobimapa-backend-develop.appspot.com/_ah/api/common/v1/sendMarketingRVPanel'); //endpoint ROV
        }

        if (plataformasSeleccionadas.includes('Global MLS') || plataformasSeleccionadas.includes('Todos')) {
            apiEndpoints.push('https://inmobimapa-backend-develop.appspot.com/_ah/api/common/v1/sendMarketingGPanel'); // endpoint Global
        }

        const solicitud = {
            userIds: [userId], // llama el array que se debe de generar
            marketing: {
                userId: null, // quitalo para que sirva por lo que comento ricardo
                title: titulo,
                image: uploadedImageUrl,// debe de tomar la variable global de la subida de imagen
                body: descripcion,
                url: url
            },
            deviceTypeEnum: dispositivosSeleccionados[0], // solo toma el primer dispositivo seleccionado para que no truene
            email: canalesSeleccionados.includes('Email'),
            notification: canalesSeleccionados.includes('Push'),
            telegram: canalesSeleccionados.includes('Telegram'),
            whatsApp: canalesSeleccionados.includes('WhatsApp')
        };

        console.log(JSON.stringify(solicitud)); // Imprime solicitud en la consola para verificar que se mande correcto

        try {
            for (const endpoint of apiEndpoints) {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(solicitud)
                });
                //aqui verificamos si se manda de manera correcta
                if (response.ok) {
                    console.log('Solicitud enviada con éxito a:', endpoint);
                } else {
                    console.error('Error al enviar la solicitud a:', endpoint);
                }
            }
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
        }

        // Reinicia el form al enviarlo
        miFormulario.reset();
    });




// Declarar de manera global la url
let uploadedImageUrl = '';

function isImageFile(file) {
    return file.type.startsWith('image/');
}

async function upload(files) {
    const form = new FormData();
    files.forEach(file => {
        form.append('file', file.source, file.name);
        form.append('fileName', file.name);
    });

    const response = await fetch('https://inmobimapa-backend-develop.appspot.com/upload2');
    const jsonResponse = await response.json();

    if (jsonResponse.item) {
        const uploadResponse = await fetch(jsonResponse.item, {
            method: 'POST',
            body: form
        });

        uploadedImageUrl = jsonResponse.thumbnail || ''; // aqui deberia guardar la url
        return uploadResponse.json();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const subirImagenBtn = document.getElementById('subirImagenBtn');
    subirImagenBtn.addEventListener('click', async function () {
        const archivoInput = document.getElementById('archivo');
        const archivo = archivoInput.files[0]; // Obtener la imagen

        if (archivo && isImageFile(archivo)) {
            const files = [
                {
                    name: archivo.name,
                    source: archivo
                }
            ];
            try {
                const result = await upload(files);
                console.log('Upload result:', result);
                console.log('Uploaded Image URL:', uploadedImageUrl);
            } catch (error) {
                console.error('Upload error:', error);
            }
        } else {
            console.error('El archivo seleccionado no es una imagen válida.');
        }
    });
});
