# HimBhasha AI — Project Vision Document

---

## 1. Project Overview

HimBhasha AI is an AI-powered language platform built to serve speakers of Himachal Pradesh's regional languages — starting with Kangdi (Kangri), and expanding to Mandeali, Kullui, Chambeali, Sirmauri, Kinnauri, and Bhoti. It combines conversational AI, document understanding, translation, and voice interaction into a single assistant designed for people who are underserved by mainstream AI tools built primarily for English and Hindi.

The MVP focuses on Kangdi, grounded in the only peer-reviewed, publicly available Kangri corpus currently in existence (Chauhan et al., 2021, NIT Hamirpur), with an architecture designed from day one to extend to the other six target languages without a rebuild.

---

## 2. Vision Statement

A Himachal Pradesh where no one is excluded from digital services, government schemes, education, or AI-powered assistance because of the language they speak at home.

---

## 3. Mission Statement

To build practical, reliable AI tools that let people in Himachal Pradesh communicate, understand documents, and access services in their own regional language — and to do this in a way that also contributes to documenting and preserving languages that UNESCO has classified as endangered.

---

## 4. The Problem We Want to Solve

Government forms, healthcare information, educational content, and AI assistants in India are overwhelmingly built for Hindi and English speakers. For the roughly 1.1–1.7 million speakers of Kangri/Kangdi, and smaller populations speaking Mandeali, Kullui, Chambeali, Sirmauri, Kinnauri, and Bhoti, this creates a real, daily gap:

- A form or scheme notice arrives in Hindi or English and isn't fully understood by someone more comfortable in their regional dialect.
- Older residents, who are often the most fluent native speakers, are the least served by digital tools built in majority languages.
- These languages have limited digital presence, which accelerates language loss — UNESCO lists several Himachali languages, including Kangri and Kinnauri-Pahari, as endangered.

We are not claiming these communities cannot use Hindi at all — most can, to varying degrees. The problem is friction, exclusion at the margins, and a slow erosion of language use in digital spaces, not a total communication breakdown.

---

## 5. Why Himachal Pradesh?

Himachal Pradesh has one of the highest concentrations of endangered languages of any Indian state — UNESCO's endangered languages atlas lists seven Himachali languages as definitely endangered. Despite this, almost no AI or NLP infrastructure exists for the state's regional languages. This is both a genuine social need and a largely unaddressed technical gap, which makes it a legitimate space for a new platform rather than a crowded one.

---

## 6. Why Start with Kangdi?

Three practical reasons, not just familiarity:

1. **It's the largest** of the target languages by speaker population (over a million speakers, concentrated in Kangra, Hamirpur, and parts of Una, Mandi, and Chamba districts).
2. **It's the only one with an existing digitized dataset** — a CC0-licensed, peer-reviewed Hindi-Kangri parallel corpus (26,862 sentence pairs) built at NIT Hamirpur. Starting where real data already exists is a deliberate, resource-conscious decision, not an arbitrary one.
3. **It de-risks the roadmap.** Proving the architecture works end-to-end on one language, backed by real evaluation data, is a stronger foundation for expansion than attempting all seven languages shallowly at once.

---

## 7. Long-Term Vision (5-Year Roadmap)

| Phase | Timeframe | Focus |
|---|---|---|
| **Year 1** | MVP + validation | Kangdi chat, translation, document simplification, voice I/O. Native-speaker validation of translation quality. Pilot with a small user group. |
| **Year 2** | Depth over Kangdi | Improve translation accuracy with fine-tuning (not just prompting), expand domain coverage (government schemes, healthcare, agriculture), begin structured data collection for Mandeali and Kullui. |
| **Year 3** | Second and third languages | Launch Mandeali and Kullui support using the same architecture. Partner with Himachal Pradesh Academy of Arts, Culture & Languages or academic groups for data validation. |
| **Year 4** | Full Himachali coverage | Extend to Chambeali, Sirmauri, Kinnauri, and Bhoti as data and partnerships allow. Explore offline/low-bandwidth modes for remote hill areas. |
| **Year 5** | Platform, not product | Open parts of the toolkit (datasets, evaluation benchmarks, prompting frameworks) for other low-resource Indian languages to reuse, positioning HimBhasha AI as infrastructure, not just an app. |

This roadmap is deliberately conservative on timing — low-resource language data collection is slow, and we would rather under-promise on language count than overstate coverage we don't yet have.

---

## 8. Core Values

- **Accuracy over coverage.** A smaller set of languages done credibly beats broad claims we can't back with data.
- **Community involvement, not extraction.** Native speakers should be validators and contributors, not just end users of a system built without them.
- **Honest about limitations.** We will say clearly what the AI does not yet do well, especially around dialect variation and voice.
- **Preservation as a byproduct of utility.** People will use a tool that solves a real problem; the language-preservation value comes from that usage existing at all, not from framing it as a preservation project first.

---

## 9. Success Metrics

**For the hackathon MVP:**
- Working end-to-end demo across chat, document simplification, and voice
- A measurable translation quality score (BLEU/METEOR) against the held-out Kangri test set, not just anecdotal demo success
- At least one round of native-speaker feedback on translation quality

**For the product beyond the hackathon:**
- Number of active users from target districts
- Document simplification requests completed successfully
- Qualitative feedback from users on whether responses feel linguistically accurate, not just technically functional
- Number of validated parallel sentences contributed back to the dataset over time

---

## 10. Expected Social Impact

- Reduced friction for regional-language speakers engaging with government forms, healthcare information, and educational material
- A small but real contribution to digital documentation of an endangered language, independent of whether the product itself scales widely
- A reusable template — dataset strategy, evaluation approach, architecture — that other low-resource Indian language efforts could draw on

We're deliberately not claiming this will "save" any language on its own. Language preservation is a community and policy effort; what a tool like this can realistically do is remove one barrier and create a small, ongoing digital footprint for the language.

---

## 11. Future Expansion Across India

The underlying architecture — bilingual LLM prompting grounded in a validated parallel corpus, OCR-based document simplification, and voice I/O — is not Himachal-specific. The same approach could extend to other under-resourced Indian languages with similar characteristics: limited digital presence, UNESCO-flagged endangerment status, and geographic concentration that makes community validation feasible. Realistically, this expansion depends on finding or building comparable datasets for each new language — it is not a simple flip of a language switch.

---

## 12. Tagline

**"Your language, understood everywhere."**
