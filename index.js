require("dotenv").config();

const express = require("express");
const { sendSMS } = require("./sendSms");
const morgan = require("morgan");
const admin = require("firebase-admin");
const { generateOTP } = require("./helpers/generateOtp");
const cors = require("cors");
const { apiKeyAuth } = require("./helpers/apiKeyAuth");
const app = express();
app.use(morgan("dev")); // Shows :method :url :status :response-time ms
app.use(express.json());

let port = process.env.PORT || 8888;

const allowedOrigins = ["http://localhost:61253", process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

/////////////////////////////////////////  otp auth
// firebase
admin.initializeApp({
  credential: admin.credential.cert("./firebase.json"),
});
const db = admin.firestore();

app.post("/auth/phone/send-otp", apiKeyAuth, async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Phone required" });

    const otp = generateOTP();

    // 🔸 Send OTP using your provider
    await sendSMS("auth_otp", phone, [otp]);

    // 🔸 Save OTP in Firestore (expires in 5 mins)
    await db
      .collection("otp_verifications")
      .doc(phone)
      .set({
        otp,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
      });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});
app.post("/auth/verify-otp", apiKeyAuth, async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const doc = await db.collection("otp_verifications").doc(phone).get();
    if (!doc.exists) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or invalid" });
    }

    const data = doc.data();
    if (data.otp !== otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    if (Date.now() > data.expiresAt) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // 🔸 Delete OTP after use
    await db.collection("otp_verifications").doc(phone).delete();

    // 🔸 Try to find user by phone number
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByPhoneNumber(`+91${phone}`);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // If not found, create new Firebase user
        userRecord = await admin.auth().createUser({
          phoneNumber: `+91${phone}`,
        });

        // And create Firestore user doc
        await db.collection("users").doc(userRecord.uid).set({
          phone,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        throw error; // some other error
      }
    }

    // 🔸 Generate Firebase custom token for the user
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: error.errorInfo?.message || "Internal server error",
    });
  }
});

/////////////////////////////////////////////
app.post("/user/booking-confirmation", apiKeyAuth, async (req, res) => {
  try {
    let {
      phoneNumber,
      name,
      payment_amount,
      remainingAmount,
      distance,
      booking_id,
      extra_km_charge,
    } = req.body;
    // console.log(phoneNumber, name);

    remainingAmount = Number(req.body.remainingAmount).toFixed(2);
    distance = Number(req.body.distance).toFixed(2);
    extra_km_charge = Number(req.body.extra_km_charge).toFixed(2);
    const formattedBookingId = `SATHICAB${booking_id.toString().slice(-5)}`;

    // console.log(distance, remainingAmount, extra_km_charge);
    await sendSMS("paymentConfirmation", phoneNumber, [
      name,
      payment_amount,
      formattedBookingId,
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
app.post("/user/booking-accept", apiKeyAuth, async (req, res) => {
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

    const formattedBookingId = `SATHICAB${booking_id.toString().slice(-5)}`;

    console.log("boooking_accepted", req.body);
    await sendSMS("bookingConfirmation", phoneNumber, [
      name,
      formattedBookingId,
      driver_name, //driver name take
    ]);
    await sendSMS("cabDetails", phoneNumber, [
      driver_phone_number,
      cab_number,
      pickup_date_time,
    ]);

    await sendSMS("bookingDriverAccepted", driver_phone_number, [
      formattedBookingId,
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

app.post("/user/booking-complete", apiKeyAuth, async (req, res) => {
  try {
    let {
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
    const formattedBookingId = `SATHICAB${booking_id.toString().slice(-5)}`;

    sub_total = Number(sub_total).toFixed(2);
    amount_to_pay = Number(amount_to_pay).toFixed(2);
    console.log(req.body);
    let gstamount = (sub_total * 5) / 100;
    await sendSMS("TripSummary", phoneNumber, [
      formattedBookingId,
      extra_km,
      extra_days,
    ]);
    await sendSMS("TripSummaryDetailed", phoneNumber, [
      amount_to_pay,
      gstamount,
      amount_to_pay,
    ]);

    await sendSMS("bookingDriverCompleted", driver_phone_number, [
      formattedBookingId,
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
    await sendSMS(
      "driverRegistration",
      phoneNumber,
      [driver_name, process.env.SUPPORT_CONTACT],
      true
    );
    return res.status(200).json({
      success: true,
      message: "SMS sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

app.post("/user/profile_completed", apiKeyAuth, async (req, res) => {
  console.log("here");

  try {
    const { phoneNumber, userName } = req.body;
    await sendSMS("userProfileCompleted", phoneNumber, [
      userName,
      process.env.SUPPORT_CONTACT,
    ]);
    return res.status(200).json({
      success: true,
      message: "SMS sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

app.post("/user/booking-cancel", apiKeyAuth, async (req, res) => {
  try {
    let {
      phoneNumber,
      driverNumber,
      userName,
      booking_id,
      cancel_by,
      reason,
      refund_amount,
      mode,
      expected_time,
    } = req.body;
    refund_amount = Number(refund_amount).toFixed(2);
    const formattedBookingId = `SATHICAB${booking_id.toString().slice(-5)}`;

    console.log("booking_cancel", req.body);
    await sendSMS("booking_cancel", driverNumber, [
      formattedBookingId,
      cancel_by,
      reason,
    ]);
    await sendSMS("booking_cancel2", phoneNumber, [
      refund_amount,
      mode,
      expected_time,
    ]);
    return res.status(200).json({
      success: true,
      message: "SMS sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

app.post("/driver/booking-cancel", apiKeyAuth, async (req, res) => {
  try {
    let {
      phoneNumber,
      // driverNumber,
      booking_id,
      cancel_by,
      reason,
      refund_amount,
      mode,
      expected_time,
    } = req.body;
    refund_amount = Number(refund_amount).toFixed(2);
    const formattedBookingId = `SATHICAB${booking_id.toString().slice(-5)}`;

    console.log("booking_cancel", req.body);
    await sendSMS("booking_cancel", phoneNumber, [
      formattedBookingId,
      cancel_by,
      reason,
    ]);
    await sendSMS("booking_cancel2", phoneNumber, [
      refund_amount,
      mode,
      expected_time,
    ]);
    return res.status(200).json({
      success: true,
      message: "SMS sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
