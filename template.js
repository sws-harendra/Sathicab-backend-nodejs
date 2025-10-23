const templates = {
  otp: {
    templateId: "1707161111111",
    senderId: "SATCAB",
    text: "Sathi cab login code {#var#} Valid for 10 mins. Don’t share it with anyone confrere Taxi",
  },
  registration: {
    templateId: "1707162222222",
    senderId: "SATICB",
    text: "Dear {#var#} Congratulations! Your registration on Sathi Cab has been successfully completed. Customer Support: {#var#} Thank you for choosing Sathi Cab. Team Sathi Cab Confrer",
  },
  cabDetails: {
    templateId: "1207176042979809184",
    senderId: "SATCAB",
    text: "Driver Ph.: {#var#}. Cab: No. ({#var#}), Pickup Time & Date {#var#}. You will receive the final amount after completing the journey in Sathi Cab Driver App. Please check initial KMs before trip start. Do not pay before boarding. Sathi Cab - Your trusted travel partner. . Confrere Taxi",
  },
  bookingConfirmation: {
    templateId: "1207176012592338849",
    senderId: "SATCAB",
    text: "Hi {#var#}, your booking (ID: {#var#}) has been confirmed. {#var#} will arrive for your pickup. Sathi Cab. Confrere Taxi",
  },
  paymentConfirmation: {
    templateId: "1207176011734150698",
    senderId: "SATCAB",
    text: "Hi {#var#}, Your payment of Rs. {#var#} for booking ID {#var#} has been received successfully. Remaining Amount will be shared below. Sathi Cab. Confrere Taxi",
  },
  RemainingPayInfoUser: {
    templateId: "1207176011832530516",
    senderId: "SATCAB",
    text: "Remaining Amount: Rs. {#var#} Included Km: {#var#} Extra Km Charge: {#var#} Driver Allowance: Included Toll, State tax, Parking Extra You will soon receive your car and driver details. Important: Sathicab is not responsible for any extra payment apart from above mentioned. Sathi Cab https://Sathicabs.com/ .Confrere Taxi",
  },
  TripSummary: {
    templateId: "1207176016646355544",
    senderId: "SATCAB",
    text: "Your booking (ID: {#var#}) has been marked completed by driver. Extra Km: {#var#}, Extra Days: {#var#}. Price details will follow. Sathi Cab Confrere Taxi",
  },
  TripSummaryDetailed: {
    templateId: "1207176016790156229",
    senderId: "SATCAB",
    text: "Subtotal: {#var#}, GST:5% {#var#}, Total Amount to Pay: {#var#}. Toll and State taxes extra. Thank you for choosing Sathi Cab . Confrere Taxi",
  },
  bookingDriverAccepted: {
    templateId: "1207176019177859542",
    senderId: "SATCAB",
    text: "You have successfully accepted booking (ID: {#var#}). Customer: {#var#}, Ph.: {#var#}. Please get ready for pickup. Sathi Cab . Confrere Taxi",
  },
  bookingDriverAccepted2: {
    templateId: "1207176019566546292",
    senderId: "SATCAB",
    text: "Car: {#var#} - No.: {#var#}. Pickup Date/Time: {#var#}. For more details visit Sathi Cab App or website. Thank you forhttps://sathicabs.com Sathi Cab . Confrere Taxi",
  },
  bookingDriverCompleted: {
    templateId: "1207176024516774675",
    senderId: "SATCAB",
    text: "Booking (ID: {#var#}) has been marked completed. Customer: {#var#}, Ph.: {#var#}. Please verify trip details in Sathi Cab . Confrere Taxi",
  },
  bookingDriverCompleted2: {
    templateId: "1207176024492429666",
    senderId: "SATCAB",
    text: "Extra day & KM : {#var#}, Received from Costumer: {#var#}, Deducted from Wallet: {#var#}. Toll and State taxes extra. Thank you for driving with Sathi Cab . Confrere Taxi",
  },
  // Add all 20 templates here...

  driverRegistration: {
    templateId: "1207175369879985443",
    senderId: "SATCAB",
    text: "प्रिय {#var#}, बधाई हो! आपका साथी कैब ड्राइवर के रूप में रजिस्ट्रेशन सफलतापूर्वक पूरा हो गया है। अब आप हमारी एप्लिकेशन में लॉगिन करके राइड्स प्राप्त करना शुरू कर सकते हैं। अगर आपको किसी प्रकार की सहायता चाहिए, तो कृपया हमसे संपर्क करें: सहायता नंबर: {#var#} साथी कैब की टीम की ओर से आपको शुभकामनाएँ! धन्यवाद। – साथी कैब टीम",
  },
  userProfileCompleted: {
    templateId: "1207175394359796303",
    senderId: "SATCAB",
    text: "Dear {#var#} Congratulations! Your registration on Sathi Cab has been successfully completed. You can now easily book rides anytime, anywhere using our mobile app. Customer Support: {#var#} Thank you for choosing Sathi Cab. We wish you a pleasant journey! Team Sathi Cab Confrer",
  },
};

module.exports = { templates };
