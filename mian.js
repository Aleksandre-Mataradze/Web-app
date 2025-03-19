
fetch('https://api.everrest.educata.dev/shop/products/all')
.then((response) => response.json())
.then((data) => {
    console.log("data", data)
    data.products.forEach(element => {
        console.log(element)
    });
})