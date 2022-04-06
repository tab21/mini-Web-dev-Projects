// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
//javascript

const accountSid = process.env.TWILIO_ACCOUNT_SID;

const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "Then will be waiting for you",
    from: "whatsapp:+14155238886",
    to: "whatsapp:+918766237146",
  })
  .then((message) => console.log(message.sid))
  .catch((error) => {
    console.error(error);
  });
