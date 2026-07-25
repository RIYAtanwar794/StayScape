const PDFDocument = require("pdfkit");

function generateInvoice(booking, listing, user) {
    const doc = new PDFDocument({
        margin: 50,
    });

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    return new Promise((resolve) => {

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        // Header
        doc
            .fontSize(24)
            .fillColor("#111827")
            .text("StayScape", {
                align: "center",
            });

        doc
            .moveDown(0.3)
            .fontSize(18)
            .fillColor("#16a34a")
            .text("BOOKING INVOICE", {
                align: "center",
            });

        doc.moveDown(2);

        doc
            .fontSize(12)
            .fillColor("black")
            .text(`Guest : ${user.username}`);

        doc.text(`Email : ${user.email}`);

        doc.moveDown();

        doc.text(`Property : ${listing.title}`);
        doc.text(`Location : ${listing.location}, ${listing.country}`);

        doc.moveDown();

        doc.text(
            `Check-In : ${new Date(booking.checkIn).toDateString()}`
        );

        doc.text(
            `Check-Out : ${new Date(booking.checkOut).toDateString()}`
        );

        doc.text(`Guests : ${booking.guests}`);
        doc.text(`Nights : ${booking.totalNights}`);

        doc.moveDown();

        doc.text(`Price / Night : ₹${booking.pricePerNight}`);
        doc.text(`Subtotal : ₹${booking.subTotal}`);
        doc.text(`GST : ₹${booking.gst}`);

        doc
            .moveDown()
            .fontSize(16)
            .fillColor("#16a34a")
            .text(`TOTAL PAID : ₹${booking.totalPrice}`);

        doc.moveDown();

        doc
            .fontSize(12)
            .fillColor("black")
            .text(`Invoice Date : ${new Date().toDateString()}`);

        doc.text(`Booking Status : ${booking.status}`);

        doc.text(`Payment Status : ${booking.paymentStatus}`);

        doc.text(`Payment ID : ${booking.paymentId}`);


        doc.moveDown(2);

        doc
            .fontSize(12)
            .fillColor("gray")
            .text(
                "Thank you for choosing StayScape ❤️",
                {
                    align: "center",
                }
            );

        doc.end();
    });
}

module.exports = generateInvoice;