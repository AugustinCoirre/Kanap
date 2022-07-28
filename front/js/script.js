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
  .then(function (tableauCanape) {
    // retourne le tableau dans la console
    console.log(tableauCanape);
    // lance la fonction d'affichage des canapés
    affichageCanape(tableauCanape);
  })
  .catch(function (err) {
    // Une erreur est survenue
    document.querySelector(".titles").innerHTML = "<h1>error 404</h1>";
    console.log("erreur 404, sur ressource api:" + err);
  });

// affichage des produits de l'API sur la page index
function affichageCanape(index) {
  // selection de la balise section avec la class="items"
  let selectItems = document.querySelector("#items");
  for (let canape of index) {
    selectItems.innerHTML += `<a href="./product.html?_id=${canape._id}">
    <article>
      <img src="${canape.imageUrl}" alt="${canape.altTxt}">
        <h3 class="productName">${canape.name}</h3>
        <p class="productDescription">${canape.description}</p>
        </article>
        </a>` ;
  }
}