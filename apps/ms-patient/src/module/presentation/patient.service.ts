import * as bcrypt from 'bcryptjs';

export class PatientService {

    static async crypt(data: string): Promise<string> {
        return await bcrypt.hash(data, 10);
    }
}