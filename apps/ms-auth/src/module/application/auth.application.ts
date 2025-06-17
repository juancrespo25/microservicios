import { AuthPort } from "../ports";
import { Auth } from "./auth";
import { AuthService } from "./auth.service";

export class AuthApplication {
    constructor(private readonly port: AuthPort) { }

    async login(auth: Auth) {
        const response = await this.port.login(auth);

        const {patient} = response;

        if (!patient) {
            return null
        }

        const {name, lastName, password} = patient

        if(AuthService.comparePassword(auth.properties.password, password)) {
            const token = AuthService.generateAccessToken(name, lastName);
            return token
        } else {
            return null
        }
    }

    async verifyToken(token: string): Promise<boolean> {
        return await AuthService.verifyToken(token)
    }
}