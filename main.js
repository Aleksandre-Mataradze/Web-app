document.addEventListener('DOMContentLoaded', function(){
    const page = document.body.getAttribute("data-page");

    if (page === "home") {
        homePageFunction();
    } else if (page === "laptop") {
        laptopPageFunction();
    }
});

let filterStatus = {
    brand : [],
    status : Boolean
}
let priceFilterStatus = {
    minPrice : 0,
    maxPrice : Infinity
};

function homePageFunction(){

    let access_token;

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

    

    const signInButton = document.querySelector(".sign-in");
    signInButton.addEventListener('click', signInPopOut);

    staySignedIn()
    signOut()
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
            const listElement = document.createElement('li');
            listElement.classList.add("brand");
            listElement.setAttribute("data-type", value);
            listElement.textContent = value;
            brandListBox.appendChild(listElement);
            const checkBox = document.createElement('div'); 
            checkBox.setAttribute("class", `checkbox`);
            listElement.appendChild(checkBox);
            const checked = document.createElement("i");
            checked.setAttribute("class", `fa-solid fa-check ${value}`);
            checkBox.appendChild(checked);
        }

        categoryBrandFilter()
        categoryPriceFilter()
    })
    
    const categoryCont = document.querySelector(".categories");
    categoryCont.addEventListener('click', categoryPopOut);

    function categoryPopOut(){
        document.querySelector(".categories-list-container").classList.toggle("categories-list-container-block")

    }

    const signInButton = document.querySelector(".sign-in");
    signInButton.addEventListener('click', signInPopOut);

    staySignedIn()
    signOut()
}

function signInPopOut(){
    // Full forms of sign in and sign up
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
                if(data.access_token != null || undefined){
                    let userID = undefined;
                    localStorage.setItem("AuthToken", data.access_token)
                    access_token = data.access_token;

                    fetch('https://api.everrest.educata.dev/auth', {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization' : `Bearer ${access_token}`
                        }
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        userID = data._id;
                        if(access_token == "Incorrect Input"){
                            document.querySelector("#sign-in-email").style.border = "1px solid red";
                            document.querySelector("#sign-in-email").style.backgroundcolor = "beige";
                            document.querySelector("#sign-in-password").style.border = "1px solid red";
                            document.querySelector("#sign-in-password").style.backgroundcolor = "beige";
        
                        }else if (access_token != "Incorrect Input" && userID){
                                document.querySelector(".sign-in-form").style.display = "none";
                                document.querySelector(".non-blur").classList.remove("blurred-background");
                                document.querySelector("#sign-in-email").value = "";
                                document.querySelector("#sign-in-password").value = "";
                                localStorage.setItem("user ID", userID);
                                location.reload()
                        }
                    })

                    // Test, Display user Input: Email & Password.
                    for(let key in signInValues){
                        localStorage.setItem(`Test: ${key}`, signInValues[key])
                    }
                }
                else{
                    access_token = "Incorrect Input";
                    localStorage.setItem("AuthToken", access_token);
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
        avatar : 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid',
        gender : 'MALE',
    }

    let verification = {
        email : ''
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
            verification.email = document.querySelector("#email-verification").value;
            signUpValues.password = document.querySelector("#password").value;
            signUpValues.address = document.querySelector("#address").value;
            signUpValues.phone_number = document.querySelector("#phone").value;
            signUpValues.zipcode = document.querySelector("#zipcode").value;
            signUpValues.gender = document.querySelector("input:checked").value;

            console.log("object", signUpValues)
            console.log("object", verification)

            if(signUpValues.email == verification.email){

            fetch('https://api.everrest.educata.dev/auth/sign_up', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpValues)
            })
            .then((response) => response.json())
            .then((data) => console.log(data))

            fetch('https://api.everrest.educata.dev/auth/verify_email', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(verification)
                })
                .then((response) => response.json())
                .then((data) => console.log(data))
            }else{
                console.log("შეყვანილი მეილები არ ემთხვევა ერთმანეთს!")
            }
        })

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

function staySignedIn(){
    const userID = localStorage.getItem('user ID')
    const accessToken = localStorage.getItem('AuthToken');
    const signInButton = document.querySelector(".sign-in");
    const userIcon = document.querySelector(".user");

    if(userID && accessToken != "Incorrect Input"){
        console.log("ყველა მონაცემი ადგილზეა");
        signInButton.style.display = "none";
        userIcon.style.display = "flex";

        fetch('https://api.everrest.educata.dev/auth', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            const userIconImg = document.querySelector("#user-img").setAttribute("src", "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid")
        })
        

    }else{
        console.log("ყველა მონაცემი არ არის ადგილზე");
    }

    return 0;
}

function signOut(){
    const userIcon = document.querySelector(".user");
    userIcon.addEventListener('click', () => {
    const userMenu = document.querySelector(".user-menu-container");
    userMenu.classList.toggle("block")
    })
    const signOut = document.querySelector("#log-out");
    signOut.addEventListener('click', () => {
        localStorage.removeItem('AuthToken');
        localStorage.removeItem('user ID');
        // Test Email and Password
        localStorage.removeItem('Test: email');
        localStorage.removeItem('Test: password');
        location.reload()
    })
}

