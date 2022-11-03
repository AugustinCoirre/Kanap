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
        cardCanapePanier(canape, article);
      }
    }
  }

//-------------------------------------------------------------------
// fonction cardCanapePanier crée des cards pour chaque canapé dans le panier
//-------------------------------------------------------------------

  function cardCanapePanier(canape, article) {
    
      let createArticle = document.createElement("article");
      createArticle.className = "cart__item";
      createArticle.dataset.id = canape._id;
      createArticle.dataset.color = article.couleur;

      let divImg = document.createElement("div");
      divImg.className = "cart__item__img";
        
      let img = document.createElement("img");
      img.src = canape.imageUrl;
      img.alt = canape.altTxt;

      let divContent = document.createElement("div");
      divContent.className = "cart__item__content";

      let divContent_Description = document.createElement("div");
      divContent_Description.className = "cart__item__content__description";

      let h2 = document.createElement("h2");
      h2.innerText = canape.name;

      let pColor = document.createElement("p");
      pColor.innerText = article.couleur;

      let pPrice = document.createElement("p");
      pPrice.innerText = canape.price + "€";

      let divContent_Settings = document.createElement("div");
      divContent_Settings.className = "cart__item__content__settings";
        
      let divContent_SettingsQuantity = document.createElement("div");
      divContent_SettingsQuantity.className = "cart__item__content__settings_quantity";

      let p = document.createElement("p");
      p.innerText = "qté :";

      let input = document.createElement("input");
      input.type = "number";
      input.className = "itemQuantity";
      input.name = "itemQuantity";
      input.min = "1";
      input.max = "100";
      input.value = article.quantity;

      let divContent_SettingsDelete = document.createElement("div");
      divContent_SettingsDelete.className = "cart__item__content__settings__delete";

      let pDelete = document.createElement("p");
      pDelete.className = "deleteItem";
      pDelete.innerText = "Supprimer";


      selectItems.appendChild(createArticle);
      createArticle.appendChild(divImg);
      divImg.appendChild(img);
      createArticle.appendChild(divContent);
      divContent.appendChild(divContent_Description);
      divContent_Description.appendChild(h2);
      divContent_Description.appendChild(pColor);
      divContent_Description.appendChild(pPrice);
      divContent.appendChild(divContent_Settings);
      divContent_Settings.appendChild(divContent_SettingsQuantity);
      divContent_SettingsQuantity.appendChild(p);
      divContent_SettingsQuantity.appendChild(input);
      divContent_Settings.appendChild(divContent_SettingsDelete);
      divContent_SettingsDelete.appendChild(pDelete);

         //on récupère le tableau des elements avec la class "deleteItem"  
         let tableauDeleteItem = createArticle.getElementsByClassName("deleteItem");
       
         let deleteItemButton = tableauDeleteItem[0];
 
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

    // on récupère la quantitée changer par le client pour l'article voulu
    let newQuantityArticle = updateValue.target.value;

    // Si findIndex est vrai il retourne la valeur de l'index de l'article
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
//    email: string,
//  }

// appel de la fonction validationFormulaire
validationFormulaire();

//-------------------------------------------------------------------
// fonction verificationFormulaire vérifie les données inséres par les users et si fausse leur renvoie un message d'erreur
//-------------------------------------------------------------------

function verificationFormulaire() {

  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let address = document.getElementById("address");
  let city = document.getElementById("city");
  let email = document.getElementById("email");

  //first name -------- Ne valide pas si contient un chiffre
    if (!/^[a-zA-Z ,.',-]+$/.test(firstName.value)) {
        document.getElementById("firstNameErrorMsg").innerText = "Veuillez écrire votre prénom";
        return false;
      } 
    //last name ----------- Ne valide pas si contient un chiffre
    if (!/^[a-zA-Z ,.',èé,-]+$/.test(lastName.value)) {
        document.getElementById("lastNameErrorMsg").innerText = "Veuillez écrire votre nom";
        return false;
      }
    //address ----------- 
      if (!/^[a-zA-Z ,.',0-9,èé,-]+$/.test(address.value)) {
        document.getElementById("addressErrorMsg").innerText = "Veuillez écrire votre adresse";
        return false;
      }
    //city ----------- Ne valide pas si contient un chiffre
      if (!/^[a-zA-Z ,.',èé,-]+$/.test(city.value)) {
        document.getElementById("cityErrorMsg").innerText = "Veuillez écrire votre ville";
        return false;
      }
    //Email ----------- ne valide pas si ne contient pas un "@" et un "." dans le bon ordre
      if (!/^.+.@.+\.\D.+$/.test(email.value)) {
        document.getElementById("emailErrorMsg").innerText = "Veuillez écrire votre email";
        return false;
      }
      return true;
}

//-------------------------------------------------------------------
// fonction validationFormulaire récupère les données de l'utilisateur, forme un objet contact
//-------------------------------------------------------------------

function validationFormulaire() {

  document.getElementById("order").addEventListener('click', function(e) {

    e.preventDefault();

    if (verificationFormulaire()) {

      let firstName = document.getElementById("firstName");
      let lastName = document.getElementById("lastName");
      let address = document.getElementById("address");
      let city = document.getElementById("city");
      let email = document.getElementById("email");


        let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
      }

      console.log(contact);

      let panier = localStorage.getItem("panier");
      tableauPanier = JSON.parse(panier);

      sendFormulaire(contact, tableauPanier);
        
    }
  })
}

//-------------------------------------------------------------------
// fonction sendFormulaire envoies payload dans l'API et envoie l'utilisateur sur la page confirmation avec son ID de commande
//-------------------------------------------------------------------

function sendFormulaire(contact, tableauPanier) {

let tableauIdPanier = tableauPanier.map(article => article.id);

let payload = {
  contact: contact,
  products: tableauIdPanier
}

    fetch("http://localhost:3000/api/products/order", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then((res) => res.json())
    .then((payload) => {
      // envoie à la page confirmation
      window.location.href = `/front/html/confirmation.html?commande=${payload.orderId}`;
    })
    .catch(function (err) {
      console.log(err);
    });
}