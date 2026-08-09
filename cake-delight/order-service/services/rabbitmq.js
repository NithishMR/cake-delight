const amqp = require("amqplib");

const rabbitmqUrl = "amqp://rabbitmq-service:5672";

let channel = null;

const connectRabbitMQ = async () => {
  while (true) {
    try {
      console.log("Connecting to RabbitMQ...");

      const connection = await amqp.connect(rabbitmqUrl);

      channel = await connection.createChannel();

      console.log("Connected to RabbitMQ");

      break;
    } catch (error) {
      console.log("RabbitMQ not ready. Retrying in 3 seconds...");

      channel = null;

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

const publishOrderCompleted = async (order) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  const queueName = "order.completed";

  await channel.assertQueue(queueName, {
    durable: true,
  });

  const message = {
    event: "order.completed",
    data: {
      orderId: order._id,
      customerId: order.customerId,
      items: order.items,
      totalAmount: order.totalAmount,
      completedAt: order.completedAt,
    },
  };

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log("order.completed event published");
};

module.exports = {
  connectRabbitMQ,
  publishOrderCompleted,
};
