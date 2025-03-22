document.addEventListener('DOMContentLoaded', function(){
    const page = document.body.getAttribute("data-page");

    if (page === "home") {
        homePageFunction();
    } else if (page === "laptop") {
        laptopPageFunction();
    }
});

function homePageFunction(){

    fetch('https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38')
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
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
                if(productIndexArr.includes(i)){

                    let card = document.createElement('div');
                    card.classList.add("card");
                    let laptopCardList = document.querySelector(".laptop-card-list");
                    laptopCardList.appendChild(card);

                    let cardImg = document.createElement('img');
                    cardImg.setAttribute('src', data.products[i].thumbnail);
                    card.appendChild(cardImg);

                    let cardTitle = data.products[i].title;
                    let h5 = document.createElement('h5');
                    h5.textContent = cardTitle;
                    card.appendChild(h5);

                    if(data.products[i].price.discountPercentage > 0){

                        let beforeDiscountPrice = data.products[i].price.beforeDiscount;
                        let currentPrice = data.products[i].price.current;
                        if(data.products[i].price.currency == 'USD'){ // converts USD to GEL
                            beforeDiscountPrice *= 2.77; 
                            currentPrice *= 2.77;
                        }
                        const pricePara = document.createElement('p');
                        pricePara.classList.add('price')
                        pricePara.style.textDecoration = "line-through";
                        pricePara.textContent = `${Math.round(beforeDiscountPrice)}ლ`;
                        card.appendChild(pricePara)
                        const DiscountPrice = document.createElement('p');
                        DiscountPrice.classList.add('sale-price');
                        DiscountPrice.textContent = `${Math.round(currentPrice)}ლ`
                        pricePara.appendChild(DiscountPrice)

                    }else{

                    let beforeDiscountPrice = data.products[i].price.beforeDiscount;

                    if(data.products[i].price.currency == 'USD'){ // converts USD to GEL
                        beforeDiscountPrice *= 2.77; 
                    }
                    const pricePara = document.createElement('p');
                    pricePara.classList.add('price')
                    pricePara.textContent = `${Math.round(beforeDiscountPrice)}ლ`;
                    card.appendChild(pricePara)
                }

                const ratingPara = document.createElement('span');
                ratingPara.classList.add("rating")
                ratingPara.textContent = Math.round(data.products[i].rating * 10) / 10;
                card.appendChild(ratingPara);
                const ratingStar = document.createElement('i');
                ratingStar.classList.add("fa-solid");
                ratingStar.classList.add("fa-star");
                ratingPara.appendChild(ratingStar)
            }
        }
    }
})

    const categoryCont = document.querySelector(".categories");
    categoryCont.addEventListener('click', categoryPopOut);

    function categoryPopOut(){
        document.querySelector(".categories-list-container").classList.toggle("categories-list-container-block")

    }

    const signInbutton = document.querySelector(".sign-in");
    signInbutton.addEventListener('click', signInPopOut);

    function signInPopOut(){
        document.querySelector(".non-blur").classList.add("blurred-background")

        let signInValues = {
            email : '',
            password : ''
        }

        const signInSubmit = document.querySelector(".sign-in-button")
        signInSubmit.addEventListener('click', () => {
            signInValues.email = document.querySelector("#sign-in-email").value;
            signInValues.password = document.querySelector("#sign-in-password").value;

            fetch('https://api.everrest.educata.dev/auth/sign_in', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signInValues)
                })
                .then((response) => response.json())
                .then((data) => {
                    if(data.access_token != null || undefined)
                    localStorage.setItem("AuthToken", data.access_token)

                    for(let key in signInValues){
                        localStorage.setItem(key, signInValues[key])
                    }
                })
        })

        const signInForm = document.querySelector(".sign-in-form")
        signInForm.style.display = "flex";

        const quitSignInForm = document.querySelector(".quit-sign-in-form")
        quitSignInForm.addEventListener('click', () => {
            document.querySelector(".non-blur").classList.remove("blurred-background");
            signInForm.style.display = "none";
            const emailInput = document.querySelector("#sign-in-email");
            emailInput.value = "";
            const passwordInput = document.querySelector("#sign-in-password");
            passwordInput.value = "";
        })

        const blurArea = document.querySelector(".non-blur");
            blurArea.addEventListener('click', () => {
                document.querySelector(".non-blur").classList.remove("blurred-background");
                signInForm.style.display = "none";
                document.querySelector("#first-name").value = "";
                document.querySelector("#last-name").value = "";
                document.querySelector("#age").value = "";
                document.querySelector("#email").value = "";
                document.querySelector("#password").value = "";
                document.querySelector("#address").value = "";
                document.querySelector("#phone").value = "";
                document.querySelector("#zipcode").value = "";
                document.querySelector("#avatar").value = "";
            })

        let signUpValues = {
            firstName : 'string',
            lastName : 'string',
            age : 404,
            email : 'string',
            password : 'Magari123',
            address : 'string',
            phone : '+995568112011',
            zipcode : 'string',
            avatar : 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.veryicon.com%2Ficons%2Fmiscellaneous%2Fuser-avatar%2Fuser-avatar-male-5.html&psig=AOvVaw31q6Nr8HTkYWyhM3Qcr6DC&ust=1742756962241000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCvveKxnowDFQAAAAAdAAAAABAE',
            gender : 'MALE'         
        }

        const nextTosignUp = document.querySelector(".next-to-sign-up-button");
        nextTosignUp.addEventListener('click', () => {
            signInForm.style.display = "none";
            const emailInput = document.querySelector("#sign-in-email");
            emailInput.value = "";
            const passwordInput = document.querySelector("#sign-in-password");
            passwordInput.value = "";
            const signUpForm = document.querySelector(".sign-up-form");
            signUpForm.style.display = "flex";

            const signUpSubmit = document.querySelector("#sign-up-button");
            signUpSubmit.addEventListener('click', () => {
                signUpValues.firstName = document.querySelector("#first-name").value;
                signUpValues.lastName = document.querySelector("#last-name").value;
                signUpValues.age = document.querySelector("#age").value;
                signUpValues.email = document.querySelector("#email").value;
                signUpValues.password = document.querySelector("#password").value;
                signUpValues.address = document.querySelector("#address").value;
                signUpValues.phone_number = document.querySelector("#phone").value;
                signUpValues.zipcode = document.querySelector("#zipcode").value;
                signUpValues.gender = document.querySelector("input:checked").value;

                console.log(signUpValues)

                fetch('https://api.everrest.educata.dev/auth/sign_up', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signUpValues)
                })
                .then((response) => response.json())
                .then((data) => console.log(data))

            })

            // fetch('https://api.everrest.educata.dev/auth/id/67df0c87c6d74d268041626b', {
            //         method: "GET",
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     })
            //     .then((response) => response.json())
            //     .then((data) => console.log(data))

            const quitSignUpForm = document.querySelector(".quit-sign-up-form");
            quitSignUpForm.addEventListener('click', () => {
                document.querySelector(".non-blur").classList.remove("blurred-background");
                signUpForm.style.display = "none";
                document.querySelector("#first-name").value = "";
                document.querySelector("#last-name").value = "";
                document.querySelector("#age").value = "";
                document.querySelector("#email").value = "";
                document.querySelector("#password").value = "";
                document.querySelector("#address").value = "";
                document.querySelector("#phone").value = "";
                document.querySelector("#zipcode").value = "";
                document.querySelector("#avatar").value = "";
            })

            const blurArea = document.querySelector(".non-blur");
            blurArea.addEventListener('click', () => {
                document.querySelector(".non-blur").classList.remove("blurred-background");
                    signUpForm.style.display = "none";
                    document.querySelector("#first-name").value = "";
                    document.querySelector("#last-name").value = "";
                    document.querySelector("#age").value = "";
                    document.querySelector("#email").value = "";
                    document.querySelector("#password").value = "";
                    document.querySelector("#address").value = "";
                    document.querySelector("#phone").value = "";
                    document.querySelector("#zipcode").value = "";
                    document.querySelector("#avatar").value = "";
            })
        })
    }

    // fetch('https://api.everrest.educata.dev/auth', {
    //     method: "GET",
    //     headers: {
    //         'Content-Type': 'application/json', 
    //         'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2RmMGZhMGM2ZDc0ZDI2ODA0MTY0MTAiLCJmaXJzdE5hbWUiOiJ0ZXN0IiwibGFzdE5hbWUiOiJ0ZXN0IiwiYWdlIjoxMCwiZW1haWwiOiJ0ZXN0LnRlc3RAZ21haS5jb20iLCJhZGRyZXNzIjoidGVzdDEiLCJyb2xlIjoiZGVmYXVsdCIsInppcGNvZGUiOiIwMTAyIiwiYXZhdGFyIjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS91cmw_c2E9aSZ1cmw9aHR0cHMlM0ElMkYlMkZ3d3cudmVyeWljb24uY29tJTJGaWNvbnMlMkZtaXNjZWxsYW5lb3VzJTJGdXNlci1hdmF0YXIlMkZ1c2VyLWF2YXRhci1tYWxlLTUuaHRtbCZwc2lnPUFPdlZhdzMxcTZOcjhIVGtZV3loTTNRY3I2REMmdXN0PTE3NDI3NTY5NjIyNDEwMDAmc291cmNlPWltYWdlcyZjZD12ZmUmb3BpPTg5OTc4NDQ5JnZlZD0wQ0JRUWpSeHFGd29UQ09DdnZlS3hub3dERlFBQUFBQWRBQUFBQUJBRSIsImdlbmRlciI6Ik1BTEUiLCJwaG9uZSI6Iis5OTU1NjgxMTIwMTEiLCJ2ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzQyNjczMTY1LCJleHAiOjE3NDI2NzY3NjV9.1HSpnXTEoG2a8fB13JhP5D0cDxLAtxaSyo2dMZtD4p0'
    //     },
    // })
    // .then((response) => response.json())
    // .then((data) => console.log(data))

}


function laptopPageFunction(){

    fetch('https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38')
    .then((response) => response.json())
    .then((data) => {
        
        const productBrands = [];
        for(let i=0; i<data.products.length; i++){
            productBrands.push(data.products[i].brand)
        }
        
        let filteredProductBrands = [];
        filteredProductBrands = new Set(productBrands)
        const brandListBox = document.getElementById('brand-list-box')

        for(value of filteredProductBrands){
            let listElement = document.createElement('li');
            listElement.textContent = value;
            brandListBox.appendChild(listElement)
            
        }
    })
    
    const categoryCont = document.querySelector(".categories");
    categoryCont.addEventListener('click', categoryPopOut);

    function categoryPopOut(){
        document.querySelector(".categories-list-container").classList.toggle("categories-list-container-block")

    }
}





