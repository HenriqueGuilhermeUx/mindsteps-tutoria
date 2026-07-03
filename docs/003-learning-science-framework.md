# MindSteps Learning Science Framework

Version 1.0 (Draft)

## Purpose

This document defines the evidence-informed learning principles that should guide MindSteps product, AI and architecture decisions.

## Core Premise

MindSteps should not be driven by prompts alone. The platform must use learning science to choose pedagogical strategies, and then use AI to communicate those strategies in a personalized way.

## Framework Components

### 1. Active Recall
Learners strengthen understanding when they retrieve knowledge instead of passively rereading explanations.

Product implications:
- ask before explaining;
- invite the learner to predict;
- use short recall moments during sessions;
- encourage the learner to explain in their own words.

### 2. Spaced Practice
Learning improves when important concepts return over time.

Product implications:
- schedule review moments;
- detect fragile concepts;
- reintroduce concepts before they are forgotten;
- make review feel like a new challenge, not repetition.

### 3. Interleaving
Mixing related concepts can improve transfer and flexible thinking.

Product implications:
- avoid overly linear practice;
- combine old and new skills;
- ask learners to choose strategies;
- connect concepts across subjects.

### 4. Cognitive Load
Working memory is limited. Explanations should reduce unnecessary complexity.

Product implications:
- one concept at a time;
- short steps;
- concrete examples before abstractions;
- age-appropriate language;
- visual or practical analogies when useful.

### 5. Zone of Proximal Development
The best activity is neither too easy nor too hard.

Product implications:
- adapt difficulty continuously;
- increase challenge after success;
- provide scaffolding after struggle;
- reduce complexity when frustration rises.

### 6. Scaffolding
Support should be temporary and gradually removed.

Product implications:
- give hints before answers;
- reduce hints over time;
- track independence;
- celebrate autonomous reasoning.

### 7. Metacognition
Learners improve when they understand how they learn.

Product implications:
- ask reflection questions;
- show learning strategies;
- help the learner notice what worked;
- teach how to study, not only what to study.

### 8. Motivation and Meaning
Learning becomes stronger when it connects to identity, interest and purpose.

Product implications:
- use learner interests;
- connect school concepts to real life;
- prefer meaningful missions over empty rewards;
- allow institutional configuration of gamification.

### 9. Feedback
Feedback should be timely, specific and constructive.

Product implications:
- explain the next step;
- avoid shame;
- identify the reasoning path;
- reinforce effort, strategy and progress.

### 10. Emotional Safety
Fear and shame reduce learning. Confidence supports exploration.

Product implications:
- detect frustration;
- normalize mistakes;
- adjust tone;
- avoid ranking as default for children;
- make competitive elements optional.

## Implementation Rule

Each major AI interaction should pass through:

1. learner context;
2. learning memory;
3. pedagogical objective;
4. strategy selection;
5. AI generation;
6. safety review;
7. learning memory update.

## Product Standard

MindSteps should be able to explain why it recommended an activity, hint, analogy or review moment.
