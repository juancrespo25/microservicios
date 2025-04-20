import { DatabaseBootstrap } from "../../bootstrap";

export async function databaseHealthCheck(): Promise<{resource: string, status: string}> {
    try{
        await DatabaseBootstrap.dataSource.manager.query("SELECT 1")
        return {resource: "Database", status: "UP"}
    }catch(error){
        console.error("Healthcheck Database failed", error)
        throw new Error(JSON.stringify({resource: "Database", status:"Down", error: "KO: Healthcheck Database failed"}))
    }
}