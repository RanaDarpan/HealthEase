/**
 * Evidence-Based Therapeutic Tools
 * 
 * Library of clinical techniques for mental health support:
 * - CBT (Cognitive Behavioral Therapy) reframing
 * - Breathing exercises
 * - Grounding techniques
 * - Progressive muscle relaxation
 * - Mood tracking prompts
 */

export interface TherapeuticTool {
    name: string;
    type: 'cbt' | 'breathing' | 'grounding' | 'relaxation' | 'mood';
    description: string;
    instructions: string[];
    duration?: string;
    whenToUse: string[];
}

/**
 * CBT Reframing Techniques
 */
export const CBT_TECHNIQUES: TherapeuticTool[] = [
    {
        name: 'Thought Record',
        type: 'cbt',
        description: 'Challenge and reframe negative automatic thoughts',
        instructions: [
            'What thought is bothering you right now?',
            'What evidence supports this thought?',
            'What evidence contradicts this thought?',
            'What would you tell a friend having this thought?',
            'What\'s a more balanced way to think about this?',
        ],
        whenToUse: ['negative thinking', 'self-criticism', 'catastrophizing', 'black-and-white thinking'],
    },
    {
        name: 'Cognitive Distortion Check',
        type: 'cbt',
        description: 'Identify thinking patterns that may not reflect reality',
        instructions: [
            'Notice if you\'re:',
            '- All-or-nothing thinking ("I always fail")',
            '- Overgeneralizing ("Nothing ever works")',
            '- Mental filtering (only seeing negatives)',
            '- Fortune telling (predicting the worst)',
            'Try replacing with: "Sometimes... and sometimes..."',
        ],
        whenToUse: ['distorted thinking', 'anxiety', 'depression', 'worry'],
    },
    {
        name: 'Behavioral Activation',
        type: 'cbt',
        description: 'Break the cycle of low mood through activity',
        instructions: [
            'Even when motivation is low, small actions help:',
            '1. Pick ONE tiny task (make bed, drink water, step outside)',
            '2. Do it within the next 5 minutes',
            '3. Notice how you feel after',
            'Action often comes before motivation, not after.',
        ],
        whenToUse: ['low motivation', 'depression', 'feeling stuck', 'hopelessness'],
    },
];

/**
 * Breathing Exercises
 */
export const BREATHING_EXERCISES: TherapeuticTool[] = [
    {
        name: '4-7-8 Breathing',
        type: 'breathing',
        description: 'Calm your nervous system quickly',
        duration: '2-3 minutes',
        instructions: [
            '1. Breathe in through your nose for 4 counts',
            '2. Hold your breath for 7 counts',
            '3. Exhale completely through your mouth for 8 counts',
            '4. Repeat 3-4 times',
            'This activates your parasympathetic nervous system (calming)',
        ],
        whenToUse: ['anxiety', 'panic', 'stress', 'can\'t sleep', 'overwhelm'],
    },
    {
        name: 'Box Breathing',
        type: 'breathing',
        description: 'Used by military and athletes for focus and calm',
        duration: '3-5 minutes',
        instructions: [
            'Imagine tracing a square:',
            '1. Breathe IN for 4 counts (left side)',
            '2. HOLD for 4 counts (top)',
            '3. Breathe OUT for 4 counts (right side)',
            '4. HOLD for 4 counts (bottom)',
            'Repeat for several cycles',
        ],
        whenToUse: ['anxiety', 'stress', 'need focus', 'before difficult situation'],
    },
    {
        name: 'Diaphragmatic Breathing',
        type: 'breathing',
        description: 'Deep belly breathing to reduce tension',
        duration: '5 minutes',
        instructions: [
            '1. Place one hand on your chest, one on your belly',
            '2. Breathe deeply so your belly rises (not chest)',
            '3. Exhale slowly, feeling your belly fall',
            '4. Continue for 5 minutes',
            'This is the most natural, calming way to breathe',
        ],
        whenToUse: ['general stress', 'tension', 'physical anxiety symptoms'],
    },
];

/**
 * Grounding Techniques (for anxiety, dissociation, panic)
 */
