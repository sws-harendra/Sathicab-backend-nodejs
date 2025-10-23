const { templates } = require("./template");
const { fillTemplate } = require("./helpers/fillVariable");
async function sendSMS(templateKey, number, variables = []) {
  if (!templates[templateKey]) {
    throw new Error("Template not found!");
  }

  const { templateId, senderId, text } = templates[templateKey];
  const message = fillTemplate(text, variables);
  const encodedMessage = encodeURIComponent(message);
  // console.log("Encoded Message:", encodedMessage);
  const apiKey = process.env.OTP_KEY; // Replace with your API key
  const url = `http://web.adcruxmedia.in/vb/apikey.php?apikey=${apiKey}&senderid=${senderId}&templateid=${templateId}&number=${number}&message=${encodedMessage}`;
  // console.log("Request URL:", url);
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    return data;
  } catch (err) {
    console.error("SMS sending failed:", err);
    throw err;
  }
}

module.exports = { sendSMS };
