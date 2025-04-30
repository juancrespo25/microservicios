import { env } from "./env";
import app from "./app"
import { type Bootstrap, DatabaseBootstrap, KafkaBootstrap, ServerBootstrap  } from "./bootstrap"
import { RabbitmqBootstrap } from "./bootstrap/rabbitmq.bootstrap";
import { MovieApplication } from "./module/application";
import { ProducerService } from "./core/kafka/produce.service";
import { ConsumerService } from "./core/kafka/consumer.service";



(async () => {
    try {
        const serverBootstrap: Bootstrap = new ServerBootstrap(app)
        const databaseBootstrap: Bootstrap  = new DatabaseBootstrap()
        const rabbitmqBootstrap: Bootstrap = new RabbitmqBootstrap()
        const kafkaBootstrap: Bootstrap = new KafkaBootstrap()

        const promises = [
            serverBootstrap.initialize(),
            databaseBootstrap.initialize(),
            rabbitmqBootstrap.initialize(),
            kafkaBootstrap.initialize()]

        await Promise.all(promises)
        console.log(`Server is running on port ${env.PORT}`);
        console.log("Database connection established")
        console.log(`RabbitMQ connection established`);
        console.log(`Kafka connection established`);

       MovieApplication.instance.listenNotification()
       await ProducerService.connect()
       await ConsumerService.connect(env.KAFKA_TOPIC_MESSAGE)
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