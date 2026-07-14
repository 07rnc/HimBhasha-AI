# HimBhasha AI — Problem Statement

---

## 1. Executive Summary

India recognizes 121 languages and 270 mother tongues under the 2011 Census, but only 22 hold Scheduled status and receive sustained government and AI investment. The remaining languages — spoken as a first language by roughly 40 million Indians — are largely absent from digital infrastructure, including the country's own flagship language-AI platform, Bhashini, which currently serves the 22 Scheduled languages. Himachal Pradesh is a concentrated example of this gap: the state has seven languages UNESCO classifies as definitely endangered, is nearly 90% rural, and depends heavily on tourism, government services, and agriculture — all domains where language friction has real, daily cost. Kangdi (Kangri), spoken by over a million people in the Kangra region, has no presence in any major AI assistant, translation tool, or government digital service today, despite being the largest of Himachal's regional languages. HimBhasha AI addresses this specific, evidenced gap — not by claiming to solve language endangerment broadly, but by building a working assistant grounded in the one validated Kangri dataset that exists, with an architecture designed to extend to the state's other regional languages as comparable data becomes available.

---

## 2. Background

**India's linguistic diversity.** The 2011 Census recorded 19,569 raw mother-tongue responses, rationalized into 1,369 mother tongues and grouped into 121 languages — of which 270 mother tongues each have more than 10,000 speakers.[^1] Only 22 of these languages have Scheduled status under the Eighth Schedule of the Constitution, which brings state patronage, funding, and inclusion in official digital platforms.[^2] The remaining 99 non-Scheduled languages, plus hundreds of smaller mother tongues, account for roughly 3.29% of India's population — a small percentage, but at India's scale, tens of millions of people.[^3]

**Why regional languages matter.** Language is the medium through which people understand legal rights, medical guidance, and educational content most reliably. Research on language access consistently finds that comprehension and trust drop when information is delivered in a second or third language, particularly for older adults and less formally educated populations — this is a well-established finding in health communication and legal-aid literature, though we have not sourced Himachal-specific studies confirming it locally, and note this as an assumption carried over from the general literature rather than local evidence.

**Why low-resource languages are underrepresented in AI.** Large language models and speech systems are trained predominantly on web-scale text, which mirrors existing digital publishing patterns — languages with more digitized text, more Wikipedia articles, more news coverage, and more existing NLP research get better model support. Languages like Kangri, with only one known digitized parallel corpus in existence (26,862 sentence pairs, released in 2021), simply do not have enough training signal for general-purpose models to perform well on them without deliberate grounding.[^4]

**The digital divide.** As of Q1 2026, India has 1.09 billion internet subscribers, but rural internet penetration stands at 48.31 per 100 people compared to 126.80 per 100 in urban areas — meaning urban India has more internet connections than people, while rural India is still below 50% penetration.[^5] A 2025 National Sample Survey-based analysis found that of rural households without internet access, roughly half cited not knowing how to use it or being unaware of it — a digital-readiness gap distinct from and compounding the infrastructure gap.[^6] Regional-language interfaces are one documented lever for improving usability once connectivity exists, though the causal size of that effect specifically for Himachali languages has not been separately studied, to our knowledge.

---

## 3. Problem Definition

**Lack of AI support.** No mainstream AI assistant — not ChatGPT, Gemini, Alexa, or Bhashini — currently supports Kangdi, Mandeali, Kullui, Chambeali, Sirmauri, Kinnauri, or Bhoti as an interaction language.

**Limited digital accessibility.** Government portals, banking apps, and health information systems are built in Hindi and English, requiring regional-language speakers to translate mentally or seek help from someone bilingual.

**Poor availability of datasets.** Beyond the one Kangri corpus referenced above, there is no comparable public dataset for Mandeali, Kullui, Chambeali, Sirmauri, Kinnauri, or Bhoti that we have been able to locate. This is the single largest technical constraint on this project's expansion plan, and we state it plainly rather than assuming it will resolve itself.

**Absence of speech technologies.** No automatic speech recognition or text-to-speech system has been trained on any Himachali regional language's acoustic data, to our knowledge. Any voice interaction with these languages today relies on approximating them through Hindi speech models, which will mishear or misrender dialect-specific phonemes.

**Difficulty accessing government information.** Central schemes and information campaigns are typically issued in Hindi and English; state-specific translation into regional Himachali languages, where it happens at all, depends on local officials rather than any systematic digital pipeline.

**Educational barriers.** Children who speak a regional language at home but are taught and tested in Hindi or English face an added cognitive load in early schooling — a widely documented pattern in mother-tongue education research generally, though we flag this as a general finding applied to this context rather than a Himachal-specific study.

