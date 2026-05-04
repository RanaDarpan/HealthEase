import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            anonymousMode?: boolean;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        id: string;
        anonymousMode?: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string;
        anonymousMode?: boolean;
    }
}
