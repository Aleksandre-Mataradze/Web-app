fetch('https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38')
.then((response) => response.json())
.then((data) => {
    console.log("data", data)
    let productIndexArr = []; // Array for the Card list.
    for(let i=1; i<=4; i++){ // gets up to 4 random index from product array.
        let randomProductIndex = Math.floor(Math.random() * (data.products.length - 0) + 0);
        productIndexArr.push(randomProductIndex);
    } // Can return same two or more same index

    for(let i=0; i<data.products.length; i++){
        if(productIndexArr.includes(i)){
            // productIndexArr.forEach(element => {
            let card = document.createElement('div');
            card.classList.add("card");
            let laptopCardList = document.querySelector(".laptop-card-list");
            laptopCardList.appendChild(card);
            console.log(card)
            let cardImg = document.createElement('img');
            cardImg.setAttribute('src', data.products[i].thumbnail)
            card.appendChild(cardImg)
            // console.log(data)
        // })
        }
    }
})