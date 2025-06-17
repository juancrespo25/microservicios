import "reflect-metadata";
import { env } from "./env";
import app from "./app"
import { type Bootstrap, ServerBootstrap, DatabaseBootstrap } from "./bootstrap"
import { KafkaService } from "lib-kafka";
import { KafkaBootstrap } from "./bootstrap";
import { AppointmentAdapter } from "./module/adapters";
import { AppointmentPort } from "./module/ports";
import { AppointmentApplication } from "./module/application";


(async () => {

    try {
        const serverBootstrap: Bootstrap = new ServerBootstrap(app)
        const databaseBootstrap: Bootstrap = new DatabaseBootstrap()
        const kafkaBootstrap: Bootstrap = new KafkaBootstrap()

        const promises = [
            serverBootstrap.initialize(),
            databaseBootstrap.initialize(),
            kafkaBootstrap.initialize()
        ]

        await Promise.all(promises)
        console.log(`Server is running on port ${env.PORT}`);
        console.log("Database connection established")
        console.log("Kafka connection established")

        const kafka = KafkaService.getInstance([env.KAFKA_TOPIC_PE, env.KAFKA_TOPIC_CONFIRM, env.KAFKA_TOPIC_ERROR], env.KAFKA_GROUP_ID, KafkaBootstrap.getInstanceKafka())
        await kafka.connectProducer()
        await kafka.connectConsumer()

        const port: AppointmentPort = new AppointmentAdapter()
        const application: AppointmentApplication = new AppointmentApplication(port)
        await application.subscribe()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception: ", error);
    process.exit(1);
})

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection: ", promise, "reason:", reason);
    process.exit(1);
})

process.on("exit", (code) => {
    console.log("Process is existing");
    gratefulShutdown()
})

process.on("SIGINT", () => {
    console.log("Received SIGINT. Exiting...")
    process.exit(0)
})

process.on("SIGTERM", () => {
    console.log("Received SIGTERM. Exiting...")
    process.exit(0)
})


function gratefulShutdown() {
    console.log("Graceful shutting down...")
    process.exit(0)
}