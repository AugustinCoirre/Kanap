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
  .then(tableauCanape => affichageCanapes(tableauCanape))
  .catch(function (err) {
    // Une erreur est survenue
    document.querySelector(".titles").innerHTML = "<h1>error 404</h1>";
    console.log("erreur" + err);
  });

//-------------------------------------------------------------------
// fonction affichageCanapes affichage des produits de l'api
//-------------------------------------------------------------------

// affichage des produits de l'API sur la page index
function affichageCanapes(tableauCanape) {
  // selection de la balise section avec l'ID = "items"
  let selectItems = document.getElementById("items");
  for (let canape of tableauCanape) {
    //ajout des éléments de manière dynamique
    selectItems.innerHTML += `<a href="./product.html?_id=${canape._id}">
    <article>
      <img src="${canape.imageUrl}" alt="${canape.altTxt}">
        <h3 class="productName">${canape.name}</h3>
        <p class="productDescription">${canape.description}</p>
        </article>
        </a>`;
  }
}
