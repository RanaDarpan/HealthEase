import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Model
 * 
 * Supports both anonymous and authenticated users
 * Anonymous mode is DEFAULT for privacy-first approach
 */

export interface IUser extends Document {
    email?: string;
    password?: string;
    anonymousMode: boolean;
    anonymousId?: string; // Unique identifier for anonymous users
    createdAt: Date;
    lastActive: Date;
    settings: {
        privacy: {
            saveHistory: boolean;
            shareSentiment: boolean;
        };
        notifications: {
            dailyCheckIn: boolean;
            crisisAlerts: boolean;
        };
    };
    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
    // Static methods can be defined here
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        sparse: true, // Allows multiple null values (for anonymous users)
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v: string) {
                return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        select: false, // Don't include password in queries by default
    },
    anonymousMode: {
        type: Boolean,
        default: true, // PRIVACY FIRST: Anonymous by default
    },
    anonymousId: {
        type: String,
        unique: true,
        sparse: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    settings: {
        privacy: {
            saveHistory: {
                type: Boolean,
                default: true,
            },
            shareSentiment: {
                type: Boolean,
                default: false, // Don't share by default
            },
        },
        notifications: {
            dailyCheckIn: {
                type: Boolean,
                default: false,
            },
            crisisAlerts: {
                type: Boolean,
                default: true, // Crisis alerts ON by default
            },
        },
    },
}, {
    timestamps: true,
});

// Index for performance
UserSchema.index({ email: 1 });
UserSchema.index({ anonymousId: 1 });
UserSchema.index({ lastActive: 1 });

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
    const user = this as IUser;

    // Only hash password if it's modified or new
    if (!user.isModified('password') || !user.password) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        if (!this.password) return false;
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

// Auto-expire anonymous users after 90 days of inactivity
UserSchema.index(
    { lastActive: 1 },
    {
        expireAfterSeconds: 90 * 24 * 60 * 60, // 90 days
        partialFilterExpression: { anonymousMode: true },
    }
);

// Prevent model recompilation in development
const User = (mongoose.models.User as IUserModel) || mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
