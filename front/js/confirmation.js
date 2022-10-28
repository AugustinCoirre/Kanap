
  //--------------------------------------------------------------------------
// Récupération de l'id de la commande
//--------------------------------------------------------------------------

//la variable params récupère l'url de la page
const params = new URLSearchParams(document.location.search);
// la variable id va récupérer la valeur du paramètre _id
const id = params.get("commande");
console.log(id);

 let orderId = document.getElementById("orderId");

 orderId.innerHTML = `<br> ${id}`;

 sessionStorage.clear();
 localStorage.clear();