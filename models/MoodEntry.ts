import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * MoodEntry Model
 * 
 * Tracks user mood over time with encrypted notes
 * Enables mood trend analysis and pattern detection
 */

export interface IMoodEntry extends Document {
    userId: mongoose.Types.ObjectId;
    moodScore: number; // 1-10 scale (1 = very low, 10 = very high)
    notes?: string; // ENCRYPTED in database
    detectedSentiment?: {
        score: number;
        label: 'positive' | 'neutral' | 'negative' | 'crisis';
        confidence: number;
    };
    triggers: string[]; // What contributed to this mood
    activities: string[]; // What activities were done
    context?: {
        timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
        weather?: string;
        location?: string;
    };
    createdAt: Date;
}

interface IMoodEntryModel extends Model<IMoodEntry> {
    // Static methods
}

const MoodEntrySchema = new Schema<IMoodEntry>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    moodScore: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        validate: {
            validator: Number.isInteger,
            message: 'Mood score must be an integer between 1 and 10',
        },
    },
    notes: {
        type: String,
        // Encrypted before saving
    },
    detectedSentiment: {
        score: {
            type: Number,
            min: -1,
            max: 1,
        },
        label: {
            type: String,
            enum: ['positive', 'neutral', 'negative', 'crisis'],
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
        },
    },
    triggers: [{
        type: String,
        trim: true,
    }],
    activities: [{
        type: String,
        trim: true,
    }],
    context: {
        timeOfDay: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night'],
        },
        weather: String,
        location: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
    timestamps: true,
});

// Indexes for queries
MoodEntrySchema.index({ userId: 1, createdAt: -1 });
MoodEntrySchema.index({ moodScore: 1 });
MoodEntrySchema.index({ 'detectedSentiment.label': 1 });

// Auto-set time of day if not provided
MoodEntrySchema.pre('save', function (next) {
    const entry = this as IMoodEntry;

    if (!entry.context?.timeOfDay) {
        const hour = entry.createdAt.getHours();
        let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';

        if (hour >= 5 && hour < 12) {
            timeOfDay = 'morning';
        } else if (hour >= 12 && hour < 17) {
            timeOfDay = 'afternoon';
        } else if (hour >= 17 && hour < 21) {
            timeOfDay = 'evening';
        } else {
            timeOfDay = 'night';
        }

        if (!entry.context) {
            entry.context = { timeOfDay };
        } else {
            entry.context.timeOfDay = timeOfDay;
        }
    }

    next();
});

// Prevent model recompilation in development
const MoodEntry = (mongoose.models.MoodEntry as IMoodEntryModel) ||
    mongoose.model<IMoodEntry, IMoodEntryModel>('MoodEntry', MoodEntrySchema);

export default MoodEntry;