function categoryBrandFilter(){
    

    const categoryBrands = document.querySelectorAll(".brand");
    categoryBrands.forEach((element) => element.addEventListener('click', function(){
        if (element.getAttribute("data-type") === element.textContent){
            const brand = element.getAttribute('data-type');
            const makeChecked = document.querySelector(`.${brand}`)
            makeChecked.classList.toggle('block')
            
            if (makeChecked.classList.contains("block")){
                filterStatus.brand.push(brand);
                filterStatus.status = true;
            }else{
                filterStatus.brand = filterStatus.brand.filter((value) => value !== brand);

                if (filterStatus.brand.length == 0){
                    filterStatus.status = false;
                }
            }
        }
        createCards()
    })
    )

    document.addEventListener('DOMContentLoaded', createCards())

}

function categoryPriceFilter(){

    document.querySelector(".price-box").addEventListener('submit', function(event){
        event.preventDefault()

        let formData = new FormData(this);
        
        formData.forEach((value, key) => {
            priceFilterStatus[key] = value / 2.77;
        })
        console.log("changed prices", priceFilterStatus)

        createCards()
    })

    document.getElementById("refresh-button").addEventListener('click', (event) => {
        event.preventDefault()
        document.getElementById("min-price").value = '';
        document.getElementById("max-price").value = '';
        priceFilterStatus.minPrice = 0;
        priceFilterStatus.maxPrice = 99999999999999;

        console.log("default prices",priceFilterStatus)
        createCards()
    })
}

//used in filter functions
function createCards(){

    const laptopCardList = document.querySelector(".product-container");
    laptopCardList.innerHTML = '';

    fetch('https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38')
    .then((response) => response.json())
    .then((data) => {
        console.log(data)

        let maxInUSD;

        for(let i=0; i<data.products.length; i++){
            if(data.products[i].category.id == 1){ 
                if(filterStatus.brand.length > 0 && !filterStatus.brand.includes(data.products[i].brand)){
                    continue;
                }
                if(data.products[i].price.currency == 'GEL'){
                    gelToUSD = data.products[i].price.current / 2.77;
                    console.log("გადაიყვანა", gelToUSD)
                }
                if((data.products[i].price.current > priceFilterStatus.minPrice || gelToUSD > priceFilterStatus.minPrice) && (data.products[i].price.current < priceFilterStatus.maxPrice || gelToUSD < priceFilterStatus.maxPrice)){
                    let card = document.createElement('div');
                    card.classList.add("card");
                    let laptopCardList = document.querySelector(".product-container");
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

                    const ratingPara = document.createElement('span');
                    ratingPara.classList.add("rating")
                    ratingPara.textContent = Math.round(data.products[i].rating * 10) / 10;
                    card.appendChild(ratingPara);
                    const ratingStar = document.createElement('i');
                    ratingStar.classList.add("fa-solid");
                    ratingStar.classList.add("fa-star");
                    ratingPara.appendChild(ratingStar)

                    }else{

                        let beforeDiscountPrice = data.products[i].price.beforeDiscount;

                        if(data.products[i].price.currency == 'USD'){ // converts USD to GEL
                            beforeDiscountPrice *= 2.77; 
                        }
                        const pricePara = document.createElement('p');
                        pricePara.classList.add('price')
                        pricePara.textContent = `${Math.round(beforeDiscountPrice)}ლ`;
                        card.appendChild(pricePara)
                    

                        const ratingPara = document.createElement('span');
                        ratingPara.classList.add("rating")
                        ratingPara.textContent = Math.round(data.products[i].rating * 10) / 10;
                        card.appendChild(ratingPara);
                        const ratingStar = document.createElement('i');
                        ratingStar.classList.add("fa-solid");
                        ratingStar.classList.add("fa-star");
                        ratingPara.appendChild(ratingStar)
                    }
                }else if(priceFilterStatus.minPrice == 0 && priceFilterStatus.maxPrice == Infinity){
                    let card = document.createElement('div');
                    card.classList.add("card");
                    let laptopCardList = document.querySelector(".product-container");
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

                    const ratingPara = document.createElement('span');
                    ratingPara.classList.add("rating")
                    ratingPara.textContent = Math.round(data.products[i].rating * 10) / 10;
                    card.appendChild(ratingPara);
                    const ratingStar = document.createElement('i');
                    ratingStar.classList.add("fa-solid");
                    ratingStar.classList.add("fa-star");
                    ratingPara.appendChild(ratingStar)

                    }else{

                        let beforeDiscountPrice = data.products[i].price.beforeDiscount;

                        if(data.products[i].price.currency == 'USD'){ // converts USD to GEL
                            beforeDiscountPrice *= 2.77; 
                        }
                        const pricePara = document.createElement('p');
                        pricePara.classList.add('price')
                        pricePara.textContent = `${Math.round(beforeDiscountPrice)}ლ`;
                        card.appendChild(pricePara)
                    

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
        }
    })
}







