import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

// Warn but don't throw during build to allow compilation
if (!MONGODB_URI && typeof window === 'undefined') {
    console.warn('⚠️  MONGODB_URI not set. Database features will not work.');
}

// Cache connection across hot reloads in development
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Establishes connection to MongoDB Atlas
 */
export async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not set. Please configure it in your environment variables.');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB connected successfully');
            return mongoose;
        }).catch((error) => {
            console.error('❌ MongoDB connection error:', error);
            cached.promise = null; // Reset promise on error
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB() {
    if (cached.conn) {
        await mongoose.disconnect();
        cached.conn = null;
        cached.promise = null;
        console.log('✅ MongoDB disconnected');
    }
}

export default mongoose;
