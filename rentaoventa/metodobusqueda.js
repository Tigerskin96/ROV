const searchBox = document.getElementById('search-box');
const resultsList = document.getElementById('results');
//const linkConnection = 'https://opi-backend.appspot.com/_ah/api/common/v1/';
const linkConnection = 'https://inmobimapa-backend-develop.appspot.com/_ah/api/common/v1/';

searchBox.addEventListener('input', async () => {
    const email = searchBox.value.trim();
    if (email !== '') {
        await searchUsersByEmail(email);
    } else {
        resultsList.innerHTML = '';
    }
});

async function searchUsersByEmail(email) {
    console.log(email)
    try {
        //ROV API
        const response1 = await fetch(`${linkConnection}getIdAndNameRVByEmail?email=${email}`);
        const data1 = await response1.json();

        //GlobalMLS API
        const response2 = await fetch(`${linkConnection}getIdAndNameGByEmail?email=${email}`);
        const data2 = await response2.json();

        resultsList.innerHTML = '';

        // Procesa los datos de la API ROV
        if (data1.code === 200) {
            for (const key in data1.item) {
                if (data1.item.hasOwnProperty(key)) {
                    const userLi = document.createElement('li');
                    userLi.textContent = `${data1.item[key]} -ID: ${key} - Renta o venta`;
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