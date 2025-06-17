export type AuthProps = {
    email: string;
    password: string;
}


export class Auth {
    private email: string;
    private password: string;

    constructor(props: AuthProps){
        Object.assign(this, props);
    }

    get properties(): Required<AuthProps> {
        return {
            email: this.email,
            password: this.password,
        }
    }
}