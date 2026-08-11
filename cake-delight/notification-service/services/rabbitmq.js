const amqp = require("amqplib");

const rabbitmqUrl = "amqp://rabbitmq-service:5672";
//const rabbitmqUrl = "amqp://localhost:5672";

const exchangeName = "order.events";
const queueName = "notification.order.completed";

let channel = null;

const connectRabbitMQ = async () => {
  while (true) {
    try {
      console.log("Connecting to RabbitMQ...");

      const connection = await amqp.connect(rabbitmqUrl);

      channel = await connection.createChannel();

      await channel.assertExchange(exchangeName, "fanout", {
        durable: true,
      });

      await channel.assertQueue(queueName, {
        durable: true,
      });

      await channel.bindQueue(queueName, exchangeName, "");

      console.log("Connected to RabbitMQ");

      break;
    } catch (error) {
      console.log("RabbitMQ not ready. Retrying in 3 seconds...");

      channel = null;

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

const consumeOrderCompleted = async (NotificationModel) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  await channel.consume(queueName, async (message) => {
    try {
      const event = JSON.parse(message.content.toString());

      if (event.event !== "order.completed") {
        channel.ack(message);
        return;
      }

      console.log(
        `Order completed event received for order ${event.data.orderId}`,
      );

      const { orderId, customerId } = event.data;

      await NotificationModel.create({
        orderId: orderId,
        customerId: customerId,
        type: "ORDER_CONFIRMATION",
        channel: "IN_APP",
        message: `Your #order has been completed successfully.`,
        deliveryStatus: "SENT",
        isRead: false,
        sentAt: new Date(),
      });

      console.log(`Notification created for order ${orderId}`);

      channel.ack(message);
    } catch (error) {
      console.error("Error processing order.completed event:", error);

      channel.nack(message, false, false);
    }
  });
};

module.exports = {
  connectRabbitMQ,
  consumeOrderCompleted,
};
