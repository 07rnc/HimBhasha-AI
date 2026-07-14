# Dataset Roadmap – HIMCorpus

## Overview

This roadmap defines the expansion plan for the HIMCorpus dataset and its integration with HimBhasha AI. The project is structured in phases to ensure linguistic depth and technical accuracy before scaling to multiple languages.

---

# 1. Expansion Timeline

HIMCorpus expands sequentially across the administrative regions and dialects of Himachal Pradesh.

```text
Phase 1: Kangdi (MVP) ──► Phase 2: Mandeali & Kulluvi ──► Phase 3: Chambeali & Sirmauri ──► Phase 4: Kinnauri & Bhoti
```

| Phase | Language | Region/Districts | Launch Target | Est. Target Size (Phrases) |
| ----- | -------- | ---------------- | ------------- | --------------------------- |
| **Phase 1 (MVP)** | **Kangdi** | Kangra, Una, Hamirpur | Current | 1,000 text / 500 audio |
| **Phase 2** | **Mandeali** | Mandi | Q3 2026 | 1,000 text / 500 audio |
| | **Kulluvi** | Kullu | Q4 2026 | 1,000 text / 500 audio |
| **Phase 3** | **Chambeali** | Chamba | Q1 2027 | 1,000 text / 500 audio |
| | **Sirmauri** | Sirmaur | Q2 2027 | 1,000 text / 500 audio |
| **Phase 4** | **Kinnauri** | Kinnaur | Q3 2027 | 500 text / 250 audio |
| | **Bhoti** | Lahaul and Spiti | Q4 2027 | 500 text / 250 audio |

---

# 2. Crowdsourcing Strategy (via HimBhasha AI)

To scale collection without massive funding, we utilize a built-in crowdsourcing workflow inside the **Preserve My Language** module:

### The Crowdsourcing Lifecycle:
1. **Submit**: Community members submit text translations and record audio directly through their mobile web browsers using the Web Speech API.
2. **Review Queue**: Submissions are loaded into a moderation panel as `verified = false`.
3. **Gamification**: Users earn "Points" and virtual "Himachali Badges" (e.g., *Kangra Linguistic Pioneer*) for contributing and reviewing.
4. **Peer Review**: Native speakers vote on contributions (agree/disagree). An entry with 3 net positive votes is forwarded to the linguistic leads for final verification (`verified = true`).

---

# 3. Academic & Institutional Collaborations

We build partnerships with regional academic bodies to validate and clean the dataset:

* **Himachal Pradesh University (HPU), Shimla**: Collaboration with the Department of Sanskrit & Linguistics for orthographic standardisation.
* **IIT Mandi**: Partnering with their AI and Speech processing labs to validate acoustic models trained on HIMCorpus audio.
* **Local Language & Culture NGOs**: Working with local societies in Kangra, Mandi, and Chamba to access pre-existing physical lexicons and convert them into structured digital formats.

---

# 4. Government Digitisation Support

A major objective of HIMCorpus is to enable digital government service access:

* **Local Scheme Translation**: Translating templates for agriculture benefits (e.g., PM-KISAN guidelines) and administrative forms (e.g., Bonafide certificates) into local dialects.
* **Panchayat AI Assistant**: Using the government domain dataset to fine-tune a Gemini-powered API that answers local administrative questions in Kangdi and Mandeali.
* **Digital Tourism Heritage**: Documenting local temple folklore, historical monuments, and traditional recipes to provide an interactive audio guide for visitors in Himachali languages.
