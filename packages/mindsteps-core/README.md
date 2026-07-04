# MindSteps Core

MindSteps Core is the first reusable learning intelligence package of the MindSteps platform.

## Purpose

The Core separates pedagogy from the user interface and from the AI provider.

The AI model generates language, but the Core decides the learning strategy.

## Current Modules

- Cognitive Twin
- Learning Memory
- Learning Events
- Pedagogical Engine
- Learning Intelligence Orchestrator
- Recommendation Engine

## Core Flow

```text
Learner message
  -> Learning Context
  -> Pedagogical Engine
  -> Learning Response Plan
  -> Learning Events
  -> Cognitive Twin update
  -> Learning Memory update
  -> AI Context
```

## Principle

MindSteps should not be a chatbot that gives answers.

It should be a learning companion that helps the learner think, reflect, understand and become more autonomous.

## Status

Version 0.1.0 — early internal core.
