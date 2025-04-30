
import type{ Producer } from "kafkajs";
import { MessageBrokerKafka } from "./kafka.service";

export class ProducerService {

    instance: ProducerService

    private static producer: Producer

    static async connect(){
        this.producer = await MessageBrokerKafka.connectProducer()
    }

    static async publish(message: object, key: string, topic: string){
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message), key }]
        })
    }
}