export const GROUNDING_TECHNIQUES: TherapeuticTool[] = [
    {
        name: '5-4-3-2-1 Sensory Grounding',
        type: 'grounding',
        description: 'Anchor yourself in the present moment',
        duration: '3-5 minutes',
        instructions: [
            'Look around and name:',
            '- 5 things you can SEE',
            '- 4 things you can TOUCH',
            '- 3 things you can HEAR',
            '- 2 things you can SMELL',
            '- 1 thing you can TASTE',
            'This pulls you out of your mind and into your body.',
        ],
        whenToUse: ['panic attack', 'dissociation', 'flashback', 'anxiety spiral', 'overwhelm'],
    },
    {
        name: 'Physical Grounding',
        type: 'grounding',
        description: 'Use your body to feel present',
        duration: '2 minutes',
        instructions: [
            '- Press your feet firmly into the floor',
            '- Hold a cold object (ice cube, cold water)',
            '- Touch different textures around you',
            '- Splash cold water on your face',
            'Physical sensation interrupts mental spiraling',
        ],
        whenToUse: ['panic', 'intense emotions', 'dissociation', 'feeling unreal'],
    },
    {
        name: 'Mental Grounding',
        type: 'grounding',
        description: 'Use your mind to stay present',
        duration: '3 minutes',
        instructions: [
            'Try one of these:',
            '- Count backwards from 100 by 7s',
            '- Name all countries/cities/animals starting with each letter A-Z',
            '- Describe your surroundings in detail',
            '- Recite a poem, song lyrics, or prayer',
        ],
        whenToUse: ['racing thoughts', 'anxiety', 'intrusive thoughts'],
    },
];

/**
 * Progressive Muscle Relaxation
 */
export const RELAXATION_TECHNIQUES: TherapeuticTool[] = [
    {
        name: 'Progressive Muscle Relaxation',
        type: 'relaxation',
        description: 'Release physical tension throughout your body',
        duration: '10-15 minutes',
        instructions: [
            'Tense then relax each muscle group:',
            '1. Feet (curl toes) - 5 seconds, then release',
            '2. Legs (tighten) - 5 seconds, release',
            '3. Stomach (pull in) - 5 seconds, release',
            '4. Hands (make fists) - 5 seconds, release',
            '5. Shoulders (shrug up) - 5 seconds, release',
            '6. Face (scrunch) - 5 seconds, release',
            'Notice the difference between tension and relaxation.',
        ],
        whenToUse: ['physical tension', 'stress', 'before sleep', 'general anxiety'],
    },
];

/**
 * Get a therapeutic tool by type and context
 */
export function getTherapeuticTool(
    symptom: string,
    type?: 'cbt' | 'breathing' | 'grounding' | 'relaxation'
): TherapeuticTool | null {
    const allTools = [
        ...CBT_TECHNIQUES,
        ...BREATHING_EXERCISES,
        ...GROUNDING_TECHNIQUES,
        ...RELAXATION_TECHNIQUES,
    ];

    // Filter by type if specified
    const filteredTools = type
        ? allTools.filter(tool => tool.type === type)
        : allTools;

    // Find tool that matches the symptom
    const lowerSymptom = symptom.toLowerCase();

    const matchingTool = filteredTools.find(tool =>
        tool.whenToUse.some(use =>
            lowerSymptom.includes(use.toLowerCase()) || use.toLowerCase().includes(lowerSymptom)
        )
    );

    return matchingTool || null;
}

/**
 * Format therapeutic tool as a conversational response
 */
export function formatToolAsResponse(tool: TherapeuticTool): string {
    let response = `💙 **${tool.name}**\n\n${tool.description}\n\n`;

    if (tool.duration) {
        response += `⏱️ *${tool.duration}*\n\n`;
    }

    response += tool.instructions.join('\n') + '\n\n';
    response += '*Would you like to try this together?*';

    return response;
}

/**
 * Mood tracking conversational prompts
 */
export const MOOD_TRACKING_PROMPTS = {
    checkIn: [
        'How are you feeling right now, on a scale of 1-10?',
        'What\'s your energy level like today?',
        'How would you describe your mood in one word?',
    ],
    deeperExploration: [
        'What do you think might be contributing to this feeling?',
        'Have you noticed any patterns in when you feel this way?',
        'What activities or people tend to lift your mood?',
    ],
    validation: [
        'It makes sense that you\'d feel this way given what you\'re going through.',
        'Your feelings are valid, even if they\'re difficult.',
        'Thank you for sharing that with me. That takes courage.',
    ],
};

/**
 * Get validation response based on mood
 */
export function getValidationResponse(moodScore: number): string {
    if (moodScore <= 3) {
        return 'I hear that you\'re really struggling right now. That sounds incredibly tough. You don\'t have to go through this alone.';
    } else if (moodScore <= 5) {
        return 'It sounds like things are difficult at the moment. Whatever you\'re feeling is valid, and I\'m here to listen.';
    } else if (moodScore <= 7) {
        return 'Thank you for sharing how you\'re feeling. It\'s okay to have mixed or neutral feelings too.';
    } else {
        return 'I\'m glad to hear you\'re doing relatively well. What do you think is contributing to that?';
    }
}
