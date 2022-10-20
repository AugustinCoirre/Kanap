//--------------------------------------------------------------------------
// Récupération de l'id du produit via l' URL
//--------------------------------------------------------------------------

//la variable params récupère l'url de la page
const params = new URLSearchParams(document.location.search);
// la variable id va récupérer la valeur du paramètre _id
const id = params.get("_id");
console.log(id);

//-------------------------------------------------------------
// Récupération des produits de l'api
//-------------------------------------------------------------

fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    // réponse en json
    if (res.ok) {
      return res.json();
    }
  })
  // reception et nommage du tableau "tableauCanape"
  .then(function (unCanape) {
    // retourne le tableau dans la console
    // console.log(unCanape);
    // execution de la fontion leCanape
    leCanape(unCanape);
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("erreur" + err);
  });

//------------------------------------------------------------------------
// fonction leCanape affichage du produit de l'api
//------------------------------------------------------------------------

function leCanape(unCanape) {
  // déclaration des variables pointage des éléments
  let imageAlt = document.querySelector("article div.item__img");
  let titre = document.querySelector("#title");
  let prix = document.querySelector("#price");
  let description = document.querySelector("#description");
  let couleurOption = document.querySelector("#colors");
  //ajout des éléments de manière dynamique
  imageAlt.innerHTML = `<img src="${unCanape.imageUrl}" alt="${unCanape.altTxt}">`;
  titre.textContent = `${unCanape.name}`;
  prix.textContent = `${unCanape.price}`;
  description.textContent = `${unCanape.description}`;
  // boucle pour chercher les couleurs pour chaque produit en fonction de sa clef/valeur
  for (let couleur of unCanape.colors) {
    // ajout des balises d'option couleur avec leur valeur
    couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
  }
}

let addToCart = document.getElementById("addToCart");

addToCart.onclick = ajouterPanier;

//-------------------------------------------------------------------
// fonction ajouterPanier crée un tableau "panier" dans le localstorage
//-------------------------------------------------------------------


function ajouterPanier() {
  let couleurOption = document.getElementById("colors");
  let selectColor = couleurOption.value;
  let addQuantity = document.getElementById("quantity");
  let quantity = parseInt(addQuantity.value);

 if (quantity < 1) {
  return;
 }

  // On récupère la valeur associer à la clé panier
  let panier = localStorage.getItem("panier");

  if (panier === null) {
    // création d'un tableau panier pour un nouveau client
    panier = [];
  } else {
    panier = JSON.parse(panier);
  }

  let exist = false;

  for (let article of panier) {
    if (article.id == id && article.couleur == selectColor) {
      article.quantity += quantity;
      exist = true;
    }
  }
  
// !exist ou exist == false
  if (!exist) {
    panier.push({
      id: id,
      couleur: selectColor,
      quantity: quantity,
    });
  }

  localStorage.setItem("panier", JSON.stringify(panier));
}
