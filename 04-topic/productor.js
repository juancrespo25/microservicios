const amqp = require('amqplib');
const args = process.argv.slice(2);

(async() => {
    const conection = await amqp.connect('amqp://localhost');
    const channel = await conection.createChannel();

    const exchangeName = "exchange-topic";
    await channel.assertExchange(exchangeName, 'topic', { durable: true });

    const messages =  args.length > 0 ? args[0] : ["messages by default"];
    const routingKey = args.length > 1 ? args[1] : "key";

    channel.publish(exchangeName, routingKey, Buffer.from(messages));

    console.log(" [x] Sent %s:%s", routingKey, messages);

    setTimeout(() => {
        conection.close();
        process.exit(0);
    } , 2000)

})()