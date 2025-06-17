import "reflect-metadata";
import { env } from "./env";
import app from "./app"
import { type Bootstrap, ServerBootstrap, DatabaseBootstrap } from "./bootstrap"
import { KafkaService } from "lib-kafka"
import { KafkaBootstrap } from "./bootstrap";
import { AppointmentPort } from "./module/ports";
import { AppointmentAdapter } from "./module/adapters";
import { AppointmentApplication } from "./module/application";



(async () => {

    try {

        const kafkaBootstrap: Bootstrap = new KafkaBootstrap();

        await kafkaBootstrap.initialize();
        const kafka = KafkaService.getInstance([env.KAFKA_TOPIC_PE, env.KAFKA_TOPIC_CO, env.KAFKA_TOPIC_MX, env.KAFKA_TOPIC_CONFIRM, env.KAFKA_TOPIC_ERROR], env.KAFKA_GROUP_ID, KafkaBootstrap.getInstanceKafka())
        await kafka.connectProducer()
        await kafka.connectConsumer()

        const port: AppointmentPort = new AppointmentAdapter();
        const application = new AppointmentApplication(port);
        await application.subscribe()

        const serverBootstrap: Bootstrap = new ServerBootstrap(app)
        const databaseBootstrap: Bootstrap = new DatabaseBootstrap()

        const promises = [
            serverBootstrap.initialize(),
            databaseBootstrap.initialize()
        ]

        await Promise.all(promises)
        console.log(`Server is running on port ${env.PORT}`);
        console.log("Database connection established")
        console.log("Kafka connection established")

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