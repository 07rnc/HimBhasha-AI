# HIMCorpus Schema

## Overview

This document defines the standard schema for all HIMCorpus dataset entries. Every CSV file across all languages and domains must follow this schema.

---

# Column Definitions

| Column | Type | Required | Description |
| ------ | ---- | -------- | ----------- |
| `id` | string | Yes | Unique identifier. Format: `{lang}_{domain}_{seq}` (e.g., `kng_greet_001`) |
| `domain` | string | Yes | Domain category (e.g., `greetings`, `healthcare`) |
| `intent` | string | Yes | Intent label within the domain (e.g., `greet`, `symptom`) |
| `english` | string | Yes | English translation of the phrase |
| `hindi` | string | Yes | Hindi translation of the phrase |
| `kangdi` | string | Yes | Kangdi (Kangri) phrase in Devanagari script |
| `pronunciation` | string | Yes | Romanized pronunciation guide (IPA-inspired) |
| `speaker_age` | integer | No | Age of the speaker who provided the phrase |
| `speaker_gender` | string | No | Gender of the speaker: `male`, `female`, `other` |
| `district` | string | No | Himachal Pradesh district of the speaker |
| `village` | string | No | Village or town of the speaker |
| `audio_available` | boolean | No | Whether an audio recording exists: `true` / `false` |
| `verified` | boolean | Yes | Whether a native speaker has verified the entry: `true` / `false` |
| `source` | string | Yes | Origin of the data (see Source Values below) |
| `license` | string | Yes | License under which the entry is published |
| `notes` | string | No | Additional context, dialect notes, or caveats |

---

# ID Format

```text
{language_code}_{domain_code}_{sequence}

Language codes:
  kng = Kangdi
  mnd = Mandeali
  klv = Kulluvi
  chb = Chambeali
  srm = Sirmauri
  knr = Kinnauri
  bht = Bhoti

Domain codes:
  greet    = Greetings
  daily    = Daily_Conversation
  edu      = Education
  health   = Healthcare
  agri     = Agriculture
  govt     = Government
  tour     = Tourism
  cult     = Culture
  emerg    = Emergency
  num      = Numbers
  verb     = Verbs
  ques     = Questions
  fam      = Family
  food     = Food
  wthr     = Weather

Example: kng_greet_001
```

---

# Domain Values

| Value | Folder |
| ----- | ------ |
| `greetings` | Greetings/ |
| `daily_conversation` | Daily_Conversation/ |
| `education` | Education/ |
| `healthcare` | Healthcare/ |
| `agriculture` | Agriculture/ |
| `government` | Government/ |
| `tourism` | Tourism/ |
| `culture` | Culture/ |
| `emergency` | Emergency/ |
| `numbers` | Numbers/ |
| `verbs` | Verbs/ |
| `questions` | Questions/ |
| `family` | Family/ |
| `food` | Food/ |
| `weather` | Weather/ |

---

# Intent Labels

Intents describe the communicative purpose within a domain.

| Domain | Valid Intents |
| ------ | ------------- |
| greetings | `greet`, `farewell`, `welcome`, `thanks`, `blessing` |
| daily_conversation | `small_talk`, `request`, `agreement`, `disagreement`, `apology` |
| education | `classroom`, `subject`, `instruction`, `question`, `praise` |
| healthcare | `symptom`, `treatment`, `appointment`, `medicine`, `body_part` |
| agriculture | `crop`, `harvest`, `irrigation`, `livestock`, `tool` |
| government | `document`, `scheme`, `office`, `official`, `application` |
| tourism | `direction`, `accommodation`, `attraction`, `transport`, `food_recommendation` |
| culture | `festival`, `ritual`, `folklore`, `tradition`, `costume` |
| emergency | `help`, `fire`, `accident`, `medical_emergency`, `police` |
| numbers | `cardinal`, `ordinal`, `measurement`, `quantity`, `time` |
| verbs | `movement`, `communication`, `daily_action`, `eating`, `working` |
| questions | `what`, `where`, `when`, `how`, `why`, `who` |
| family | `relation`, `address`, `kinship`, `marriage`, `age_group` |
| food | `dish`, `ingredient`, `taste`, `cooking`, `meal` |
| weather | `condition`, `season`, `forecast`, `temperature`, `natural_event` |

---

# Source Values

| Value | Description |
| ----- | ----------- |
| `native_speaker` | Recorded directly from a native speaker |
| `community_contribution` | Submitted via Preserve module or community form |
| `literature` | Extracted from published Kangdi/Himachali literature |
| `government_document` | From official government publications |
| `academic_research` | From university or research institution |
| `hackathon_seed` | Initial seed data created for hackathon MVP |

---

# License Values

| Value | Description |
| ----- | ----------- |
| `CC-BY-4.0` | Creative Commons Attribution 4.0 (default) |
| `CC-BY-SA-4.0` | Creative Commons Attribution-ShareAlike 4.0 |
| `CC0-1.0` | Public domain dedication |
| `speaker_consent` | Licensed under individual speaker consent agreement |

Default license for all HIMCorpus data: **CC-BY-4.0**

---

# CSV Format Rules

| Rule | Detail |
| ---- | ------ |
| Encoding | UTF-8 |
| Delimiter | Comma (`,`) |
| Quote character | Double quote (`"`) |
| Header row | Required (column names as defined above) |
| Line endings | LF (`\n`) |
| Devanagari | All Kangdi and Hindi text in Devanagari script |
| Empty fields | Leave empty (no `NULL` or `N/A` strings) |
| Boolean values | `true` or `false` (lowercase) |

---

# Example Row

```csv
id,domain,intent,english,hindi,kangdi,pronunciation,speaker_age,speaker_gender,district,village,audio_available,verified,source,license,notes
kng_greet_001,greetings,greet,Hello,नमस्ते,नमस्ते,nuh-muh-steh,65,male,Kangra,Dharamshala,true,true,native_speaker,CC-BY-4.0,Common greeting across Kangra valley
```

---

# Validation Rules

| Column | Validation |
| ------ | ---------- |
| `id` | Unique across entire dataset; matches format pattern |
| `domain` | Must be a valid domain value |
| `intent` | Must be a valid intent for the given domain |
| `english` | Non-empty; max 500 characters |
| `hindi` | Non-empty; Devanagari script |
| `kangdi` | Non-empty; Devanagari script |
| `pronunciation` | Non-empty; lowercase romanized |
| `speaker_age` | Integer 1–120 if provided |
| `speaker_gender` | `male`, `female`, or `other` if provided |
| `verified` | Must be `true` for production use |
| `source` | Must be a valid source value |
| `license` | Must be a valid license value |

See `Validation_Guide.md` for the full validation process.

---

# Future Schema Extensions

| Column | Purpose | Status |
| ------ | ------- | ------ |
| `audio_file` | Path to audio file in Media/ | Planned |
| `dialect` | Sub-dialect identifier | Planned |
| `formality` | Formal/informal register | Planned |
| `created_at` | Entry creation timestamp | Planned |
| `updated_at` | Last modification timestamp | Planned |
| `contributor_id` | Contributor reference | Planned |
| `confidence_score` | Translation confidence (0.0–1.0) | Planned |
