import express from "express"
import cors from "cors"

const startTime = Date.now()

class App {
    readonly app = express()

    constructor() {
        this.mountMiddlewaresCommon()
        this.mountRoutes()
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

    }
}

export default new App().app