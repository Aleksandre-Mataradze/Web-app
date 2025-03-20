function convertToBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result); // This is the Base64 string
    };
  }
  

fetch('https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38')
.then((response) => response.json())
.then((data) => {
    console.log("data", data)
    let productIndexArr = []; // Array for the Card list.
    while (productIndexArr.length != 5){
        let randomProductIndex = Math.floor(Math.random() * (data.products.length - 0) + 0); // Change both 0 to change min value
        if(productIndexArr.includes(randomProductIndex)){
            randomProductIndex = Math.floor(Math.random() * (data.products.length - 0) + 0); // Change both 0 to change min value
        }
        productIndexArr.push(randomProductIndex);
    }

    for(let i=0; i<data.products.length; i++){
        if(productIndexArr.includes(i)){
            let card = document.createElement('div');
            card.classList.add("card");
            let laptopCardList = document.querySelector(".laptop-card-list");
            laptopCardList.appendChild(card);
            console.log(card);

            let cardImg = document.createElement('img');
            cardImg.setAttribute('src', data.products[i].thumbnail);
            card.appendChild(cardImg);

            let cardTitle = data.products[i].title;
            let h5 = document.createElement('h5');
            h5.textContent = cardTitle;
            console.log(h5);
            card.appendChild(h5);

            let currentPrice = data.products[i].price.current;
            if(data.products[i].price.currency == 'USD'){ // converts USD to GEL
                currentPrice *= 2.77; 
            }
            const pricePara = document.createElement('p');
            pricePara.classList.add('price')
            pricePara.textContent = `${Math.round(currentPrice)}ლ`;
            card.appendChild(pricePara)
        }
    }
})

