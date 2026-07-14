# AI Workflow – HimBhasha AI

## Overview

This document describes how HimBhasha AI processes different types of user input and generates intelligent responses.

All workflows are routed through the **AI Orchestrator**, which selects the correct AI service for each task. Each service (Gnani AI, PaddleOCR, Mem0, Gemini) operates independently while sharing a common processing pipeline.

---

# Supported Inputs

The MVP supports four input types:

1. Text
2. Voice
3. Image
4. PDF Document

Each input follows a slightly different path before reaching the AI model.

---

# Workflow 1 — Text Chat

```
User Types Message
        │
        ▼
Input Validation
        │
        ▼
Language Detection
        │
        ▼
Mem0 (retrieve conversation context)
        │
        ▼
HIMCorpus Knowledge Layer (retrieve relevant context)
        │
        ▼
Prompt Construction
        │
        ▼
Gemini LLM
        │
        ▼
Mem0 (store updated context)
        │
        ▼
Generate Response
        │
        ▼
Translate (if required)
        │
        ▼
Display Response
```

---

# Workflow 2 — Voice

```
User Speaks
        │
        ▼
Gnani Speech-to-Text
        │
        ▼
Language Detection
        │
        ▼
Mem0 (retrieve conversation context)
        │
        ▼
HIMCorpus Knowledge Layer (retrieve relevant context)
        │
        ▼
Prompt Construction
        │
        ▼
Gemini LLM
        │
        ▼
Mem0 (store updated context)
        │
        ▼
Generate Response
        │
        ▼
Translate (if required)
        │
        ▼
Gnani Text-to-Speech
        │
        ▼
Play Audio Response
```

---

# Workflow 3 — Image Upload

```
User Uploads Image
        │
        ▼
Image Validation
        │
        ▼
OCR (PaddleOCR)
        │
        ▼
Extracted Text
        │
        ▼
Language Detection
        │
        ▼
HIMCorpus Knowledge Layer (retrieve relevant context)
        │
        ▼
Gemini LLM
        │
        ▼
Generate Explanation
        │
        ▼
Display Response
```

---

# Workflow 4 — PDF Upload

```
User Uploads PDF
        │
        ▼
Extract Text
        │
        ▼
OCR (if scanned)
        │
        ▼
Clean Text
        │
        ▼
HIMCorpus Knowledge Layer (retrieve relevant context)
        │
        ▼
Prompt Construction
        │
        ▼
Gemini LLM
        │
        ▼
Summary / Question Answering
        │
        ▼
Display Results
```

---

# Translation Workflow

```
Input Language
        │
        ▼
Language Detection
        │
        ▼
HIMCorpus Knowledge Layer (translation resources)
        │
        ▼
Translation Request
        │
        ▼
Gemini + Prompt Engineering
        │
        ▼
Target Language Output
```

Supported for MVP:

* Kangdi ⇄ Hindi
* Kangdi ⇄ English
* Hindi ⇄ English (optional)

---

# AI Services

## Speech-to-Text

Purpose:
Convert spoken language into text.

Provider:
Gnani AI

Input:
Audio

Output:
Plain text

---

## Text-to-Speech

Purpose:
Convert AI responses into spoken audio.

Provider:
Gnani AI Voice API

Input:
Text

Output:
Audio

---

## OCR

Purpose:
Extract text from images and scanned documents.

Provider:
PaddleOCR

Input:
Image / PDF

Output:
Machine-readable text

---

## Memory

Purpose:
Maintain conversational and learning context across interactions.

Provider:
Mem0

Stores:

* Conversation Memory
* User Preference Memory
* Learning Progress Memory

Mem0 is consulted before every Gemini request in conversational workflows and updated after each response.

---

## Language Detection

Purpose:
Identify whether the input is in Kangdi, Hindi, or English.

Output determines the processing path.

---

## Large Language Model

Purpose:

* Understand user intent
* Answer questions
* Explain documents
* Translate contextually
* Generate conversational responses

Provider:
Gemini API

---

# HIMCorpus Knowledge Layer

Before every LLM request, the AI Orchestrator retrieves relevant context from the HIMCorpus Knowledge Layer:

* Kangdi Dataset
* Translation Resources
* Cultural Knowledge
* Government Terminology
* Educational Resources
* Prompt Templates

This ensures responses are grounded in curated regional language data.

---

# Prompt Engineering Layer

Before every LLM request, the backend constructs a structured prompt containing:

* User message
* Detected language
* Requested task
* Mem0 conversation context (if applicable)
* HIMCorpus context (if available)
* Relevant document text (if uploaded)
* Translation instructions (if required)

This ensures consistent and task-specific responses.

---

# Error Handling

If speech recognition fails:

→ Ask the user to repeat.

If OCR confidence is low:

→ Inform the user and request a clearer image.

If translation confidence is uncertain:

→ Notify the user that the translation may require verification.

If the AI service is unavailable:

→ Display a graceful fallback message.

---

# Performance Goals

For the MVP:

* Text response: under 5 seconds
* Voice response: under 8 seconds
* OCR extraction: under 10 seconds
* PDF summary: under 15 seconds

Actual performance will depend on network conditions and model latency.

---

# Future Workflow Enhancements

Planned improvements include:

* Retrieval-Augmented Generation (RAG) over expanded HIMCorpus datasets
* Offline translation packs
* Speaker identification
* Multi-document search
* Fine-tuned Kangdi language models
* Community feedback loop for translation improvements

---

# Workflow Philosophy

The AI workflow is designed around orchestration rather than replacement.

Instead of building every AI capability from scratch, HimBhasha AI combines best-in-class speech recognition, OCR, translation, memory, and language models into a unified workflow tailored for the regional languages of Himachal Pradesh.
