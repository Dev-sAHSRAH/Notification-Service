const express = require("express");
const amqplib = require("amqplib");
const { EmailService } = require("./services");

async function connectQueue() {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "notifications";

    await channel.assertQueue(queue);
    channel.consume(queue, async (data) => {
      console.log(`${Buffer.from(data.content)}`);
      const object = JSON.parse(`${Buffer.from(data.content)}`);
      await EmailService.sendMail(
        object.recipientEmail,
        object.subject,
        object.text
      );
      channel.ack(data);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");
const { log } = require("winston");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  await connectQueue();
  Logger.info("Successfully started the server");
});
