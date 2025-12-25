import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Journal Model
 * 
 * Daily journal entries for reflection and emotional processing
 */

export interface IJournalEntry extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    content: string; // ENCRYPTED
    mood: number; // 1-10
    tags: string[];
    gratitude?: string[]; // Things user is grateful for
    challenges?: string[]; // Challenges faced
    wins?: string[]; // Wins/achievements
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IJournalEntryModel extends Model<IJournalEntry> {
    // Static methods
}

const JournalEntrySchema = new Schema<IJournalEntry>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    content: {
        type: String,
        required: true,
        // Encrypted before saving
    },
    mood: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    gratitude: [{
        type: String,
        trim: true,
    }],
    challenges: [{
        type: String,
        trim: true,
    }],
    wins: [{
        type: String,
        trim: true,
    }],
    isPrivate: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Indexes
JournalEntrySchema.index({ userId: 1, createdAt: -1 });
JournalEntrySchema.index({ tags: 1 });

// Prevent model recompilation in development
const JournalEntry = (mongoose.models.JournalEntry as IJournalEntryModel) ||
    mongoose.model<IJournalEntry, IJournalEntryModel>('JournalEntry', JournalEntrySchema);

export default JournalEntry;
