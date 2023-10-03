const mainItems = document.querySelectorAll(
  '.main-item'
);

mainItems.forEach((mainItem) => {
  mainItem.addEventListener('click', () => {
    mainItem.classList.toggle(
      'main-item--open'
    );
  })
});


//ventana script

//const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("myModal");

//abre la ventana cuando se presiona el boton 
/*openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
});*/

// Cierra la ventana cuando se haga clic fuera de él
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

//validar la url 

function validarURL() {
  var url = document.getElementById("url").value;
  var urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

  if (!urlPattern.test(url)) {
      document.getElementById("url").style.borderColor = "red";
      alert("URL no válida");
      return false; 
  }

  return true; 
}

function resetBorderColor() {
  document.getElementById("url").style.borderColor = ""; 
}