import { RabbitmqBootstrap } from "../../bootstrap";

export async function rabbitmqHealthcheck(): Promise<{resource: string, status: string}>  {
    try {

        if(!RabbitmqBootstrap.channel){
            try{
                await RabbitmqBootstrap.reinitialize()
                console.log("RabbitMQ channel reinitialized")
            }catch(reconnectError){
                console.error("Healthcheck RabbitMQ failed", reconnectError);
                throw new Error(JSON.stringify({
                    resource: "RabbitMQ", 
                    status:"Down", 
                    error: "KO: RabbitMQ channel not initialized"}));
            }
        }

        const {queue} = await RabbitmqBootstrap.channel.assertQueue("", {
            exclusive: true,
            autoDelete: true
        });
        await RabbitmqBootstrap.channel.deleteQueue(queue);

        return {resource: "Rabbit", status: "UP"}
    }catch (error) {
        console.error("Healthcheck RabbitMQ failed", error);
        throw new Error(JSON.stringify({resource: "RabbitMQ", status:"Down", error: "KO: RabbitMQ channel not initialized"}));
    }
}