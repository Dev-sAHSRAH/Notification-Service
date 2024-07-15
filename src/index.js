const express = require("express");

const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");

const mailSender = require("./config/email-config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  Logger.info("Successfully started the server");
  try {
    const response = await mailSender.sendMail({
      from: ServerConfig.GMAIL_EMAIL,
      to: "charsha099@gmail.com",
      subject: "Is the service working???",
      text: "Yes it is!!!",
    });
    console.log("mail res", response);
  } catch (error) {
    console.log(error);
  }
});
