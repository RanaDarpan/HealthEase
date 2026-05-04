# Crisis Intervention Protocol

## Overview

This document defines the complete crisis intervention protocol for MindEase's mental health chatbot. The protocol uses a multi-layered approach combining keyword detection, sentiment analysis, and contextual awareness to ensure user safety.

## Crisis Detection Flow

```
User Message Received
        ↓
[1] Keyword Matching
        ↓
[2] Sentiment Analysis
        ↓
[3] Context Check (history)
        ↓
Determine Severity Level
        ↓
Execute Appropriate Response
```

## Severity Levels

### Level 1: Low (Warning Indicators)
**Triggers:**
- Single warning keyword (hopeless, worthless, giving up)
- Sentiment score: -0.3 to -0.5
- General distress without specific crisis language

**Response:**
- Validate feelings
- Ask open-ended questions
- Offer coping techniques (breathing, grounding)
- Monitor closely in follow-up messages

**Example:**
> "It sounds like you're going through a really difficult time. That must feel overwhelming. Would you like to talk about what's weighing on you?"

---

### Level 2: Medium (Elevated Risk)
**Triggers:**
- 2-3 warning keywords
- Sentiment score: -0.5 to -0.7
- Expressions of despair or trapped feelings

**Response:**
- Strong validation
- Gentle exploration of thoughts
- Suggest behavioral activation (tiny action)
- Offer grounding exercises
- Encourage professional support

**Example:**
> "I hear that you're feeling trapped and like there's no way out. Those feelings are incredibly hard to sit with. Sometimes when everything feels overwhelming, taking just one tiny action can help - even something as small as stepping outside for 30 seconds. Would you be willing to try something like that with me?"

---

### Level 3: High (Single Crisis Keyword)
**Triggers:**
- 1 crisis keyword (e.g., "want to die", "hurt myself")
- Sentiment score: -0.7 to -0.9
- Passive suicidal ideation

**Response:**
- **ACTIVATE CRISIS OVERLAY** (automatic)
- Acknowledge pain without judgment
- Validate struggle
- Remind that help is available
- Show hotline numbers prominently
- Ask if they're safe right now

**Example:**
> "I'm really concerned about what you're sharing, and I'm glad you told me. The pain you're experiencing sounds unbearable. You don't have to face this alone - there are people trained to help who can talk with you right now. I'm showing you some immediate support resources. Are you in a safe place right now?"

**UI Actions:**
- Display `CrisisOverlay` with severity="high"
- Show all India helplines
- Offer breathing exercise as immediate coping
- Log crisis event to database

---

### Level 4: Critical (Immediate Danger)
**Triggers:**
- 2+ crisis keywords
- Sentiment score: < -0.9 or label="crisis"
- Active suicidal ideation with plan
- Intent to harm self immediately

**Response:**
- **MAXIMUM INTERVENTION**
- Display crisis resources IMMEDIATELY
- Encourage calling helpline NOW
- If user mentions immediate action, emphasize urgency
- Stay calm and grounding

**Example:**
> "🚨 I'm very concerned about your safety right now. Please call one of these helplines immediately - they're available 24/7 and can help you through this moment:\n\n**AASRA: 91-9820466726**\n**Vandrevala Foundation: 1860-2662-345**\n\nIf you're in immediate danger, please call emergency services (112) or go to the nearest hospital. You deserve support and there are people who want to help you."

**UI Actions:**
- Display `CrisisOverlay` with severity="critical"
- Make helpline numbers clickable (tel: links)
- Flash visual urgency indicators
- Auto-scroll to crisis resources
- Disable regular chat temporarily (focus on crisis)
- Log with highest priority flag

---

## Contextual Crisis Detection

### Pattern-Based Escalation
If user has previous crisis history (from context):
- Lower threshold for crisis detection
- More proactive check-ins
- Reference past coping strategies that worked

**Example:**
> "I remember you mentioned feeling this way before. Last time, you found the breathing exercise helpful. Would you like to try that again?"

### Follow-Up Protocol
After crisis event (in subsequent messages):
- Check in warmly: "I'm glad you're still here with me"
- Ask about current safety: "How are you feeling right now?"
- Validate resilience: "It takes strength to reach out when you're struggling"
- Suggest next steps: "Have you been able to connect with any of the support resources?"

---

## De-Escalation Techniques

### 1. Grounding in the Present
- Use sensory grounding (5-4-3-2-1)
- Ask about immediate environment
- Focus on physical sensations

### 2. Breaking Down Overwhelm
- "Let's focus on the next 5 minutes, not the next 5 years"
- "What's one tiny thing that might help right now?"
- Offer extremely small, achievable actions

### 3. Creating Distance from Thoughts
- "I hear that your mind is telling you [thought]. Sometimes our minds say things that aren't true, especially when we're in pain."
- Gentle cognitive defusion techniques

### 4. Activating Support
- "Who in your life knows when you're struggling?"
- "Is there someone you could call or text right now?"
- Normalize asking for help

---

## What NOT to Do

❌ **Never:**
- Minimize their pain ("It's not that bad", "Others have it worse")
- Rush to problem-solve without validation
- Promise everything will be okay
- Provide step-by-step crisis intervention (that's for professionals)
- Panic or show alarm in language
- Ask "why" questions ("Why do you feel this way?" feels accusatory)

✅ **Always:**
- Lead with empathy and validation
- Acknowledge the courage it takes to share
- Remind them help is available
- Stay calm and grounding in tone
- Follow up in next conversation

---

## Technical Implementation

### Crisis Detection Function
```typescript
// From lib/crisis-detection.ts
detectCrisis(message, sentimentScore, sentimentLabel)
  ↓
Returns: {
  isCrisis: boolean,
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical',
  requiresIntervention: boolean,
  matchedPhrases: string[]
}
```

### Crisis Logging
All crisis events are logged to `CrisisLog` model with:
- Anonymized user ID (hashed)
- Timestamp
- Severity level
- Matched keywords
- Resources provided
- User actions (called helpline, did breathing exercise)

### Privacy Considerations
- Crisis logs use hashed user IDs only
- No message content is stored in crisis logs
- Only metadata for safety analysis
- Compliant with mental health privacy standards

---

## Resource List (India)

Always provide when crisis detected:

1. **AASRA** - 91-9820466726 (24/7 suicide prevention)
2. **Vandrevala Foundation** - 1860-2662-345 (24/7 mental health)
3. **iCall** - 022-25521111 (Mon-Sat, 8 AM - 10 PM)
4. **Sneha India** - 91-44-24640050 (24/7 emotional support)
5. **Sumaitri** - 011-23389090 (2 PM - 10 PM Delhi)
6. **Emergency** - 112 (for immediate danger)

---

## Training Considerations

The AI is trained to:
1. Prioritize safety over conversation flow
2. Err on the side of caution (false positives acceptable)
3. Never give clinical crisis intervention (that's for professionals)
4. Act as a bridge to human help, not replacement
5. Maintain warmth even in crisis (calm, caring tone)

---

*Last Updated: 2025-12-30*
*This protocol should be reviewed quarterly and updated based on user safety data.*
