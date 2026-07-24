const subTotalElement = document.getElementById("subTotal");
const gstAmountElement = document.getElementById("gstAmount");

const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");

const totalNightsElement = document.getElementById("totalNights");
const totalPriceElement = document.getElementById("totalPrice");


const bookingContainer = document.querySelector(".booking-container");
const pricePerNight = Number(bookingContainer.dataset.price);



// Update Booking Summary
function updateBookingSummary() {

    if (!checkInInput.value || !checkOutInput.value) {

        totalNightsElement.textContent = "0";
        totalPriceElement.textContent = "₹0";

        return;
    }

    const checkIn = new Date(checkInInput.value);
    const checkOut = new Date(checkOutInput.value);

    const oneDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil((checkOut - checkIn) / oneDay);

    if (nights <= 0) {

        totalNightsElement.textContent = "0";
        subTotalElement.textContent = "₹0";
        gstAmountElement.textContent = "₹0";
        totalPriceElement.textContent = "₹0";

        return;
    }

    totalNightsElement.textContent = nights;
    const subTotal = nights * pricePerNight;
    const gst = Math.round(subTotal * 0.18);
    const grandTotal = subTotal + gst;

    subTotalElement.textContent = "₹" + subTotal.toLocaleString("en-IN");
    gstAmountElement.textContent ="₹" + gst.toLocaleString("en-IN");
    totalPriceElement.textContent ="₹" + grandTotal.toLocaleString("en-IN");

}



// Disable Already Booked Dates
const disabledDates = [];

window.bookedDates.forEach((booking) => {

    let current = new Date(booking.checkIn);

    const end = new Date(booking.checkOut);

    while (current < end) {

        disabledDates.push(new Date(current));

        current.setDate(current.getDate() + 1);

    }

});



// Flatpickr
const checkOutPicker = flatpickr("#checkOut", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: disabledDates,

    onChange: function () {
        updateBookingSummary();
    }
});

flatpickr("#checkIn", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: disabledDates,

    onChange: function (selectedDates) {

        if (selectedDates.length > 0) {

            const nextDay = new Date(selectedDates[0]);
            nextDay.setDate(nextDay.getDate() + 1);

            checkOutPicker.clear();
            checkOutPicker.set("minDate", nextDay);
            checkOutPicker.redraw();

        }

        updateBookingSummary();
    },
});