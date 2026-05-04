import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';

/**
 * Lazy-evaluated encryption key buffer.
 * Validates key length at usage time, not at module load time,
 * so the app doesn't crash on startup when env vars are missing.
 */
let _keyBuffer: Buffer | null = null;

function getKey(): Buffer {
    if (_keyBuffer) return _keyBuffer;

    if (!ENCRYPTION_KEY) {
        throw new Error(
            '❌ ENCRYPTION_KEY environment variable is not set. ' +
            'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
        );
    }

    const buf = Buffer.from(ENCRYPTION_KEY, 'hex');

    if (buf.length !== 32) {
        throw new Error(
            `❌ ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters). Got ${buf.length} bytes.`
        );
    }

    _keyBuffer = buf;
    return _keyBuffer;
}

/**
 * Encrypts text using AES-256-GCM
 * Returns format: iv:authTag:encryptedData (all hex encoded)
 */
export function encrypt(text: string): string {
    try {
        const KEY = getKey();
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');
        return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypts text encrypted with encrypt()
 */
export function decrypt(encryptedData: string): string {
    try {
        const KEY = getKey();
        const parts = encryptedData.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted data format');
        }

        const [ivHex, authTagHex, encrypted] = parts;
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Hashes text using SHA-256
 */
export function hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Generates a random token
 */
export function generateToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
}
