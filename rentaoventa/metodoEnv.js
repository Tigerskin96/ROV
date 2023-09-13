     const miFormulario = document.getElementById('miFormulario');

    /*-------------------------------------------
    ---------------------------------------------
    Pintar botone al seleccionar todos
    ---------------------------------------------
    -------------------------------------------*/
    //Seleccionamos todos los botones
    const listUsers = document.querySelectorAll('input[name="users"]');
    const listCanal = document.querySelectorAll('input[name="canal"]');
    const listPlataform = document.querySelectorAll('input[name="plataforma"]');
    
    const allUsersBTN = document.querySelector('#users_all');
    const allPlataformBTN = document.querySelector('#plataforma_all');
    const allCanalBTN = document.querySelector('#canal_todos');

    allUsersBTN.addEventListener('click', (e)=>{
        if(e.target.checked){
            selectAll(true, listUsers);
        }else{
            selectAll(false, listUsers);
        }
    });
    allPlataformBTN.addEventListener('click', (e)=>{
        if(e.target.checked){
            selectAll(true, listPlataform);
        }else{
            selectAll(false, listPlataform);
        }
    });
    allCanalBTN.addEventListener('click', (e)=>{
        if(e.target.checked){
            selectAll(true, listCanal);
        }else{
            selectAll(false, listCanal);
        }
    });
    function selectAll(checked, list){
        if(checked){
            list.forEach((e)=>e.checked = true);
        }else{
            list.forEach((e)=>e.checked = false);
        }
    }


    miFormulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const radioDispositivoSeleccionado = document.querySelector('input[type="radio"][name="dispositivo"]:checked');
        const canalCheckboxes = document.querySelectorAll('input[name="canal"]:checked');
        const plataformaCheckboxes = document.querySelectorAll('input[name="plataforma"]:checked');

        const dispositivoSeleccionado = radioDispositivoSeleccionado ? radioDispositivoSeleccionado.value : '';
        const canalesSeleccionados = Array.from(canalCheckboxes).map(checkbox => checkbox.value);
        const plataformasSeleccionadas = Array.from(plataformaCheckboxes).map(checkbox => checkbox.value);

            let notificationValue = false; // Valor predeterminado es false

            if (dispositivoSeleccionado === 'ANDROID' || dispositivoSeleccionado === 'IOS' || dispositivoSeleccionado === 'NONE') {
            notificationValue = true;
            }
            
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const url = document.getElementById('url').value;
        const userIds = selectedUsersArray.map(user => user.id);
        let apiEndpoints = []; // Almacenar los endpoints 

        if (plataformasSeleccionadas.includes('Renta o Venta') || plataformasSeleccionadas.includes('Todos')) {
            apiEndpoints.push('https://inmobimapa-backend-develop.appspot.com/_ah/api/common/v1/sendMarketingRVPanel'); //endpoint ROV
        }

        if (plataformasSeleccionadas.includes('Global MLS') || plataformasSeleccionadas.includes('Todos')) {
            apiEndpoints.push('https://inmobimapa-backend-develop.appspot.com/_ah/api/common/v1/sendMarketingGPanel'); // endpoint Global
        }
        
        await subirImagen();

        const solicitud = {
            userIds: userIds, // llama el array que se debe de generar
            marketing: {
                userId: null, // quitalo para que sirva por lo que comento ricardo
                title: titulo,
                image: uploadedImageUrl,// debe de tomar la variable global de la subida de imagen
                body: descripcion,
                url: url
            },
            deviceTypeEnum: dispositivoSeleccionado, // solo toma el primer dispositivo seleccionado para que no truene
            email: canalesSeleccionados.includes('Email'),
            notification: notificationValue,
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

    const uploadResponse = await fetch('https://inmobimapa-backend-develop.appspot.com/upload', {
        method: 'POST',
        body: form
    });

    const uploadJsonResponse = await uploadResponse.json();

    if (uploadJsonResponse.items && uploadJsonResponse.items.length > 0) {
        uploadedImageUrl = uploadJsonResponse.items[0].thumbnail || ''; // debe almacenar la URL generada en el regreso
        return uploadJsonResponse; 
    }
}

async function subirImagen() {
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
            alert("la imagen se subio correctamente")
        } catch (error) {
            console.error('Upload error:', error);
        }
    } else {
        console.error('El archivo seleccionado no es válido.');
        alert("El archivo seleccionado no es válido.");
    }
}


