const amqp = require('amqplib');
const args = process.argv.slice(2);

(async () => {
    const conection = await amqp.connect('amqp://localhost');
    const channel = await conection.createChannel();

    const exchangeName = "exchange-fanout";
    await channel.assertExchange(exchangeName, 'fanout', { durable: true });

    const assertQueue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(assertQueue.queue, exchangeName, '');

    channel.consume(assertQueue.queue, (message) => {
        console.log("Message received: ", message.content.toString());
        if (args.length && args[0] === 'yes'){
            channel.ack(message);
        } else{
            channel.nack(message);
        }
    }, { noAck: false });
})()