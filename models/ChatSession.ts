import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * ChatSession Model
 * 
 * Stores encrypted chat messages between user and AI
 * Tracks sentiment and crisis detection
 */

export interface IMessage {
    role: 'user' | 'assistant';
    content: string; // ENCRYPTED in database
    sentiment?: {
        score: number; // -1 to 1
        label: 'positive' | 'neutral' | 'negative' | 'crisis';
        confidence: number;
    };
    crisisDetected?: boolean;
    timestamp: Date;
}

export interface IChatSession extends Document {
    userId: mongoose.Types.ObjectId;
    sessionId: string; // Unique session identifier
    messages: IMessage[];
    conversationSummary?: string; // Summary of the conversation for context
    userPatterns?: {
        commonTopics: string[]; // Topics frequently discussed
        emotionalThemes: string[]; // Recurring emotional themes
    };
    startedAt: Date;
    lastMessageAt: Date;
    crisisCount: number; // Number of crisis messages in this session
    averageSentiment: number; // Rolling average sentiment
    metadata: {
        messageCount: number;
        averageResponseTime?: number; // AI response time in ms
    };
}

interface IChatSessionModel extends Model<IChatSession> {
    // Static methods
}

const MessageSchema = new Schema<IMessage>({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
        // Content is encrypted before saving
    },
    sentiment: {
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
    crisisDetected: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

const ChatSessionSchema = new Schema<IChatSession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    messages: [MessageSchema],
    conversationSummary: {
        type: String,
        // Summary of conversation for long-term context
    },
    userPatterns: {
        commonTopics: [String],
        emotionalThemes: [String],
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
    crisisCount: {
        type: Number,
        default: 0,
    },
    averageSentiment: {
        type: Number,
        default: 0,
    },
    metadata: {
        messageCount: {
            type: Number,
            default: 0,
        },
        averageResponseTime: Number,
    },
}, {
    timestamps: true,
});

// Indexes for performance
// Note: sessionId index is defined in schema (line 88)
ChatSessionSchema.index({ userId: 1, lastMessageAt: -1 });
ChatSessionSchema.index({ crisisCount: -1 });

// Update lastMessageAt on message addition
ChatSessionSchema.pre('save', function (next) {
    const session = this as IChatSession;
    if (session.messages && session.messages.length > 0) {
        session.lastMessageAt = session.messages[session.messages.length - 1].timestamp;
        session.metadata.messageCount = session.messages.length;

        // Calculate average sentiment
        const sentiments = session.messages
            .filter(m => m.sentiment?.score !== undefined)
            .map(m => m.sentiment!.score);

        if (sentiments.length > 0) {
            session.averageSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
        }

        // Count crisis messages
        session.crisisCount = session.messages.filter(m => m.crisisDetected).length;
    }
    next();
});

// Prevent model recompilation in development
const ChatSession = (mongoose.models.ChatSession as IChatSessionModel) ||
    mongoose.model<IChatSession, IChatSessionModel>('ChatSession', ChatSessionSchema);

export default ChatSession;
