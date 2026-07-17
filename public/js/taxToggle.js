let taxSwitch = document.getElementById("switchCheckDefault");

taxSwitch.addEventListener("change", () => {

    const basePrices = document.querySelectorAll(".base-price");
    const taxPrices = document.querySelectorAll(".tax-info");

    if (taxSwitch.checked) {

        basePrices.forEach(price => {
            price.style.display = "none";
        });

        taxPrices.forEach(price => {
            price.style.display = "inline";
        });

    } else {

        basePrices.forEach(price => {
            price.style.display = "inline";
        });

        taxPrices.forEach(price => {
            price.style.display = "none";
        });

    }

});

