import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * CrisisLog Model
 * 
 * Anonymized logging of crisis events for safety monitoring
 * CRITICAL: All data is anonymized - no identifiable information
 */

export interface ICrisisLog extends Document {
    sessionId: string; // Reference to chat session (hashed)
    anonymizedUserId: string; // Hashed user ID for privacy
    triggerPhrases: string[]; // What keywords triggered detection
    detectionMethod: 'keyword' | 'sentiment' | 'both';
    severity: 'low' | 'medium' | 'high' | 'critical';
    resourcesProvided: string[]; // Which helplines were shown
    userAction?: 'dismissed' | 'called' | 'breathing' | 'none';
    sentimentScore?: number;
    timestamp: Date;
    metadata: {
        timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
        dayOfWeek: number; // 0-6
        monthDay: number; // 1-31
    };
}

interface ICrisisLogModel extends Model<ICrisisLog> {
    // Static methods
}

const CrisisLogSchema = new Schema<ICrisisLog>({
    sessionId: {
        type: String,
        required: true,
        index: true,
    },
    anonymizedUserId: {
        type: String,
        required: true,
        // This is a hashed version of the user ID
    },
    triggerPhrases: [{
        type: String,
        required: true,
    }],
    detectionMethod: {
        type: String,
        enum: ['keyword', 'sentiment', 'both'],
        required: true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true,
        index: true,
    },
    resourcesProvided: [{
        type: String,
    }],
    userAction: {
        type: String,
        enum: ['dismissed', 'called', 'breathing', 'none'],
        default: 'none',
    },
    sentimentScore: {
        type: Number,
        min: -1,
        max: 1,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
    metadata: {
        timeOfDay: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night'],
            required: true,
        },
        dayOfWeek: {
            type: Number,
            min: 0,
            max: 6,
            required: true,
        },
        monthDay: {
            type: Number,
            min: 1,
            max: 31,
            required: true,
        },
    },
}, {
    timestamps: true,
});

// Indexes for analytics
CrisisLogSchema.index({ timestamp: -1 });
CrisisLogSchema.index({ severity: 1, timestamp: -1 });
CrisisLogSchema.index({ 'metadata.timeOfDay': 1 });

// Auto-populate metadata
CrisisLogSchema.pre('save', function (next) {
    const log = this as ICrisisLog;
    const date = log.timestamp;

    // Set time of day
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) {
        log.metadata.timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 17) {
        log.metadata.timeOfDay = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
        log.metadata.timeOfDay = 'evening';
    } else {
        log.metadata.timeOfDay = 'night';
    }

    // Set day of week (0 = Sunday)
    log.metadata.dayOfWeek = date.getDay();

    // Set day of month
    log.metadata.monthDay = date.getDate();

    next();
});

// Prevent model recompilation in development
const CrisisLog = (mongoose.models.CrisisLog as ICrisisLogModel) ||
    mongoose.model<ICrisisLog, ICrisisLogModel>('CrisisLog', CrisisLogSchema);

export default CrisisLog;
