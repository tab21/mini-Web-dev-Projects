const accountSid = process.env.TWILIO_ACCOUNT_SID;

const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "Hello from Twilio! Your appointment is coming up on July 21 at 3PM",
    from: "whatsapp:+14155238886",
    to: "whatsapp:+918766237146",
  })
  .then((message) => console.log(message.sid))
  .catch((error) => {
    console.error(error);
  });