**Language preservation challenges.** UNESCO's Atlas of the World's Languages in Danger lists Kangri and Kinnauri-Pahari, among others, as endangered, in a state that reports seven definitely-endangered languages overall — more than any other Indian state.[^7] Endangerment in UNESCO's framework specifically means intergenerational transmission is breaking down — children are no longer reliably learning the language as their mother tongue.

---

## 4. Why Himachal Pradesh?

**Cultural significance.** Each Himachali language carries oral literature, folk song traditions (Lok-Geet), and local knowledge — the Kangri corpus alone includes over 65,000 lines of digitized poems and folk songs, evidence of an active, if shrinking, literary tradition.[^8]

**Geographic challenges.** Himachal Pradesh's hill and mountain terrain naturally isolates valleys and districts from one another, which is part of why the state supports as many distinct regional languages as it does, and why infrastructure rollout (roads, connectivity, services) is inherently harder and slower than in flatter states.

**Rural communities.** Approximately 90% of Himachal Pradesh's population lives in rural areas — the highest rural share of any major Indian state after Bihar, Assam, and Odisha.[^9] This is precisely the population least likely to be fluently comfortable in Hindi/English digital interfaces and most likely to be native regional-language speakers.

**Tourism.** Himachal Pradesh drew roughly 1 crore (10 million) domestic and foreign tourist visits in just the first half of 2024, with the state government targeting 5 crore tourists annually going forward.[^10] Tourism is one of the state's largest economic sectors; language tools that help visitors and locals communicate have a direct, measurable economic use case beyond social impact.

**Digital transformation.** Himachal Pradesh had 8.90 million wireless connections as of March 2025, alongside continued central investment in rural connectivity infrastructure like BharatNet.[^11] Connectivity is arriving; regional-language digital content and tools are not keeping pace with it.

---

## 5. Why Kangdi First?

**Practical reasons.** Kangdi/Kangri is the largest of the seven target languages by speaker population — estimates range from about 1.1 million (2011 Census-based figures) to 1.7 million depending on source and year, a range we present honestly rather than picking whichever number sounds more impressive.[^12]

**Scalability.** Kangdi's use as an MVP is explicitly a proof of architecture, not an endpoint. The system is designed so that adding a new language means adding a new dataset and prompt-grounding layer, not rebuilding the application.

**Dataset feasibility.** Kangri is the only one of the seven target languages with an existing, peer-reviewed, freely licensed parallel corpus (Chauhan, Saxena & Daniel, 2021 — 26,862 Hindi-Kangri sentence pairs, CC0 license, built at NIT Hamirpur).[^4] No comparable resource currently exists, to our knowledge, for Mandeali, Kullui, Chambeali, Sirmauri, Kinnauri, or Bhoti. Starting where real data exists is a deliberate resourcing decision.

**Community impact.** Kangra district — Kangdi's core speaker base — is also Himachal Pradesh's officially declared "Tourism Capital," meaning the population most likely to benefit from this MVP overlaps with a district already undergoing rapid tourism-driven digital and infrastructure investment, giving a natural distribution and validation opportunity.[^13]

---

## 6. Existing Challenges

**Technical Challenges**
- No dedicated speech or text models trained on Himachali regional languages
- No standardized spelling/orthography enforcement across sources (regional variation is real, not just a data-cleaning artifact)
- Reliance on general-purpose LLMs whose Kangdi/Kangri competence is unverified without grounding
- Dataset scarcity for six of the seven target languages

**Social Challenges**
- Younger generations shifting toward Hindi/English, accelerating language loss
- Stigma in some contexts around speaking regional dialects in formal/digital settings
- Elderly, often the most fluent native speakers, are least likely to be digitally engaged

**Educational Challenges**
- Instruction and testing conducted in Hindi/English regardless of a student's home language
- No structured regional-language learning content for children to reinforce the language digitally
- Teachers generally untrained in bilingual or mother-tongue-supportive instruction methods, a broader Indian pattern rather than a Himachal-specific claim we can independently verify

**Government Service Challenges**
- Scheme and policy communication issued centrally in Hindi/English, with regional-language translation inconsistent and locally dependent
- No dedicated regional-language channel for grievance redressal in Himachali languages (Bhashini-integrated systems like CPGRAMS currently support the 22 Scheduled languages, not Kangri or other Himachali languages)[^14]

**Business Challenges**
- Tourism and hospitality businesses have no tools to bridge visitor-local communication beyond informal translation
- No monetizable, validated language-AI product currently exists for this market, meaning there's no existing competitor to benchmark against, but also no proof yet of commercial demand at scale

