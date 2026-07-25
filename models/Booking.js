const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
        listing: {
            type: Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
            min: 1,
        },
        pricePerNight: {
            type: Number,
            required: true,
            min: 0,
        },
        totalNights: {
            type: Number,
            required: true,
            min: 1,
        },
        subTotal: {
            type: Number,
            required: true,
            min: 0,
        },
        gst: {
            type: Number,
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
            default: "Pending",
        },
        paymentId: {
            type: String,
        },
        orderId: {
            type: String,
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);


bookingSchema.index({
    listing: 1,
    checkIn: 1,
    checkOut: 1,
    status: 1,
});

module.exports = mongoose.model("Booking", bookingSchema);