/*

const selectedUsersArray = [];
// busqueda de usuarios
const searchBox = document.getElementById('search-box');
const resultsList = document.getElementById('results');
let selectedUser = null; // Variable global para almacenar el usuario 
let countdownTimer = null; // Variable para el temporizador de cuenta regresiva

searchBox.addEventListener('input', () => {
    clearTimeout(countdownTimer); // Reiniciar el temporizador si se ingresa una nueva letra o número
    countdownTimer = setTimeout(() => {
        const email = searchBox.value.trim();
        if (email !== '') {
            searchUsersByEmail(email);
        } else {
            resultsList.innerHTML = '';
        }
    }, 1500); // Establecer un temporizador de 1.5 segundos
});






async function searchUsersByEmail(email) {  //colocar timestap 1 
    try {
        //ROV API
        const response1 = await fetch(`https://inmobimapa-backend-develop.appspot.com/_ah/api/common/v1/getIdAndNameRVByEmail?email=${email}`);
        const data1 = await response1.json();

        //GlobalMLS API
        const response2 = await fetch(`https://inmobimapa-backend-develop.appspot.com/_ah/api/common/v1/getIdAndNameGByEmail?email=${email}`);
        const data2 = await response2.json();

        resultsList.innerHTML = '';

        // Procesa los datos de la API ROV
        if (data1.code === 200) {
            for (const key in data1.item) {
                if (data1.item.hasOwnProperty(key)) {
                    const userLi = document.createElement('li');
                    userLi.textContent = `${data1.item[key]} -ID: ${key} - Renta o venta`;
                    userLi.addEventListener('click', () => {
                        // Al hacer clic en el usuario, guárdalo en la variable global
                        selectedUser = {
                            name: data1.item[key],
                            id: key,
                            source: 'Renta o venta'
                        };
                        // Muestra una alerta con los detalles del usuario
                        showAlert(selectedUser);
                    });
                    resultsList.appendChild(userLi);
                }
            }
        }

        // Procesa los datos de la API GLOBALMLS
        if (data2.code === 200) {
            for (const key in data2.item) {
                if (data2.item.hasOwnProperty(key)) {
                    const userLi = document.createElement('li');
                    userLi.textContent = `${data2.item[key]} -ID: ${key} - GlobalMLS`;
                    userLi.addEventListener('click', () => {
                        // Al hacer clic en el usuario, guárdalo en la variable global
                        selectedUser = {
                            name: data2.item[key],
                            id: key,
                            source: 'GlobalMLS'
                        };
                        // Muestra una alerta con los detalles del usuario
                        showAlert(selectedUser);
                    });
                    resultsList.appendChild(userLi);
                }
            }
        }

        if (data1.code !== 200 && data2.code !== 200) {
            const errorLi = document.createElement('li');
            errorLi.textContent = 'No se encontraron usuarios con ese email.';
            resultsList.appendChild(errorLi);
        }
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
    }
}

function showAlert(user) {
    alert(`Usuario Seleccionado:\nNombre: ${user.name}\nID: ${user.id}\nFuente: ${user.source}`);
    // Agrega el usuario seleccionado al array global
    selectedUsersArray.push(user);
    console.log('ids agregados:', selectedUsersArray);
}

*/

const selectedUsersArray = [];
const searchBox = document.getElementById('search-box');
const resultsList = document.getElementById('results');
let selectedUser = null;
let countdownTimer = null;

searchBox.addEventListener('input', () => {
    clearTimeout(countdownTimer);
    countdownTimer = setTimeout(() => {
        const email = searchBox.value.trim();
        if (email !== '') {
            searchUsersByEmail(email);
        } else {
            resultsList.innerHTML = '';
        }
    }, 1500);
});

// Evento para detectar cambios en los checkboxes
const plataformaRentaVentaCheckbox = document.getElementById('plataforma_renta_venta');
const plataformaGlobalMLSCheckbox = document.getElementById('plataforma_global_mls');

plataformaRentaVentaCheckbox.addEventListener('change', () => {
    if (plataformaRentaVentaCheckbox.checked) {
        plataformaGlobalMLSCheckbox.checked = false; // Desmarca el otro checkbox si está marcado
    }
});

plataformaGlobalMLSCheckbox.addEventListener('change', () => {
    if (plataformaGlobalMLSCheckbox.checked) {
        plataformaRentaVentaCheckbox.checked = false; // Desmarca el otro checkbox si está marcado
    }
});

async function searchUsersByEmail(email) {
    try {
        let apiUrl = '';

        if (plataformaRentaVentaCheckbox.checked) {
            apiUrl = `https://inmobimapa-backend-develop.appspot.com/_ah/api/common/v1/getIdAndNameRVByEmail?email=${email}`;
        } else if (plataformaGlobalMLSCheckbox.checked) {
            apiUrl = `https://inmobimapa-backend-develop.appspot.com/_ah/api/common/v1/getIdAndNameGByEmail?email=${email}`;
        } else {
            return; // Si ninguno está seleccionado, no hagas nada.
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        resultsList.innerHTML = '';

        if (data.code === 200) {
            for (const key in data.item) {
                if (data.item.hasOwnProperty(key)) {
                    const userLi = document.createElement('li');
                    userLi.textContent = `${data.item[key]} -ID: ${key} - ${plataformaRentaVentaCheckbox.checked ? 'Renta o Venta' : 'GlobalMLS'}`;
                    userLi.addEventListener('click', () => {
                        selectedUser = {
                            name: data.item[key],
                            id: key,
                            source: plataformaRentaVentaCheckbox.checked ? 'Renta o Venta' : 'GlobalMLS'
                        };
                        showAlert(selectedUser);
                    });
                    resultsList.appendChild(userLi);
                }
            }
        }

        if (data.code !== 200) {
            const errorLi = document.createElement('li');
            errorLi.textContent = 'No se encontraron usuarios con ese email.';
            resultsList.appendChild(errorLi);
        }
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
    }
}

function showAlert(user) {
    alert(`Usuario Seleccionado:\nNombre: ${user.name}\nID: ${user.id}\nFuente: ${user.source}`);
    selectedUsersArray.push(user);
    console.log('ids agregados:', selectedUsersArray);
}
