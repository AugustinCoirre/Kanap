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
    console.log("erreur" + err);
  });

//-------------------------------------------------------------------
// fonction affichageCanapes affichage des produits de l'api sur la page index
//-------------------------------------------------------------------
function affichageCanapes(tableauCanape) {
  
  for (let canape of tableauCanape) {
    cardCanape(canape);
  }

//-------------------------------------------------------------------
// fonction cardCanape crée des cards pour chaque canapé
//-------------------------------------------------------------------
  function cardCanape(canape) {

    let selectItems = document.getElementById("items");

    let a = document.createElement("a");
    a.href = "./product.html?_id=" + canape._id;

    let CreateArticle = document.createElement("article");

    let CreateImg = document.createElement("img");
    CreateImg.src = canape.imageUrl;
    CreateImg.alt = canape.altTxt;

    let createH3 = document.createElement("h3");
    createH3.className = "productName";
    createH3.innerText = canape.name;

    let CreateP = document.createElement("p");
    CreateP.className = "productDescription";
    CreateP.innerText = canape.description;
    
    selectItems.appendChild(a);
    a.appendChild(CreateArticle);
    CreateArticle.appendChild(CreateImg); 
    CreateArticle.appendChild(createH3);
    CreateArticle.appendChild(CreateP); 

  }
}
