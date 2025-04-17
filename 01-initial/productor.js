const amqp = require('amqplib');

const args = process.argv.slice(2);

(async () => {
    const conection = await amqp.connect('amqp://localhost');
    const channel = await conection.createChannel();

    const queueName = "cola 1";
    await channel.assertQueue(queueName, {
        durable: false
    });

    const message = args.length > 0 ? args[0] : 'Message by default';
    channel.sendToQueue(queueName, Buffer.from(message));

    setTimeout(() => {
        channel.close();
        conection.close();
        process.exit(0)
    }, 2000);
})()