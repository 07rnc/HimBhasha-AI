# Ethics – HIMCorpus

## Overview

The preservation of regional and indigenous languages using AI is a delicate task. Regional languages are not just text and audio tokens; they are repositories of local culture, history, and identity. 

This **Ethics Policy** outlines the standards that all collectors, annotators, developers, and researchers must follow to prevent exploitation, protect speaker privacy, and maintain respect for the communities of Himachal Pradesh.

---

# 1. Informed Consent Protocol

Data collection must never be transactional or coercive. We follow a strict **Informed Consent Protocol**:

### Key Principles:
* **Linguistic Accessibility**: The consent terms must be explained in a language the speaker fully understands (usually Kangdi, Mandeali, or Hindi).
* **Scope Clarity**: Speakers must be informed that their voice and words will be used to train AI models (like HimBhasha AI) and will be made available on the internet.
* **Withdrawal Rights**: Speakers retain the right to withdraw their data from the corpus at any time without needing to provide a justification.
* **Verbal Alternative**: For speakers who are pre-literate or unable to sign a written form, a standardized verbal consent script must be recorded at the beginning of their audio session.

---

# 2. Privacy & Metadata De-Identification

To protect native speakers from identity theft, harassment, or unwanted exposure, we implement strict data segregation:

```text
Field Notes (Full Name, Contact, Detailed Location)
                      │
                      ▼ (De-identification Process)
Public Dataset (Age, Gender, District, Village)
```

* **No Personal Identifiable Information (PII)**: Full names, phone numbers, addresses, and family names must never be included in public CSV files.
* **Aggregated Metadata**: Age is recorded in years, gender is restricted to general categories (`male`/`female`/`other`), and geographic location is limited to District and Village/Town levels.
* **Secure Storage**: Master records linking speaker IDs (`speaker_id`) to actual speaker identities are stored in encrypted directories under `Dataset/Metadata/` accessible only to the project core maintainers.

---

# 3. Audio Ownership and Digital Rights

* **Shared Heritage**: The HIMCorpus project treats regional language data as the shared heritage of the native speakers and the community. We do not claim exclusive copyright over the recordings.
* **Protection against Exploitation**: Restrictive licensing (`speaker_consent`) is applied to sensitive audio files to prevent third parties from selling regional voices or using them for voice cloning without explicit authorization.
* **Non-Commercial Safeguards**: Any commercial application built using HIMCorpus is encouraged to offer free access tiers for residents of Himachal Pradesh.

---

# 4. Culturally Sensitive Data Collection

Collecting language data requires deep cultural awareness. Maintainers and collectors must adhere to the following:

* **Taboos and Respect**: Do not ask speakers to record phrases that are culturally offensive, superstitious, or politically sensitive in their local community.
* **Dialectal Inclusivity**: All dialectal variations (e.g., Palampuri Kangri vs. Hamirpuri Kangri) are treated with equal academic respect. No dialect is annotated as "incorrect" or "inferior".
* **Elderly Care**: Many native speakers are elderly residents. Collection sessions must be conducted at a relaxed pace, respecting the speaker's physical comfort, health, and schedule.
* **Accurate Attribution**: When traditional stories, folk songs, or cultural riddles are recorded, the speaker and their community must be credited as the source of that cultural knowledge.
