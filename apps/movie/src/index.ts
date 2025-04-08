import app from "./app"
import { type Bootstrap, DatabaseBootstrap, ServerBootstrap  } from "./bootstrap"
import { env } from "./env";


(async () => {
    try {
        const serverBootstrap: Bootstrap = new ServerBootstrap(app)
        const databaseBootstrap  = new DatabaseBootstrap()

        const promises = [serverBootstrap.initialize(), databaseBootstrap.initialize()]

        await Promise.all(promises)
        console.log(`Server is running on port ${env.PORT}`);
        console.log("Database connection established")
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