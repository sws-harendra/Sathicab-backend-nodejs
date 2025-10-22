require("dotenv").config();

const express = require("express");
const { sendSMS } = require("./sendSms");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev")); // Shows :method :url :status :response-time ms
app.use(express.json());

let port = process.env.PORT || 8888;

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/user/booking-confirmation", async (req, res) => {
  try {
    const {
      phoneNumber,
      name,
      payment_amount,
      remainingAmount,
      distance,
      booking_id,
      extra_km_charge,
    } = req.body;
    await sendSMS("paymentConfirmation", phoneNumber, [
      name,
      payment_amount,
      booking_id,
    ]);
    await sendSMS("RemainingPayInfoUser", phoneNumber, [
      remainingAmount, // Example remaining amount
      distance, // Example included Km
      extra_km_charge, // Example extra Km charge
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
