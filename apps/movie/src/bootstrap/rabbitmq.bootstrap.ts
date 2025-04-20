import { env } from "../env";
import { Bootstrap } from "./bootstraps";
import amqp from "amqplib";

export class RabbitmqBootstrap extends Bootstrap {
    static channel: amqp.Channel
    connection!: amqp.ChannelModel
    static intance: RabbitmqBootstrap

    constructor(){
        super()
        if(!RabbitmqBootstrap.intance){
            RabbitmqBootstrap.intance = this
        }
    }

    static reinitialize(){
        RabbitmqBootstrap.intance.close()
        RabbitmqBootstrap.intance = new RabbitmqBootstrap()
        return RabbitmqBootstrap.intance.initialize()
    }

    initialize(): Promise<string | NodeJS.ErrnoException> {
        return new Promise(async(resolve, reject) => {

            const host = env.RABBITMQ_HOST || "localhost";

            try{
                this.connection = await amqp.connect(host);
                RabbitmqBootstrap.channel = await this.connection.createChannel();
                resolve(`RabbitMQ connected`);
            }catch (error) {
                console.error("RabbitMQ connection failed: ", error);
                reject(error)
            }
        })
    }

    close(){
        console.log("Closing RabbitMQ connection...");
        this.connection?.close();
    }
}