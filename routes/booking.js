const express = require("express");
const router = express.Router();


const wrapAsync = require("../utils/wrapAsync.js");


const {
    isLoggedIn,
    validateBooking,
} = require("../middleware.js");



const bookingController = require("../controllers/booking.js");



// User Booking History
router.get(
    "/bookings",
    isLoggedIn,
    wrapAsync(bookingController.bookingHistory)
);



// Owner Dashboard
router.get(
    "/bookings/owner",
    isLoggedIn,
    wrapAsync(bookingController.ownerBookings)
);



// Update Booking Status
router.patch(
    "/bookings/:id/status",
    isLoggedIn,
    wrapAsync(bookingController.updateBookingStatus)
);


//Cancel Booking
router.patch(
    "/bookings/:id/cancel",
    isLoggedIn,
    wrapAsync(bookingController.cancelBooking)
);

module.exports = router;