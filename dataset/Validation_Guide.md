# Validation Guide – HIMCorpus

## Overview

This guide defines the quality assurance process for HIMCorpus dataset entries. No entry should be marked `verified = true` without completing all validation steps.

---

# Validation Pipeline

```text
New Entry
    │
    ▼
Schema Validation (automated)
    │
    ▼
Native Speaker Review (manual)
    │
    ▼
Translation Accuracy Check (manual)
    │
    ▼
Audio-Text Alignment (if audio available)
    │
    ▼
Confidence Score Assignment
    │
    ▼
Double Verification (second reviewer)
    │
    ▼
Mark verified = true
```

---

# Step 1 — Schema Validation

Automated checks applied to every CSV row.

| Check | Rule | Fail Action |
| ----- | ---- | ----------- |
| ID format | Matches `{lang}_{domain}_{seq}` pattern | Reject |
| ID uniqueness | No duplicate IDs in dataset | Reject |
| Required fields | `id`, `domain`, `intent`, `english`, `hindi`, `kangdi`, `pronunciation`, `verified`, `source`, `license` must be non-empty | Reject |
| Domain value | Must be a valid domain from Schema.md | Reject |
| Intent value | Must be valid for the given domain | Reject |
| Boolean fields | `audio_available` and `verified` must be `true` or `false` | Reject |
| Source value | Must be a valid source from Schema.md | Reject |
| License value | Must be a valid license from Schema.md | Reject |
| Text length | `english`, `hindi`, `kangdi` max 500 characters | Reject |
| Encoding | File must be valid UTF-8 | Reject |

---

# Step 2 — Native Speaker Review

Every Kangdi text entry must be reviewed by at least one native Kangdi speaker.

## Review Criteria

| Criterion | Pass | Fail |
| --------- | ---- | ---- |
| Spelling | Kangdi text matches how a native speaker would write it | Unusual spelling with no dialect justification |
| Naturalness | Phrase is something a native speaker would actually say | Calque from Hindi/English, unnatural construction |
| Dialect | Dialect noted in `notes` if non-standard | Dialect unnoted and potentially confusing |
| Completeness | Phrase is a complete utterance | Fragment without context |
| Offensiveness | No offensive or inappropriate content | Contains slurs, insults, or inappropriate terms |

## Reviewer Requirements

| Requirement | Detail |
| ----------- | ------ |
| Language | Must be a native Kangdi speaker |
| Age | Preferably 40+ for traditional vocabulary |
| Region | Should be from the district noted in the entry |
| Independence | Reviewer must not be the original collector |

---

# Step 3 — Translation Accuracy

Both Hindi and English translations are checked for accuracy.

## Translation Checks

| Check | Method |
| ----- | ------ |
| Meaning equivalence | Reviewer reads all three versions and confirms same meaning |
| Natural Hindi | Hindi translation sounds natural, not word-for-word |
| Clear English | English translation is simple and unambiguous |
| Cultural preservation | Culturally specific terms preserved with explanation in `notes` |
| No hallucination | Translations do not add information not present in the Kangdi original |

## Common Translation Errors

| Error | Example | Fix |
| ----- | ------- | --- |
| Literal translation | Word-by-word Hindi that sounds unnatural | Rewrite in natural Hindi |
| Missing nuance | Kangdi idiom translated as plain statement | Add idiom explanation in `notes` |
| Wrong register | Formal Hindi for informal Kangdi phrase | Match the register |
| Added content | English translation adds details not in original | Remove extra content |

---

# Step 4 — Audio-Text Alignment

For entries with `audio_available = true`:

| Check | Method |
| ----- | ------ |
| Audio exists | File present in `Dataset/Media/` at expected path |
| Audio matches text | Listener confirms audio says what the Kangdi text says |
| Audio quality | Clear, no excessive noise, full phrase captured |
| Speaker match | Voice characteristics consistent with metadata |
| Pronunciation guide | Romanized guide matches actual audio pronunciation |

---

# Step 5 — Confidence Score

Each entry receives a confidence score after validation.

| Score | Range | Meaning |
| ----- | ----- | ------- |
| High | 0.9 – 1.0 | Native speaker verified, audio matches, translations confirmed |
| Medium | 0.7 – 0.89 | Native speaker verified, no audio or minor translation notes |
| Low | 0.5 – 0.69 | Verified but with caveats noted (dialect variant, uncertain translation) |
| Rejected | < 0.5 | Failed validation — not included in production dataset |

### Score Calculation

| Factor | Weight | Score |
| ------ | ------ | ----- |
| Native speaker approved | 0.35 | 0 or 0.35 |
| Translation accuracy confirmed | 0.25 | 0 or 0.25 |
| Audio-text alignment (if applicable) | 0.20 | 0, 0.10, or 0.20 |
| Metadata completeness | 0.10 | 0 to 0.10 |
| Pronunciation guide accuracy | 0.10 | 0, 0.05, or 0.10 |

Only entries with confidence ≥ 0.7 are marked `verified = true`.

---

# Step 6 — Double Verification

A second independent reviewer confirms the first reviewer's assessment.

| Rule | Detail |
| ---- | ------ |
| Independence | Second reviewer must not be the first reviewer or the collector |
| Agreement | Both reviewers must agree on `verified` status |
| Disagreement | If reviewers disagree, a third native speaker arbitrates |
| Documentation | Both reviewer names recorded in `Dataset/Metadata/` |

---

# Quality Assurance Checklist

Before an entry is marked `verified = true`:

- [ ] Schema validation passed
- [ ] Kangdi text approved by native speaker
- [ ] Hindi translation confirmed accurate
- [ ] English translation confirmed accurate
- [ ] Pronunciation guide matches spoken form
- [ ] Domain and intent labels are correct
- [ ] Audio matches text (if audio available)
- [ ] Speaker consent documented
- [ ] Confidence score ≥ 0.7
- [ ] Double verification completed
- [ ] No offensive or inappropriate content
- [ ] Notes field captures any caveats

---

# Rejection and Revision

| Outcome | Action |
| ------- | ------ |
| Schema fail | Fix data format and resubmit |
| Translation error | Revise translation and re-review |
| Unnatural Kangdi | Consult speaker for natural phrasing |
| Audio mismatch | Re-record audio or update text |
| Low confidence | Add notes, seek additional review |
| Rejected | Entry excluded from production dataset, kept in review queue |

---

# Production Dataset Criteria

An entry is included in the production HIMCorpus Knowledge Layer when:

1. `verified = true`
2. Confidence score ≥ 0.7
3. All required schema fields populated
4. Speaker consent documented
5. License field set

Entries with `verified = false` remain in sample/development data only.
