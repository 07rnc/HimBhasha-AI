# Licensing – HIMCorpus

## Overview

This document defines the licensing structure and terms for the HIMCorpus dataset. As an open-source project designed for language preservation and AI research, HIMCorpus prioritizes open accessibility while ensuring the legal rights of native speakers and contributors are fully protected.

---

# 1. Primary License Model

All core text and metadata elements in HIMCorpus are licensed under the **Creative Commons Attribution 4.0 International (CC-BY-4.0)** license, except where explicitly annotated otherwise in the `license` column of a dataset entry.

### CC-BY-4.0 Key Terms:
* **Share** — You are free to copy and redistribute the material in any medium or format.
* **Adapt** — You are free to remix, transform, and build upon the material for any purpose, even commercially.
* **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

---

# 2. Alternative Licenses Supported

Certain datasets or subset contributions may employ alternative licenses to accommodate academic, commercial, or community constraints.

| License Tag | License Name | Description & Usage |
| ----------- | ------------ | ------------------- |
| `CC-BY-4.0` | CC Attribution 4.0 | Default license for text entries. Permits commercial use with attribution. |
| `CC-BY-SA-4.0` | CC Attribution-ShareAlike 4.0 | Requires any derivative datasets to be distributed under the same license. |
| `CC0-1.0` | CC0 1.0 Universal | Public domain dedication. No rights reserved. |
| `speaker_consent` | Speaker Consent Agreement | Custom restrictive license for specific raw audio files where the speaker has consented to research use but not commercial redistribution. |

---

# 3. Speaker Consent and Licensing Integration

Every dataset entry has a legal connection to a speaker consent record. 

```text
[Speaker Consent Form] ──► [Anonymised Metadata Log] ──► [CC-BY-4.0 Public CSV]
          │
          └── (If restricted) ──► [Restricted Media/ Folder]
```

### Consent Mapping Rules:
1. **Public Domain Text**: By signing or verbally agreeing to the HIMCorpus Consent Form, speakers agree that their transcribed text and English/Hindi translations can be released publicly under CC-BY-4.0.
2. **Audio File Restrictions**: Audio recordings (stored in `Dataset/Media/`) are subject to the individual speaker's selection:
   * **Full Release**: Released under CC-BY-4.0 (suitable for TTS/STT training).
   * **Research-Only**: Marked as `speaker_consent` in the CSV license field. These files are excluded from public mirrors and are made available only to academic researchers.
3. **Revocation**: If a speaker revokes consent, the corresponding row(s) and audio files are removed from the active repository within 30 days of written or verbal notification.

---

# 4. Open-Source Compliance & Downstream Reuse

When using HIMCorpus data in third-party projects, machine learning models, or commercial applications, you must comply with the following attribution guidelines:

### Citation Template
If you use this dataset in a publication, product, or research project, please cite it as follows:

```text
HIMCorpus Contributors (2026). HIMCorpus: A Curated Multi-Domain Dataset for Himachali Regional Languages. GitHub Repository: https://github.com/HIMCorpus/HimBhasha-AI
```

### AI Model Training Compliance
* Developers training LLMs, STT engines (like Whisper), or TTS engines are permitted to ingest CC-BY-4.0 rows.
* If a model is trained on data containing `speaker_consent` (restricted) rows, the resulting model weights must not be sold commercially unless separate agreements are reached with the HIMCorpus project steering committee.

---

# 5. Copyright and Contributor License Agreement (CLA)

By contributing data to HIMCorpus (either via pull request, bulk upload, or the "Preserve My Language" module), contributors agree to the following:
* You warrant that you have the right to contribute the data (i.e., you collected it with proper consent, or it is in the public domain).
* You license your contribution under the CC-BY-4.0 license.
* The HIMCorpus project does not claim exclusive ownership of your contributions; you retain the right to license your own work under other terms.
