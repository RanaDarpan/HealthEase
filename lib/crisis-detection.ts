/**
 * CRITICAL SAFETY MODULE: Crisis Detection System
 * 
 * This module is responsible for detecting when a user is in crisis
 * and needs immediate intervention. It uses both keyword matching
 * and AI sentiment analysis with a LOW threshold to prioritize safety.
 * 
 * SAFETY PRINCIPLE: False positives are acceptable. False negatives are NOT.
 */

/**
 * High-risk keywords that indicate potential crisis
 * These phrases are strong indicators of suicidal ideation or self-harm
 */
const CRISIS_KEYWORDS = [
    // Direct suicidal ideation
    'kill myself',
    'end my life',
    'want to die',
    'suicide',
    'suicidal',
    'end it all',
    'better off dead',
    'no reason to live',
    'can\'t go on',

    // Self-harm indicators
    'harm myself',
    'hurt myself',
    'cut myself',
    'cutting',

    // Despair and hopelessness
    'no point in living',
    'everyone would be better off without me',
    'life is meaningless',
    'can\'t take it anymore',
    'nothing matters',
    'give up on life',

    // Planning indicators
    'planning to',
    'going to kill',
    'final goodbye',
    'lastMessage',
    'won\'t be around',

    // Passive suicidal ideation
    'wish i was dead',
    'wish i wasn\'t born',
    'shouldn\'t exist',
    'burden on everyone',
];

/**
 * Medium-risk keywords that warrant closer monitoring
 */
const WARNING_KEYWORDS = [
    'hopeless',
    'worthless',
    'giving up',
    'can\'t cope',
    'unbearable',
    'too much pain',
    'end the pain',
    'no way out',
    'trapped',
    'desperate',
];

/**
 * Checks if text contains crisis keywords
 * Case-insensitive matching
 * 
 * @param text - Text to analyze
 * @returns Crisis detection result
 */
export function detectCrisisKeywords(text: string): {
    isCrisis: boolean;
    isWarning: boolean;
    matchedPhrases: string[];
    severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
} {
    const lowerText = text.toLowerCase();
    const matchedCrisis: string[] = [];
    const matchedWarning: string[] = [];

    // Check for crisis keywords
    for (const keyword of CRISIS_KEYWORDS) {
        if (lowerText.includes(keyword.toLowerCase())) {
            matchedCrisis.push(keyword);
        }
    }

    // Check for warning keywords
    for (const keyword of WARNING_KEYWORDS) {
        if (lowerText.includes(keyword.toLowerCase())) {
            matchedWarning.push(keyword);
        }
    }

    // Determine severity
    let severity: 'none' | 'low' | 'medium' | 'high' | 'critical' = 'none';

    if (matchedCrisis.length >= 2) {
        severity = 'critical'; // Multiple crisis keywords = highest severity
    } else if (matchedCrisis.length === 1) {
        severity = 'high'; // Single crisis keyword = high severity
    } else if (matchedWarning.length >= 3) {
        severity = 'medium'; // Multiple warning keywords
    } else if (matchedWarning.length > 0) {
        severity = 'low'; // Single warning keyword
    }

    return {
        isCrisis: matchedCrisis.length > 0,
        isWarning: matchedWarning.length > 0,
        matchedPhrases: [...matchedCrisis, ...matchedWarning],
        severity,
    };
}

/**
 * Analyzes sentiment to detect crisis
 * Uses AI-based sentiment analysis as a secondary check
 * 
 * @param sentimentScore - Score from sentiment analysis (-1 to 1)
 * @param sentimentLabel - Label from sentiment analysis
 * @returns Whether sentiment indicates crisis
 */
export function detectCrisisSentiment(
    sentimentScore: number,
    sentimentLabel: string
): boolean {
    // Direct crisis label from AI
    if (sentimentLabel === 'crisis') {
        return true;
    }

    // Very negative sentiment (below -0.7)
    if (sentimentScore < -0.7) {
        return true;
    }

    return false;
}

/**
 * Main crisis detection function
 * Combines keyword matching and sentiment analysis
 * LOW THRESHOLD: Prioritizes safety over accuracy
 * 
 * @param text - User's message
 * @param sentimentScore - Optional sentiment score
 * @param sentimentLabel - Optional sentiment label
 * @param userCrisisHistory - Optional count of past crisis events
 * @returns Complete crisis detection result
 */
export function detectCrisis(
    text: string,
    sentimentScore?: number,
    sentimentLabel?: string,
    userCrisisHistory?: number
): {
    isCrisis: boolean;
    severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
    reason: string;
    matchedPhrases: string[];
    requiresIntervention: boolean;
} {
    // Keyword-based detection
    const keywordResult = detectCrisisKeywords(text);

    // Sentiment-based detection (if provided)
    let sentimentCrisis = false;
    if (sentimentScore !== undefined && sentimentLabel !== undefined) {
        sentimentCrisis = detectCrisisSentiment(sentimentScore, sentimentLabel);
    }

    // Context-aware severity adjustment
    let adjustedSeverity = keywordResult.severity;

    // If user has crisis history, lower the threshold for intervention
    if (userCrisisHistory && userCrisisHistory > 0) {
        if (adjustedSeverity === 'medium') {
            adjustedSeverity = 'high'; // Escalate medium to high for at-risk users
        } else if (adjustedSeverity === 'low' && sentimentScore && sentimentScore < -0.4) {
            adjustedSeverity = 'medium'; // Be more cautious with warning signs
        }
    }

    // Determine if intervention is required
    const isCrisis = keywordResult.isCrisis || sentimentCrisis;
    const requiresIntervention =
        adjustedSeverity === 'high' ||
        adjustedSeverity === 'critical' ||
        sentimentCrisis;

    // Determine reason
    let reason = '';
    if (keywordResult.isCrisis) {
        reason = 'Crisis keywords detected';
    } else if (sentimentCrisis) {
        reason = 'Severe negative sentiment detected';
    } else if (keywordResult.isWarning) {
        reason = 'Warning indicators detected';
    } else {
        reason = 'No crisis detected';
    }

    // Add context note if history influenced decision
    if (userCrisisHistory && userCrisisHistory > 0 && adjustedSeverity !== keywordResult.severity) {
        reason += ' (elevated due to crisis history)';
    }

    return {
        isCrisis,
        severity: adjustedSeverity,
        reason,
        matchedPhrases: keywordResult.matchedPhrases,
        requiresIntervention,
    };
}

/**
 * India crisis helpline numbers
 * These will be displayed in the crisis overlay
 */
export const INDIA_HELPLINES = [
    {
        name: 'AASRA',
        number: '91-9820466726',
        hours: '24/7',
        description: 'Suicide prevention helpline',
    },
    {
        name: 'Vandrevala Foundation',
        number: '1860-2662-345',
        hours: '24/7',
        description: 'Mental health support',
    },
    {
        name: 'iCall',
        number: '022-25521111',
        hours: 'Mon-Sat, 8 AM - 10 PM',
        description: 'Psychosocial helpline',
    },
    {
        name: 'Sneha India',
        number: '91-44-24640050',
        hours: '24/7',
        description: 'Emotional support',
    },
    {
        name: 'Sumaitri',
        number: '011-23389090',
        hours: '2 PM - 10 PM (Delhi)',
        description: 'Crisis intervention',
    },
];
