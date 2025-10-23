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
    remainingAmount = Number(req.body.remainingAmount).toFixed(2);
    distance = Number(req.body.distance).toFixed(2);
    extra_km_charge = Number(req.body.extra_km_charge).toFixed(2);

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
app.post("/user/booking-accept", async (req, res) => {
  try {
    const {
      phoneNumber,
      name,
      driver_phone_number,
      cab_number,
      pickup_date_time,
      booking_id,
      cab,
      driver_name,
    } = req.body;
    await sendSMS("bookingConfirmation", phoneNumber, [
      name,
      booking_id,
      driver_name, //driver name take
    ]);
    await sendSMS("cabDetails", phoneNumber, [
      driver_phone_number,
      cab_number,
      pickup_date_time,
    ]);

    await sendSMS("bookingDriverAccepted", driver_phone_number, [
      booking_id,
      name,
      phoneNumber,
    ]);
    await sendSMS("bookingDriverAccepted2", driver_phone_number, [
      cab, // cab nname
      cab_number,
      pickup_date_time,
      // phoneNumber,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

app.post("/user/booking-complete", async (req, res) => {
  try {
    const {
      phoneNumber,
      // gst_amount,
      driver_phone_number,
      sub_total,
      amount_to_pay,
      booking_id,
      extra_km,
      extra_days,
      user_name,
      // cab,
      // cab_number,
      // pickup_date_time,
    } = req.body;
    let gstamount = (sub_total * 5) / 100;
    await sendSMS("TripSummary", phoneNumber, [
      booking_id,
      extra_km,
      extra_days,
    ]);
    await sendSMS("TripSummaryDetailed", phoneNumber, [
      sub_total,
      gstamount,
      amount_to_pay,
    ]);

    await sendSMS("bookingDriverCompleted", driver_phone_number, [
      booking_id,
      user_name,
      phoneNumber,
    ]);
    await sendSMS("bookingDriverCompleted2", driver_phone_number, [
      extra_km + " KM " + extra_days + " Days",

      amount_to_pay,
      "0.0",
    ]);
    // await sendSMS("bookingDriverAccepted", driver_phone_number, [
    //   booking_id,
    //   user_name,
    //   phoneNumber,
    // ]);
    // await sendSMS("bookingDriverAccepted2", driver_phone_number, [
    //   cab,
    //   cab_number,
    //   pickup_date_time,
    //   phoneNumber,
    // ]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

app.post("/driver/registration", async (req, res) => {
  try {
    const { phoneNumber, driver_name } = req.body;
    await sendSMS("driverRegistration", phoneNumber, [
      driver_name,
      process.env.SUPPORT_CONTACT,
    ]);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

app.post("/user/profile_completed", async (req, res) => {
  try {
    const { phoneNumber, userName } = req.body;
    await sendSMS("userProfileCompleted", phoneNumber, [
      userName,
      process.env.SUPPORT_CONTACT,
    ]);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
