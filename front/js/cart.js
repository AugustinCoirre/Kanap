//-------------------------------------------------------------
// Récupération des produits de l'api
//-------------------------------------------------------------
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    // réponse en json
    if (res.ok) {
      return res.json();
    }
  })
  // reception et nomage du tableau "tableauCanape"
  .then(tableauCanape => affichagePanier(tableauCanape))
  .catch(function (err) {
    // Une erreur est survenue
    console.log("erreur" + err);
  });

//-------------------------------------------------------------------
// fonction affichagePanier affiche tous le panier du client et fait les modifications en temps réel
//-------------------------------------------------------------------

function affichagePanier(tableauCanape) {
  // selection de la balise section avec l'ID = "cart_items"
  let selectItems = document.getElementById("cart__items");
  // On récupère la valeur associer à la clé panier
  let panier = localStorage.getItem("panier");
  panier = JSON.parse(panier);

  for (let article of panier) {
    for (let canape of tableauCanape) {
      if (article.id == canape._id) {
        // création de l'élement article avec un id et color unique     
        let createArticle = document.createElement("article");
        // on ajoute la class "cart__item" à la balise article
        createArticle.className = "cart__item";
        // on ajoute l'information "id" à la balise article
        createArticle.dataset.id = canape._id;
        // on ajoute l'information "color" à la balise article
        createArticle.dataset.color = article.couleur;

        // ajout du contenu des carts par item
        createArticle.innerHTML += `<div class="cart__item__img">
                <img src="${canape.imageUrl}" alt="${canape.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${canape.name}</h2>
                  <p>${article.couleur}</p>
                  <p>${canape.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>`;

        //on récupère le tableau des elements avec la class "deleteItem"  
        let tableauDeleteItem = createArticle.getElementsByClassName("deleteItem");
        //selection "<p class="deleteItem">Supprimer</p>" pour l'article en cours de création
        let deleteItemButton = tableauDeleteItem[0];
        //ajout d'une fonction au click du button "<p class="deleteItem">Supprimer</p>"
        deleteItemButton.addEventListener('click', function(){
          suppressionArticle(canape._id, article.couleur);
        });

        //on récupère le tableau des elements avec la class "itemQuantity"  
        let tableauQuantityArticle = createArticle.getElementsByClassName("itemQuantity");
        //selection "<input class="itemQuantity>" pour l'article en cours de création
        let quantityArticle = tableauQuantityArticle[0];
        //ajout d'une fonction au changement du button "<input class="itemQuantity>"
        quantityArticle.addEventListener('change', function(updateValue){
          changeQuantityArticle(canape._id, updateValue, article.couleur, tableauCanape);
        });

        // dans la section "#cart__items" on ajoute l'enfant article
        selectItems.appendChild(createArticle);
      }
    }
  }

//-------------------------------------------------------------------
// fonction suppressionArticle pour supprimer un article dans le localstorage et refresh pour supprimer la card dans le DOM
//-------------------------------------------------------------------

  function suppressionArticle (canapeId, canapeColor){

    //on récupère la chaine de caractère panier du localstorage et on le parse pour en récupérer le tableau 
    let panier = localStorage.getItem("panier");
    panier = JSON.parse(panier);

    // on va chercher la bonne ligne en vérifiant l'id et la couleur de l'article
    let indexSupression = panier.findIndex(lignePanier => lignePanier.id == canapeId && lignePanier.couleur == canapeColor);

    // Suppression de l'article selectionner
    panier.splice(indexSupression, 1);
    
    //on push le tableau panier avec les nouvelles valeurs et on le repasse en chaine de caractère
    localStorage.setItem("panier", JSON.stringify(panier));
    //permet de reload la page et donc de ne plus afficher l'article supprimer du localstorage
    return location.reload();
  }

//-------------------------------------------------------------------
// fonction changeQuantityArticle change une quantitée d'un article dans le localstorage
//-------------------------------------------------------------------
  
   function changeQuantityArticle (canapeId, updateValue, canapeColor, tableauCanape){

    //on récupère la chaine de caractère panier du localstorage et on le parse pour en récupérer le tableau 
    let panier = localStorage.getItem("panier");
    panier = JSON.parse(panier);

    // on récupère la quanitée changer par le client pour l'article voulu
    let newQuantityArticle = updateValue.target.value;

    let indexArticle = panier.findIndex(lignePanier => lignePanier.id == canapeId && lignePanier.couleur == canapeColor);
    let lastQuantityArticle = panier[indexArticle];
    
    // Remplacement par la nouvelle quantitée avec une valeur numérique et non une chaine de caractère
    lastQuantityArticle.quantity = parseFloat(newQuantityArticle);
    //on push le tableau panier avec les nouvelles valeurs et on le repasse en chaine de caractère
    localStorage.setItem("panier", JSON.stringify(panier));
    affichageTotal(tableauCanape);
  }


//-------------------------------------------------------------------
// fonction affichageTotal affiche la quantitée et le prix de tous les articles dans le panier
//-------------------------------------------------------------------
  
  function affichageTotal(tableauCanape) {

    // selection de la balise section avec la class = "cart__price"
    const selectTotalQuantity = document.getElementById("totalQuantity");
    const selectTotalPrice = document.getElementById("totalPrice");

    // On récupère la valeur associer à la clé panier
    let panier = localStorage.getItem("panier");
    panier = JSON.parse(panier);

    let totalQuantity = 0;
    let totalPrice = 0;
    for (let article of panier) {
      for (let canape of tableauCanape) {
        if (article.id == canape._id) {
        totalQuantity += article.quantity;
        totalPrice += canape.price*article.quantity;
        }
      }}
      
      selectTotalPrice.innerHTML = totalPrice;
      selectTotalQuantity.innerHTML = totalQuantity;

  };
  affichageTotal(tableauCanape);
}


//  contact: {
//    firstName: string,
//    lastName: string,
//    address: string,
//    city: string,
//    email: string
//  }