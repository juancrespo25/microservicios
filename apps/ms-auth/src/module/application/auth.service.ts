import * as jwt from 'jsonwebtoken'
import { env } from '../../env';
import * as bcrypt from 'bcryptjs';

export class AuthService {
    static generateAccessToken(name: string, lastName: string) {
        return jwt.sign({ name, lastName }, env.JWT_SECRET, { expiresIn: '2h' });
    }

    static verifyToken(token: string): boolean {
        try {
            jwt.verify(token, env.JWT_SECRET);
            return true;
        } catch (error) {
            console.log('Token verification failed:', error);
            return false;
        }
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}