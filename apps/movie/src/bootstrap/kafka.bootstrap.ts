import { Kafka, logLevel } from "kafkajs";
import { Bootstrap, type ReturnType } from "./bootstraps";
import { env } from "../env";

export class KafkaBootstrap  extends Bootstrap {

    private static kafka: Kafka
    initialize(): Promise<ReturnType> {
        return new Promise((resolve, reject) => {
            try{
                const {KAFKA_BROKER, CLIENT_ID} = env

                KafkaBootstrap.kafka = new Kafka({
                    clientId: CLIENT_ID,
                    brokers: [KAFKA_BROKER],
                    logLevel: logLevel.INFO
                })
                resolve(true)
            }catch (error) {
                reject(error)
            }
        })
    }

    static getIntanceKafka(){
        if(!KafkaBootstrap.kafka){
            throw new Error("Kafka intance not initialized")
        }

        return KafkaBootstrap.kafka
    }

}