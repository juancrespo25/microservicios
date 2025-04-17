const amqp = require('amqplib');

(async () => {
    const conection = await amqp.connect('amqp://localhost');
    const channel = await conection.createChannel();

    const queueName ='cola 1';
    await channel.assertQueue(queueName, {durable: false});

    channel.consume(queueName, async (message) =>  {
        console.log("Message received: ", message.content.toString())
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const number = Math.random()
                    if (number > 0.5) {
                        channel.ack(message);
                        console.log("Aprobado")
                        resolve()
                    }else {
                        channel.nack(message);
                        console.log("Rechazado")
                        reject("Rechazado")
                    }
                }, 1000);
            })

        } catch (error){
            console.log("Error: ", error)
        }
    }, {
        noAck: false
    });

})()