---

## 7. Evidence

| Metric | Figure | Source |
|---|---|---|
| Languages recognized by India's 2011 Census | 121 languages, 270 mother tongues | Census of India, 2011[^1] |
| Scheduled languages (Eighth Schedule) | 22 | Constitution of India / Census 2011[^2] |
| Population speaking non-Scheduled languages | ~3.29% (tens of millions) | Census of India, 2011[^3] |
| Endangered languages in India (UNESCO) | 197, with Himachal Pradesh topping the state list at 7 | UNESCO Atlas of Languages in Danger[^7] |
| Kangri/Kangdi speaker population | ~1.1–1.7 million (range across sources/years) | 2011 Census-derived estimates; Omniglot/Wikipedia[^12] |
| Existing digitized Kangri parallel corpus | 26,862 Hindi-Kangri sentence pairs (CC0 license) | Chauhan, Saxena & Daniel, 2021[^4] |
| Rural internet penetration (India, Q1 2026) | 48.31 per 100 people, vs. 126.80 urban | TRAI Telecom Performance Indicators, Q1 2026[^5] |
| Rural households citing low digital readiness as a barrier | ~1 in 2 rural offline households | NSSO 80th Round (CMS-T), analyzed by CEDA, 2025[^6] |
| Himachal Pradesh rural population share | 89.97% | Census of India, 2011[^9] |
| Himachal Pradesh tourist visits (H1 2024) | ~1 crore (10 million) | Himachal Pradesh Government / Department of Tourism[^10] |
| Himachal Pradesh wireless connections | 8.90 million (as of March 2025) | TRAI, via IBEF[^11] |
| Languages currently supported by Bhashini (India's national language-AI platform) | 22 Scheduled languages; ASR/TTS support narrower still | Digital India Bhashini Division[^14] |

We have deliberately avoided citing statistics we could not verify from a named, checkable source. Where a claim is a reasonable inference rather than a directly sourced fact (for example, the expected impact of language-matched interfaces on usability specifically in Himachal Pradesh), it is marked as such in the relevant section rather than presented as established data.

---

## 8. Stakeholders

| Stakeholder | How they're affected |
|---|---|
| **Students** | Learn and are tested in Hindi/English despite speaking a regional language at home, adding friction to comprehension, especially in early grades. |
| **Farmers** | Miss or misunderstand agricultural scheme information, weather advisories, and market price updates issued in Hindi/English. |
| **Elderly residents** | Often the most fluent native speakers, but least likely to be digitally literate or comfortable navigating Hindi/English government apps — the group most excluded by the current digital shift. |
| **Teachers** | Lack tools or training to bridge instruction between the regional language students think in and the Hindi/English curriculum they must teach. |
| **Government officials** | Must manually bridge language gaps when engaging rural constituents, with no digital tool to assist, slowing service delivery. |
| **Tourists** | Cannot easily communicate with locals in remote areas where Hindi/English fluency is lower, limiting their experience and local economic interaction. |
| **Researchers/linguists** | Currently lack digitized, structured datasets for most Himachali languages, slowing any academic documentation or preservation effort. |
| **Local businesses (esp. tourism/hospitality)** | Have no digital tool to serve visitors or manage transactions across the language gap beyond informal, inconsistent translation. |

---

## 9. Consequences of Inaction

If Himachal's regional languages continue to receive negligible AI and digital investment, three consequences follow, at different timescales:

**Short-term:** People will continue to face daily friction accessing digital services, understanding official documents, and engaging with AI tools not built for them — a persistent but low-visibility form of exclusion that doesn't show up in outage reports or complaint statistics, which is part of why it's easy to overlook.

**Medium-term:** As Hindi/English-first digital platforms become the default way younger generations interact with information, education, and each other, regional-language use is likely to continue declining among youth — the same pattern UNESCO's endangerment framework already documents for Kangri and Kinnauri-Pahari.

**Long-term:** Endangered languages that lose intergenerational transmission do not typically recover without deliberate intervention. If digitization continues to happen only in Hindi and English, these languages risk becoming further marginalized in exactly the domain — digital life — that increasingly defines how younger generations communicate, learn, and transact.

We present this as a plausible trajectory grounded in UNESCO's established endangerment criteria, not as a certainty — language shift is a complex social process with many contributing factors, and no single AI product will single-handedly reverse or prevent it.

---

## 10. Opportunity

**Generative AI.** Modern LLMs can be grounded via prompting and retrieval on small, high-quality datasets — a fundamentally different (and cheaper) approach than the from-scratch statistical/neural MT training the original Kangri corpus paper used in 2021, which scored low BLEU (3–6) because it lacked this grounding approach entirely.

**Speech AI.** Open-source speech recognition (e.g., Whisper) and synthesis tools have become good enough and cheap enough to prototype with, even without dedicated Kangdi acoustic training data, lowering the barrier to a working voice demo.

**Open-source models.** The availability of free-tier LLM APIs and open-source NLP toolkits (Indic NLP Library, IndicBERT) removes what would previously have been a significant compute/cost barrier to a student or hackathon team attempting this kind of project.

**India's AI ecosystem.** The government is actively investing in exactly this problem space at the national level — Bhashini, BharatGen, and related initiatives show clear policy intent to extend AI language support beyond the current 22 Scheduled languages.[^14] This is both validation that the problem is real and a signal that unscheduled regional languages like Kangri remain a genuine gap even within these national efforts.

**Digital Public Infrastructure.** India's broader DPI approach (UPI, Aadhaar, Bhashini-as-a-service APIs) demonstrates a working model for building interoperable public digital tools — a pattern this project's dataset-and-API approach is deliberately compatible with, should future integration with Bhashini or similar platforms become possible.

**Why now, specifically:** the combination of (a) prompt-groundable LLMs removing the need for expensive model training, (b) one validated Kangri dataset now existing and being citable, and (c) active national policy momentum toward exactly this kind of language inclusion — is a genuinely new alignment that did not exist even three to four years ago, when the original Kangri corpus paper's own from-scratch MT models struggled to produce usable translations.

---

## 11. Problem Statement (Final Version)

Himachal Pradesh is home to seven regional languages — including Kangdi, spoken by over a million people — that UNESCO recognizes as endangered and that remain almost entirely absent from India's growing AI and digital-language ecosystem, including the country's own national language-AI platform, which currently serves only the 22 constitutionally Scheduled languages. This gap creates daily friction for rural residents, students, farmers, and elderly citizens engaging with government services, education, and information in a language other than their own, and contributes to the slow erosion of languages that are already losing intergenerational transmission. HimBhasha AI addresses this problem by building a multilingual AI assistant grounded in the one validated, peer-reviewed Kangri dataset currently available, starting with Kangdi as a proof of architecture and expanding to Mandeali, Kullui, Chambeali, Sirmauri, Kinnauri, and Bhoti as comparable datasets are developed or sourced — treating dataset availability, not ambition, as the honest pace-setter for that expansion.

---

## References

[^1]: Census of India, 2011 — Language data (121 languages, 270 mother tongues, 19,569 raw returns). censusindia.gov.in
[^2]: The India Forum, "India's Linguistic Diversity: How the Census Obscures It" (2021) — 22 Scheduled / 99 non-Scheduled language breakdown.
[^3]: Gulf News / Census of India 2011 press summary — 96.71% of population speaks a Scheduled language as mother tongue.
[^4]: Chauhan, S., Saxena, S., & Daniel, P. (2021). "Monolingual and Parallel Corpora for Kangri Low Resource Language." arXiv:2103.11596. Corpus: github.com/chauhanshweta/Kangri_corpus (CC0-1.0).
[^5]: TRAI, Indian Telecom Services Performance Indicators, Q1 2026 (reported via The Week, June 2026).
[^6]: CEDA (Centre for Economic Data and Analysis), Ashoka University — "One Nation, Many Disconnects: Mapping India's Home Internet Gaps" (2025), based on NSSO 80th Round (CMS-T) data.
[^7]: UNESCO Atlas of the World's Languages in Danger; Wikipedia summary of Kangri language's endangered status.
[^8]: Chauhan, Saxena & Daniel (2021), corpus composition table (Kr_3: poems, Lok-Geet, Gazals).
[^9]: Census of India, 2011 — Himachal Pradesh rural/urban population split (89.97% rural).
[^10]: Himachal Pradesh Government tourism department press release, June 2024.
[^11]: TRAI data via IBEF state profile, Himachal Pradesh (wireless connections, March 2025).
[^12]: Omniglot / Wikipedia, Kangri language — speaker population estimates (range reflects differing source years and methodologies).
[^13]: Himachal Pradesh Government press release, June 2024 (Kangra declared "Tourism Capital").
[^14]: Digital India Bhashini Division; Wikipedia "Bhashini"; CIO.inc interview with Bhashini CEO Amitabh Nag (2023) on current language/ASR/TTS coverage.

*Note: government and news-sourced figures in this document (tourism arrivals, telecom connections, internet penetration) are point-in-time and will drift; verify against the cited source before using in a final submission if precision matters for judging.*
