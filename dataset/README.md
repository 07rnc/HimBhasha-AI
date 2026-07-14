# HIMCorpus Dataset

## Overview

**HIMCorpus** is the curated linguistic dataset powering HimBhasha AI. It contains structured text and audio data for the regional languages of Himachal Pradesh, organized by language, domain, and intent.

HIMCorpus serves three purposes:

1. **AI Context** — Provides the HIMCorpus Knowledge Layer with translation resources, cultural knowledge, and prompt templates for the AI Orchestrator
2. **Language Learning** — Supplies phrase data for the Learn module
3. **Preservation** — Documents endangered regional languages for future research and technology development

---

# Dataset Structure

```text
Dataset/
│
├── README.md                    (this file)
├── Schema.md
├── Collection_Guide.md
├── Validation_Guide.md
├── Annotation_Guide.md
├── Licensing.md
├── Ethics.md
├── Roadmap.md
│
├── Kangdi/                      (MVP — active collection)
│   ├── Greetings/
│   ├── Daily_Conversation/
│   ├── Education/
│   ├── Healthcare/
│   ├── Agriculture/
│   ├── Government/
│   ├── Tourism/
│   ├── Culture/
│   ├── Emergency/
│   ├── Numbers/
│   ├── Verbs/
│   ├── Questions/
│   ├── Family/
│   ├── Food/
│   └── Weather/
│
├── Mandeali/                    (Future)
├── Kulluvi/                     (Future)
├── Chambeali/                   (Future)
├── Sirmauri/                    (Future)
├── Kinnauri/                    (Future)
├── Bhoti/                       (Future)
│
├── Metadata/
└── Media/
```

---

# Languages

| Language | Status | ISO Code (proposed) | Primary Districts |
| -------- | ------ | ------------------- | ----------------- |
| Kangdi (Kangri) | **MVP — Active** | — | Kangra, Una, Hamirpur |
| Mandeali | Planned | — | Mandi, Kullu (southern) |
| Kulluvi | Planned | — | Kullu, Manali |
| Chambeali | Planned | — | Chamba |
| Sirmauri | Planned | — | Sirmaur |
| Kinnauri | Planned | — | Kinnaur |
| Bhoti | Planned | — | Lahaul-Spiti |

---

# Domains

Each language folder contains domain subfolders. Domains represent real-world usage contexts:

| Domain | Description | Example Intents |
| ------ | ----------- | --------------- |
| Greetings | Salutations and farewells | greet, farewell, welcome |
| Daily_Conversation | Everyday expressions | small_talk, request, agreement |
| Education | School and learning terms | classroom, subject, instruction |
| Healthcare | Health and medical vocabulary | symptom, treatment, appointment |
| Agriculture | Farming and livestock terms | crop, harvest, irrigation |
| Government | Official and administrative terms | document, scheme, office |
| Tourism | Travel and hospitality phrases | direction, accommodation, attraction |
| Culture | Traditions, festivals, customs | festival, ritual, folklore |
| Emergency | Urgent and safety phrases | help, fire, accident |
| Numbers | Counting and quantities | cardinal, ordinal, measurement |
| Verbs | Common action words | movement, communication, daily_action |
| Questions | Question forms and patterns | what, where, when, how |
| Family | Family relationships and terms | relation, address, kinship |
| Food | Food, cooking, and dining terms | dish, ingredient, taste |
| Weather | Weather and seasonal expressions | condition, season, forecast |

---

# Data Format

All domain data is stored in **CSV files** following the schema defined in `Schema.md`.

Each domain folder contains:

| File | Purpose |
| ---- | ------- |
| `README.md` | Domain description, collection status, contributor notes |
| `schema.md` | Column definitions specific to the domain |
| `sample.csv` | Sample entries demonstrating the schema |

---

# Current Status

| Language | Domains | Entries | Audio | Verified |
| -------- | ------- | ------- | ----- | -------- |
| Kangdi | 15 | 90 (sample) | Partial | Partial |
| Mandeali | 0 | 0 | — | — |
| Kulluvi | 0 | 0 | — | — |
| Chambeali | 0 | 0 | — | — |
| Sirmauri | 0 | 0 | — | — |
| Kinnauri | 0 | 0 | — | — |
| Bhoti | 0 | 0 | — | — |

*Sample entries are provided for hackathon demonstration. Full collection is ongoing.*

---

# Usage in HimBhasha AI

```text
HIMCorpus CSV Data
      │
      ├──► HIMCorpus Knowledge Layer (AI Orchestrator context)
      ├──► Learn Module (phrase browsing by category)
      ├──► Translate Module (translation reference)
      └──► Preserve Module (contribution target)
```

---

# Contributing

See `Collection_Guide.md` for how to contribute data.

See `Ethics.md` for consent and privacy requirements.

See `Licensing.md` for usage terms.

All contributions must follow the schema in `Schema.md` and pass validation per `Validation_Guide.md`.

---

# Contact

For dataset inquiries, contributions, or collaboration:

* Project: HimBhasha AI / HIMCorpus
* Repository: GitHub (open source)
