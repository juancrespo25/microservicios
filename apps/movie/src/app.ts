import express from "express"
import cors from "cors"
import { movieRouter } from "./module/presentation"
import { databaseHealthCheck } from "./core/healthcheck/database.healthckeck"
import { rabbitmqHealthcheck } from "./core/healthcheck/rabbitmq.healthchecks"


class App {
    readonly app = express()

    constructor() {


        this.mountMiddlewaresCommon()
        this.mountRoutes()
        this.mountRoutesHealthcheck()

    }

    private mountMiddlewaresCommon() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
    }

    private mountRoutes() {
        this.app.get("/", (request, response) => {

            response.send("Hello World")
        })

        this.app.use("/movie", movieRouter)
    }

    private mountRoutesHealthcheck() {
        this.app.get("/healthcheck", async (_request, response) => {
            const healthchecks = [
                databaseHealthCheck(),
               // rabbitmqHealthcheck()
            ]

            const results= await Promise.allSettled(healthchecks);

            const successCheks = results.filter(result => result.status === "fulfilled")
            const successReassons = successCheks.map(result => result.value)

            const failedCheks = results.filter(result => result.status === "rejected")
            const failReassons = failedCheks.map(result => JSON.parse(result.reason.message));

            const statusHealthCheck = successReassons.length === healthchecks.length ? 200 : 500;

            response.status(statusHealthCheck).json([...successReassons, ...failReassons])
        })
    }

}

export default new App().app