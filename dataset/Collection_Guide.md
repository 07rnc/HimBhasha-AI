# Collection Guide – HIMCorpus

## Overview

This guide explains how to collect, record, and submit linguistic data for the HIMCorpus dataset. It is intended for field researchers, community contributors, linguists, and hackathon team members.

---

# Collection Principles

| Principle | Detail |
| --------- | ------ |
| Speaker-centered | The native speaker is the authority on their language |
| Consent-first | No data collected without informed consent |
| Quality over quantity | 10 verified entries are better than 100 unverified ones |
| Context-rich | Record domain, intent, and cultural context for every entry |
| Audio-accompanied | Text entries should have audio recordings whenever possible |
| Dialect-aware | Note dialect variations without dismissing any form |

---

# Interview Methods

## Structured Interview

Best for: Greetings, Family, Numbers, Verbs

1. Prepare a list of prompts in Hindi or English
2. Ask the speaker to provide the Kangdi equivalent
3. Record the session (audio + video if consented)
4. Ask the speaker to repeat each phrase clearly for audio capture
5. Note any hesitations or dialect variants

## Free Conversation Recording

Best for: Daily_Conversation, Culture, Tourism

1. Engage the speaker in natural conversation about a topic
2. Record the full conversation
3. Transcribe relevant phrases afterward
4. Tag each extracted phrase with domain and intent

## Document Extraction

Best for: Government, Education, Healthcare

1. Collect official documents, textbooks, or signage in Kangdi
2. Photograph or scan the document
3. Extract phrases using OCR (PaddleOCR) or manual transcription
4. Verify extracted text with a native speaker

## Community Contribution

Best for: All domains (via Preserve module)

1. User submits phrase via the HimBhasha AI Preserve module
2. Submission includes Kangdi text, Hindi/English translation, domain
3. Optional audio recording attached
4. Team reviews and validates before adding to dataset

---

# Consent

## Requirements

Every speaker must provide informed consent before their data is included in HIMCorpus.

## Consent Process

1. Explain the project purpose (language preservation, AI development)
2. Explain how their data will be used (open-source dataset, AI training)
3. Explain their rights (can withdraw data at any time)
4. Record verbal consent on audio (for audio contributions)
5. Document consent in the entry metadata

## Consent Form Fields

| Field | Detail |
| ----- | ------ |
| Speaker name | Full name (stored in Metadata/, not in public CSV) |
| Consent date | Date consent was given |
| Consent type | `verbal`, `written`, `digital` |
| Data scope | `text`, `audio`, `both` |
| Withdrawal right | Confirmed speaker understands they can withdraw |

## Minors

- Data from speakers under 18 requires parental/guardian consent
- Age recorded in `speaker_age` field

---

# Recording

## Audio Recording Guidelines

| Parameter | Recommendation |
| --------- | -------------- |
| Format | WAV or FLAC (lossless) |
| Sample rate | 44.1 kHz minimum |
| Channels | Mono (single speaker) |
| Environment | Quiet room, minimal background noise |
| Distance | 15–30 cm from microphone |
| Duration | One phrase per recording (2–10 seconds) |
| Naming | `{id}.wav` (e.g., `kng_greet_001.wav`) |
| Storage | `Dataset/Media/Kangdi/{domain}/` |

## Recording Equipment

| Option | Suitability |
| ------ | ----------- |
| Smartphone voice recorder | Acceptable for field collection |
| External lapel microphone | Preferred for interviews |
| Laptop built-in mic | Acceptable for quiet indoor settings |
| Professional recorder | Ideal but not required |

## Recording Quality Checklist

- [ ] No background music or television
- [ ] Speaker speaks at natural pace (not rushed)
- [ ] One phrase per file
- [ ] 0.5 second silence before and after phrase
- [ ] Speaker informed they are being recorded
- [ ] Audio is audible and clear on playback

---

# Metadata

Record the following for every entry:

| Field | How to Collect |
| ----- | -------------- |
| `speaker_age` | Ask or estimate respectfully |
| `speaker_gender` | Ask or observe (use `other` if declined) |
| `district` | Ask which district they are from |
| `village` | Ask village or town name |
| `source` | Set based on collection method |
| `notes` | Record dialect variants, context, or caveats |

Speaker personal information (full name, phone number) is stored in `Dataset/Metadata/` and is **not** included in public CSV files.

---

# Transcription

## Text Transcription Rules

| Rule | Detail |
| ---- | ------ |
| Script | Devanagari for Kangdi and Hindi |
| Spelling | Use the speaker's preferred spelling |
| Dialect | Transcribe as spoken, note variants in `notes` |
| Punctuation | Minimal — commas and periods only |
| Numbers | Write out in words (not digits) in text fields |

## Pronunciation Guide

| Rule | Detail |
| ---- | ------ |
| System | Simplified romanization (not strict IPA) |
| Case | Lowercase |
| Syllables | Hyphen-separated (e.g., `nuh-muh-steh`) |
| Stress | Capitalize stressed syllable if needed (e.g., `nuh-MUH-steh`) |
| Source | Based on speaker's actual pronunciation, not textbook |

---

# Translation

## Translation Process

1. Speaker provides Kangdi phrase
2. Translator provides Hindi equivalent
3. Translator provides English equivalent
4. All three versions reviewed together with the speaker
5. Speaker confirms translations are accurate

## Translation Rules

| Rule | Detail |
| ---- | ------ |
| Hindi | Natural Hindi, not literal word-for-word |
| English | Clear, simple English |
| Equivalence | Translations should convey the same meaning, not literal words |
| Cultural terms | Keep culturally specific terms with explanation in `notes` |
| Multiple translations | If multiple valid translations exist, create separate entries |

---

# Verification

Every entry must be verified before inclusion in the production dataset.

See `Validation_Guide.md` for the full verification process.

Minimum verification steps:

1. Native speaker confirms Kangdi text is correct
2. Translator confirms Hindi and English translations
3. Audio matches text (if audio available)
4. Domain and intent labels are appropriate
5. Entry passes schema validation

---

# Submission Workflow

```text
Collect phrase (interview / conversation / document)
      │
      ▼
Record audio (if possible)
      │
      ▼
Transcribe in Devanagari
      │
      ▼
Translate to Hindi and English
      │
      ▼
Create pronunciation guide
      │
      ▼
Tag domain and intent
      │
      ▼
Record metadata (age, gender, district, village)
      │
      ▼
Obtain speaker consent
      │
      ▼
Add to domain sample.csv
      │
      ▼
Validate (see Validation_Guide.md)
      │
      ▼
Mark verified = true
      │
      ▼
Store audio in Media/ (if available)
```

---

# Collection Targets (MVP)

| Domain | Target Entries | Priority |
| ------ | -------------- | -------- |
| Greetings | 20 | High |
| Daily_Conversation | 30 | High |
| Family | 20 | High |
| Food | 20 | High |
| Numbers | 15 | High |
| Questions | 15 | High |
| Verbs | 25 | Medium |
| Weather | 15 | Medium |
| Education | 20 | Medium |
| Healthcare | 20 | Medium |
| Agriculture | 20 | Medium |
| Government | 15 | Medium |
| Tourism | 15 | Medium |
| Culture | 20 | Medium |
| Emergency | 15 | High |

**MVP total target: 285 verified Kangdi entries**
