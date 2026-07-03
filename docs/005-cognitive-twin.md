# Cognitive Twin Specification

Version 1.0 Draft

## Purpose

The Cognitive Twin is the living learning model of each learner.

It is not a static profile. It is an evolving representation of how the learner understands, struggles, persists, gets motivated and progresses.

## Why It Matters

Most education platforms store identity data and performance data.

MindSteps must store learning intelligence:

- how the learner learns;
- what strategies work;
- what misconceptions recur;
- what motivates the learner;
- where confidence is high or low;
- which concepts are mastered, fragile or blocked.

## Core Layers

### Identity Layer
Stable information required to personalize safely.

Examples:
- name or preferred name;
- age group;
- school year;
- language;
- family link;
- institution link;
- accessibility needs.

### Learning Genome Layer
Relatively stable learning traits.

Examples:
- preferred examples;
- communication style;
- motivation triggers;
- recurring barriers;
- attention profile;
- autonomy level;
- interests.

### Knowledge Layer
Represents concept mastery.

Examples:
- mastered concepts;
- fragile concepts;
- blocked concepts;
- prerequisites not yet consolidated;
- BNCC skills when applicable.

### Misconception Layer
Stores recurring patterns of misunderstanding.

Examples:
- confuses numerator and denominator;
- skips negative words in text interpretation;
- calculates correctly but misreads the problem;
- memorizes procedure without understanding concept.

### Confidence Layer
Tracks whether the learner believes they can perform a task.

A learner may understand a topic but still lack confidence.

### Motivation Layer
Tracks what increases engagement with meaning.

Examples:
- Minecraft examples;
- dinosaurs;
- football;
- storytelling;
- building things;
- helping others.

### Emotional Safety Layer
Tracks signals related to frustration, shame, fatigue or anxiety.

This layer must never be used as a clinical diagnosis.

### Strategy Layer
Stores which pedagogical strategies work best.

Examples:
- Socratic question;
- analogy;
- drawing;
- concrete example;
- short challenge;
- offline activity;
- worked example.

### Recommendation Layer
Stores next best actions for the learner, family or teacher.

## Input Events

The Cognitive Twin is updated by Learning Events such as:

- QuestionAsked;
- HintRequested;
- HintAccepted;
- ConceptUnderstood;
- MisconceptionDetected;
- ConfidenceImproved;
- FrustrationDetected;
- ReflectionCompleted;
- OfflineActivityCompleted;
- TeacherIntervention;
- FamilyParticipation.

## Output Uses

The Cognitive Twin powers:

- tutor personalization;
- adaptive journey;
- learning memory retrieval;
- family companion;
- teacher copilot;
- school intelligence;
- government-level aggregated insights.

## Safety Rules

1. The Cognitive Twin is pedagogical, not clinical.
2. It must never label a child permanently.
3. Every inferred trait must be revisable.
4. Parents and institutions must have appropriate transparency.
5. Sensitive data must be minimized.
6. Child safety overrides personalization.

## MVP Fields

Initial implementation may include:

- learnerId;
- ageGroup;
- interests;
- preferredExamples;
- learningStyle;
- masteredConcepts;
- fragileConcepts;
- misconceptions;
- confidenceLevel;
- frustrationSignals;
- successfulStrategies;
- nextRecommendedStep.

## Long-term Vision

The Cognitive Twin should become the central source of learning intelligence in the MindSteps platform.

All product experiences should eventually use it instead of relying only on chat history or isolated metrics.
