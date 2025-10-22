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
  bookingConfirmation: {
    templateId: "1207176012592338849",
    senderId: "Confreretaxi",
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
  // Add all 20 templates here...
};

module.exports = { templates };
