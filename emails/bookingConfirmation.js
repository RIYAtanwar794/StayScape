module.exports = (user, booking, listing) => {
    return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">

                <table
                    width="650"
                    cellpadding="0"
                    cellspacing="0"
                    style="background:#ffffff;border-radius:12px;overflow:hidden;margin:30px auto;"
                >

                    <tr>
                        <td style="background:#111827;padding:30px;text-align:center;">
                            <h1 style="margin:0;color:#ffffff;font-size:32px;">
                                🏡 StayScape
                            </h1>

                            <p style="color:#d1d5db;margin-top:8px;">
                                Explore • Stay • Travel
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:35px;text-align:center;">

                            <h2 style="color:#16a34a;margin-bottom:5px;">
                                🎉 Booking Confirmed
                            </h2>

                            <p style="color:#555;font-size:16px;">
                                Hi <b>${user.username}</b>,
                            </p>

                            <p style="color:#666;line-height:28px;">
                                Your booking has been confirmed successfully.
                                We can't wait to host you!
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 35px 35px;">

                            <div
                                style="
                                    border:1px solid #e5e7eb;
                                    border-radius:10px;
                                    padding:25px;
                                    background:#fafafa;
                                "
                            >

                                <h3 style="margin-top:0;color:#111827;">
                                    ${listing.title}
                                </h3>

                                <p>
                                    📍 ${listing.location}, ${listing.country}
                                </p>

                                <hr>

                                <p>
                                    <strong>📅 Check-In:</strong>
                                    ${new Date(booking.checkIn).toDateString()}
                                </p>

                                <p>
                                    <strong>📅 Check-Out:</strong>
                                    ${new Date(booking.checkOut).toDateString()}
                                </p>

                                <p>
                                    <strong>👥 Guests:</strong>
                                    ${booking.guests}
                                </p>

                                <p>
                                    <strong>🌙 Nights:</strong>
                                    ${booking.totalNights}
                                </p>

                                <hr>

                                <h2 style="color:#16a34a;">
                                    Total Paid:
                                    ₹${booking.totalPrice.toLocaleString("en-IN")}
                                </h2>

                            </div>

                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 35px 35px;">

                            <p style="color:#666;line-height:26px;">

                                Need help?

                                <br><br>

                                📧 Reply to this email for support.

                                <br><br>

                                Thank you for choosing
                                <b>StayScape ❤️</b>

                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td
                            style="
                                background:#111827;
                                padding:20px;
                                text-align:center;
                                color:#d1d5db;
                                font-size:14px;
                            "
                        >

                            © 2026 StayScape. All Rights Reserved.

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
`;
};