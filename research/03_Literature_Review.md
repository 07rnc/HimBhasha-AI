# HimBhasha AI — Literature Review

*A technical report prepared to ground the design of HimBhasha AI in existing research on low-resource NLP, speech, OCR, and multilingual AI.*

---

## 1. Introduction

**What are low-resource languages?** In NLP, "low-resource" does not mean few speakers — it means little usable digital data: limited annotated corpora, limited parallel text for translation, limited speech recordings, and limited presence in the web-scale datasets that modern models are trained on. Joshi et al. (2020) formalized this by classifying the world's ~7,000 languages into six resource categories based on the volume of labeled and unlabeled data available, finding that a handful of languages — English, Mandarin, Spanish, French, German, Japanese, Arabic — sit in the highest-resource tier, while the overwhelming majority of languages, including every language HimBhasha AI targets, have little to no structured digital presence.[^1] Magueresse, Carles & Heetderks (2020) similarly note that low-resource status is really a lack of "supervised data, number of native speakers or experts" needed to train statistical or neural systems — resourcedness is about data infrastructure, not population size.[^2]

**Why are they difficult for AI systems?** Modern NLP is built on the pre-train/fine-tune paradigm: large models learn general language patterns from massive corpora, then get adapted to specific tasks or languages. Hedderich et al. (2021) survey this problem directly, noting that when target-language training data is sparse, models must rely on data augmentation, distant supervision, or transfer learning from related, higher-resource languages — each of which introduces its own approximations and failure modes rather than solving the underlying data gap.[^3] For machine translation specifically, Haddow et al.'s survey of low-resource MT notes that "resourced-ness" is a continuum, not a fixed category, and that most techniques for low-resource MT are really techniques for coping with a data shortfall rather than eliminating it.[^4]

**Why is this problem important in India?** India's own linguistic landscape is a near-perfect illustration of Joshi et al.'s resource pyramid: 121 languages and 270 mother tongues are recognized by the 2011 Census, but only 22 have Scheduled status and receive concentrated research and government investment (see IndicTrans2, IndicBERT, MuRIL, discussed below — all built for the 22 Scheduled languages).[^5] Everything outside that set, including every Himachali language this project targets, falls into exactly the resource gap the low-resource NLP literature describes — not because these languages are rare, but because they have not been prioritized for digitization and dataset construction.

---

## 2. Research Themes

### Low-Resource NLP

The foundational framing for this entire project comes from Joshi et al. (2020), whose six-tier taxonomy of language resourcedness gives a principled way to say precisely where Kangdi and its sister languages sit: they have essentially no labeled task-specific data and only minimal unlabeled text, placing them at the very bottom of the resource pyramid alongside the vast majority of the world's languages.[^1] Hedderich et al. (2021) and Magueresse et al. (2020) both catalogue the standard toolkit for operating in this regime — data augmentation, transfer learning from related languages, and distantly supervised labeling — which directly informs HimBhasha AI's strategy of leaning on a validated Hindi-Kangri parallel corpus rather than attempting to train anything from scratch.[^2][^3]

### Neural Machine Translation

Haddow et al.'s survey of low-resource MT catalogues methods including back-translation, transfer learning from related language pairs, and multilingual training — but also stresses that the field still lacks reliable evaluation for many of the language pairs it studies.[^4] This is directly visible in the Kangri corpus paper itself (Chauhan, Saxena & Daniel, 2021), whose own from-scratch statistical and neural MT baselines scored BLEU 3–6 on Hindi-Kangri translation — a low score that illustrates just how hard from-scratch NMT is for a corpus this size (27K sentence pairs), and motivates HimBhasha AI's choice to ground a pre-trained LLM via prompting rather than train a dedicated MT model.[^6]

### Speech Recognition (ASR)

Whisper (Radford et al., 2022/2023) is the most directly relevant ASR development for this project: trained on 680,000 hours of weakly supervised multilingual audio, it performs zero-shot transcription without requiring dataset-specific fine-tuning.[^7] This matters because HimBhasha AI has zero Kangdi-specific acoustic training data — Whisper's general multilingual and Hindi-adjacent training gives a usable, if imperfect, starting point for a hackathon MVP where building a dedicated acoustic model is out of scope.

### Text-to-Speech (TTS)

FastSpeech 2 (Ren et al., 2021) represents the class of modern, fast, non-autoregressive TTS architectures that decouple acoustic modeling from vocoding, enabling efficient speech synthesis once a target language has training data.[^8] AI4Bharat's Indic-TTS effort follows a similar multi-speaker acoustic-model-plus-vocoder design specifically for Indic languages, though — as with ASR — no dedicated Kangdi TTS model exists.[^9] For the MVP, this motivates falling back on browser-native speech synthesis (which can approximate Hindi/Devanagari pronunciation) rather than attempting to build or fine-tune a dedicated model.

### OCR for Indic Languages

Agarwal & Anastasopoulos (2024) provide the first dedicated survey of OCR specifically for low-resource, data-scarce settings, noting that OCR is often the only path to digitizing existing but non-machine-readable material (scanned books, field notes) for languages without born-digital text — a description that matches how the Kangri monolingual corpus itself was partly built (digitized from printed Kangri books via OCR, then manually corrected).[^10][^6] The underlying open-source engine choice, Tesseract (Smith, 2007), remains a standard, well-documented baseline OCR system suitable for Devanagari-script documents, which is why it's the pragmatic MVP choice over training a custom OCR model.[^11]

### Large Language Models

Brown et al.'s GPT-3 paper (2020) established that sufficiently large language models can perform new tasks from a handful of in-context examples without any weight updates — the few-shot prompting paradigm.[^12] This is the mechanism HimBhasha AI relies on directly: rather than fine-tuning a model on the small Kangri corpus, real Hindi-Kangri sentence pairs are injected as few-shot examples in the prompt at inference time, letting a general-purpose LLM (Gemini) anchor its output in real language data without any training run.

### Retrieval-Augmented Generation (RAG)

Lewis et al. (2020) introduced RAG as a way to combine a parametric language model with a non-parametric retrieval mechanism over an external knowledge source, improving factual grounding without retraining the model itself.[^13] For HimBhasha AI, this is the architectural pattern behind the dictionary-lookup layer (the Kr_2 Hindi-Kangri dictionary from the corpus): rather than hoping the LLM "knows" a term, specific vocabulary can be retrieved and injected into context before generation, reducing hallucinated translations for domain-specific terms (government, health, agriculture vocabulary).

### Multilingual AI

XLM-R (Conneau et al., 2020) demonstrated that a single Transformer model trained across 100 languages on CommonCrawl data can substantially outperform earlier multilingual models like mBERT, with the largest relative gains precisely on low-resource languages such as Swahili and Urdu.[^14] This is direct evidence that multilingual pretraining transfers disproportionately well to lower-resource languages — supporting the general strategy of leaning on large multilingual/general-purpose models rather than attempting monolingual Kangdi model training, which the corpus size (27K sentence pairs) could not realistically support.

### Indic Language Models

AI4Bharat's model suite is the most directly relevant prior work for this project's long-term technical roadmap. IndicBERT (Kakwani et al., 2020) is a multilingual ALBERT model covering 11 major Indian languages, released alongside the IndicNLPSuite benchmark and monolingual corpora.[^15] MuRIL (Khanuja et al., 2021), from Google Research, extends this with training on both native-script and transliterated text across 17 Indic languages — an approach directly relevant to Himachali languages, which are often typed informally in Romanized form on WhatsApp and social media.[^16] IndicTrans2 (Gala et al., 2023) is the first open-source NMT model covering translation across all 22 Scheduled Indian languages, and explicitly notes that ~97% of India's population is covered by those 22 languages — implicitly confirming that Kangdi, spoken by the remaining ~3%, falls outside even this most comprehensive existing effort.[^17] This is the clearest evidence in the literature of the exact gap HimBhasha AI is built to address.

---

## 3. Literature Review Table

| Paper | Year | Authors | Problem Addressed | Method | Strengths | Limitations | Relevance to HimBhasha AI |
|---|---|---|---|---|---|---|---|
| The State and Fate of Linguistic Diversity and Inclusion in the NLP World[^1] | 2020 | Joshi, Santy, Budhiraja, Bali, Choudhury | Quantifying global language inequality in NLP resources | Analysis of 2,000+ languages by data availability, 6-tier taxonomy | Empirically grounded, widely cited framing for "low-resource" | Descriptive, not solution-oriented | Provides the resourcedness framework used to justify starting with Kangdi and scaling later |
| Low-resource Languages: A Review of Past Work and Future Challenges[^2] | 2020 | Magueresse, Carles, Heetderks | Cataloguing methods for low-resource NLP | Literature review | Broad coverage of techniques | Pre-dates modern LLM prompting approaches | Confirms transfer learning/data augmentation as the standard toolkit before LLMs made prompting viable |
| A Survey on Recent Approaches for NLP in Low-Resource Scenarios[^3] | 2021 | Hedderich, Lange, Adel, Strötgen, Klakow | Structuring methods for sparse-data NLP | Survey (data augmentation, distant supervision, transfer learning) | Clear taxonomy of technique types | Focused on pre-LLM fine-tuning paradigm | Justifies preferring prompting/RAG over fine-tuning for a 27K-sentence corpus |
| Survey of Low-Resource Machine Translation[^4] | 2022 | Haddow, Bawden, Barone, Helcl, Birch | Cataloguing low-resource MT techniques | Survey (back-translation, transfer learning, multilingual training) | Comprehensive, practical | Evaluation for very low-resource pairs remains weak | Frames why from-scratch NMT (as in the Kangri paper) underperforms vs. LLM-based approaches |
| Monolingual and Parallel Corpora for Kangri Low Resource Language[^6] | 2021 | Chauhan, Saxena, Daniel | No digitized Kangri dataset existed | Manual + OCR-assisted corpus construction; SMT/NMT baselines | First and only Kangri corpus; CC0-licensed; domain-tagged | Low baseline BLEU (3-6); Hindi-Kangri only, not English | Core dataset HimBhasha AI is grounded in; direct evidence of task difficulty |
| A Concise Survey of OCR for Low-Resource Languages[^10] | 2024 | Agarwal, Anastasopoulos | OCR challenges for data-scarce languages | Survey of OCR techniques and open challenges | First survey specific to this setting | Focused on Indigenous American languages, not Indic scripts specifically | Validates OCR-based corpus digitization approach used in Kangri corpus construction and HimBhasha's document panel |
| An Overview of the Tesseract OCR Engine[^11] | 2007 | Smith | General-purpose OCR | Two-pass adaptive-classifier OCR engine | Open-source, well-documented, multilingual-capable | Lower accuracy than modern deep-learning OCR on noisy/handwritten input | Pragmatic OCR engine choice for MVP document-simplification feature |
| Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)[^7] | 2022 | Radford, Kim, Xu, Brockman, McLeavey, Sutskever | Zero-shot, robust ASR across languages/conditions | 680K-hour weakly supervised multitask training | Zero-shot, no fine-tuning required, multilingual | No dedicated Kangdi acoustic data; will approximate via Hindi phonetics | ASR backbone for HimBhasha's voice-input feature |
| FastSpeech 2[^8] | 2021 | Ren, Hu, Tan, Qin, Zhao, Zhao, Liu | Fast, high-quality TTS | Non-autoregressive acoustic model + vocoder | Fast inference, good quality | Requires target-language training data HimBhasha lacks | Represents the architecture class for future dedicated Kangdi TTS, not usable out-of-box today |
| Language Models are Few-Shot Learners (GPT-3)[^12] | 2020 | Brown et al. | Task adaptation without fine-tuning | In-context few-shot prompting at scale | No training required; flexible; works with small example sets | Performance depends heavily on prompt/example quality | Core mechanism for grounding Gemini in real Kangri examples without fine-tuning |
| Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks[^13] | 2020 | Lewis et al. | Reducing hallucination, improving factual grounding | Dense retrieval + seq2seq generation | Updatable knowledge without retraining; reduces hallucination | Retrieval quality bottlenecks overall system quality | Architecture for the Hindi-Kangri dictionary lookup layer |
| Unsupervised Cross-lingual Representation Learning at Scale (XLM-R)[^14] | 2020 | Conneau et al. | Multilingual representation learning | 100-language Transformer MLM on CommonCrawl | Disproportionately helps low-resource languages | Kangdi not among the 100 trained languages | Evidence that multilingual pretraining transfers well to low-resource settings generally |
| IndicNLPSuite / IndicBERT[^15] | 2020 | Kakwani, Kunchukuttan, Golla, N.C., Bhattacharyya, Khapra, Kumar | Lack of NLU resources for Indian languages | Monolingual corpora + ALBERT-based model + benchmark (IndicGLUE) | Efficient, strong benchmark performance, 11 languages | Limited to 11 major Scheduled languages | Demonstrates the resourcing gap: Kangdi excluded from even this broad effort |
| MuRIL: Multilingual Representations for Indian Languages[^16] | 2021 | Khanuja et al. | Poor handling of transliterated/Romanized Indic text | BERT pretrained on native + transliterated script, 17 languages | Handles code-mixed/Romanized input well | Still limited to Scheduled languages | Directly relevant given informal Romanized Kangdi text on social media |
| IndicTrans2[^17] | 2023 | Gala, Chitale, AK, Gumma, Doddapaneni, et al. | High-quality MT for all 22 Scheduled languages | Multilingual Transformer NMT, script unification | First model covering all 22 Scheduled languages; strong benchmarks | Explicitly excludes non-Scheduled languages like Kangdi | Clearest literature evidence of the exact gap this project addresses |
| LoRA: Low-Rank Adaptation of Large Language Models[^18] | 2021 | Hu et al. | Expensive full fine-tuning of large models | Low-rank adapter matrices, freezing base weights | Cheap, fast adaptation; small storage footprint per task | Still requires some labeled target-language data | Proposed future-work method once a larger Kangdi dataset exists |

---

## 4. Technology Comparison

| Approach | Advantages | Disadvantages | Hackathon MVP Suitability | Long-Term Suitability |
|---|---|---|---|---|
| **Fine-tuning** | Can produce strong task-specific performance; well-understood | Requires substantial labeled data (thousands+ examples ideally) and compute; risk of overfitting on a 27K-sentence corpus | Low — too slow and data-hungry for a 48-hour sprint | Medium-High — viable once more Kangdi data (esp. multi-domain) is collected |
| **Prompt Engineering** | Zero training cost; immediate iteration; works with general-purpose APIs (Gemini) | Quality ceiling depends on base model's latent knowledge; less reliable than fine-tuning at scale | High — the only realistic MVP approach given time and data constraints | Low-Medium alone — best combined with RAG/light fine-tuning as data grows |
| **RAG** | Grounds generation in verifiable source data (the Kr_2 dictionary, Kr_4 examples); updatable without retraining | Retrieval quality is a new failure point; adds system complexity | High — directly implementable with the existing corpus, low engineering cost | High — scales naturally as more validated data is added per language |
| **Multilingual Transformers (e.g. XLM-R, IndicBERT)** | Strong general multilingual representations; disproportionate benefit for low-resource languages | Kangdi/Himachali languages are not in these models' training data; would need extension work | Low — no existing checkpoint covers target languages | Medium — could underpin a future dedicated embedding/classification layer if community data grows |
| **Synthetic Data Generation** | Can expand a small seed corpus (e.g., paraphrasing Kr_4 sentences via LLM) | Risk of amplifying errors or unnatural phrasing without native-speaker review; not a substitute for real data | Medium — could supplement few-shot examples if used cautiously and validated | Medium — useful as one input to dataset expansion, never as sole source |
| **Transfer Learning** | Leverages related, higher-resource languages (Hindi) as a bridge | Kangdi's actual divergence from Hindi (tone, vocabulary, morphology per Eaton, 2008 grammatical description) limits how far this transfers | Medium — implicitly used via Hindi-grounded prompting | Medium-High — formal cross-lingual transfer methods become viable with more data |
| **Cross-lingual Learning** | Can share representations across Kangdi and its sister Himachali languages once data exists for more than one | Currently only one of the seven target languages has any corpus at all | Low — not enough languages with data yet to attempt this | High — the eventual mechanism for scaling to Mandeali, Kullui, etc. once seed corpora exist for each |

---

## 5. Research Gaps

**Lack of datasets for Himachali languages.** Beyond the one Kangri corpus (Chauhan et al., 2021), no comparable resource exists for Mandeali, Kullui, Chambeali, Sirmauri, Kinnauri, or Bhoti, to our knowledge. This mirrors a broader pattern documented for other Indian low-resource language families — a 2023 effort to build parallel corpora for Northeast India's very low-resource languages faced the identical problem and had to construct new data essentially from scratch using religious-text translations as a starting corpus.[^19] **HimBhasha AI addresses this by** treating the Kangri corpus as a proof of architecture and by documenting, transparently, that expansion to the remaining six languages is gated on comparable data becoming available — not promising language coverage the underlying data cannot yet support.

**Limited speech resources.** No ASR or TTS system has been trained on Himachali-language acoustic data specifically. **HimBhasha AI addresses this by** using Whisper's general multilingual/zero-shot capability as a stopgap, while being explicit that this approximates rather than truly supports Kangdi speech phonetics.

**Lack of OCR support.** No OCR system is tuned for Kangri/Kangdi-specific orthographic quirks, though it is written in standard Devanagari. **HimBhasha AI addresses this by** using general-purpose Tesseract, which handles Devanagari script but not language-specific vocabulary — acceptable for document text extraction, less so for downstream understanding without the LLM grounding layer.

**Few multilingual assistants for unscheduled Indic languages.** IndicTrans2 and Bhashini both explicitly cover only the 22 Scheduled languages.[^17] **HimBhasha AI addresses this by** being, to our knowledge, one of the only assistant-style systems attempting Kangdi specifically, rather than duplicating existing Scheduled-language coverage.

**Weak document understanding.** Existing OCR-plus-simplification pipelines for Indic languages are largely built for Scheduled languages with existing summarization datasets; no such summarization/simplification benchmark exists for Kangdi. **HimBhasha AI addresses this by** using LLM-based simplification grounded in few-shot examples rather than a trained summarization model, which is the only feasible approach absent a labeled simplification dataset.

**Limited evaluation benchmarks.** The Kangri corpus's own 500-sentence held-out test set is, to our knowledge, the only evaluation benchmark for Hindi-Kangri translation quality that exists.[^6] **HimBhasha AI addresses this by** using that exact test set for BLEU evaluation, rather than claiming quality without any benchmark — and by being explicit that a 500-sentence test set is a thin evaluation basis that future work should expand.

---

## 6. Key Design Decisions

**Translation strategy: Few-shot-grounded LLM prompting over fine-tuning or from-scratch NMT.** The Kangri corpus's own NMT/SMT baselines scored BLEU 3-6 when trained from scratch on ~27K sentence pairs — too small a dataset for a strong dedicated model.[^6] Brown et al. (2020) established that large pretrained models can perform well from in-context examples alone, without requiring the thousands of examples fine-tuning typically needs.[^12] **Recommendation:** ground Gemini via few-shot examples drawn from the real corpus (already implemented in the current backend), and treat fine-tuning as a Phase 2 upgrade once more Kangdi data exists to fine-tune on responsibly.

**Speech strategy: Whisper for ASR, browser-native synthesis for TTS, both explicitly labeled as approximations.** No acoustic training data exists for Kangdi. Whisper's zero-shot multilingual capability is the only currently accessible option that doesn't require building a speech corpus from scratch — which is out of scope for a hackathon timeline.[^7] **Recommendation:** be transparent in documentation and demos that voice support is a best-effort approximation, not a validated Kangdi ASR/TTS system — overselling this specific piece is the easiest claim for a technically literate judge to challenge.

**OCR strategy: General-purpose Tesseract over a custom-trained model.** Building a Kangdi-specific OCR model would require a labeled image-to-text dataset that does not exist; Agarwal & Anastasopoulos (2024) confirm this is a common bottleneck for low-resource OCR generally.[^10] **Recommendation:** use Tesseract's existing Devanagari support for character-level extraction, and rely on the LLM layer (not OCR) for language-specific correction/simplification.

**LLM strategy: General-purpose API (Gemini) with RAG-style grounding, not a dedicated Indic LLM.** IndicBERT, MuRIL, and IndicTrans2 are all trained on Scheduled languages only, so none directly support Kangdi.[^15][^16][^17] A general-purpose LLM with strong Hindi capability, grounded via few-shot examples and dictionary lookup (per Lewis et al.'s RAG framing), is the most practical bridge to approximate Kangdi output without an Indic-specific base model.[^13] **Recommendation:** maintain the current architecture; consider LoRA-based fine-tuning of an open multilingual base model (per Hu et al., 2021) as a longer-term alternative once more data exists, since LoRA's low compute/storage cost fits a resource-constrained follow-on project better than full fine-tuning.[^18]

**Dataset strategy: One validated corpus per language before claiming support for that language.** The core lesson from surveying this literature is that nearly every low-resource NLP paper's headline contribution is a *dataset*, not a model — Kakwani et al.'s IndicNLPSuite, Chauhan et al.'s Kangri corpus, and the Northeast India parallel corpora effort are all, at core, dataset papers.[^15][^6][^19] **Recommendation:** HimBhasha AI's expansion roadmap should be paced by dataset availability for each new language, not announced ahead of it — consistent with the project's stated value of "accuracy over coverage."

---

## 7. Future Research Directions

- **Native-speaker validation study.** Before any claim of translation "accuracy," a structured validation exercise with fluent Kangdi speakers rating LLM output against the corpus and against their own judgment is the single highest-priority next research step.
- **Dedicated fine-tuning once data scales.** If community data collection (e.g., a Bhashini-style crowdsourcing effort, per existing government initiatives) grows the Kangdi corpus meaningfully beyond 27K sentences, LoRA-based fine-tuning of an open multilingual base model becomes a viable, low-cost upgrade path.[^18]
- **Acoustic data collection for ASR/TTS.** A structured effort — even a small one, e.g., 5-10 hours of read/spontaneous Kangdi speech with transcripts — would allow fine-tuning Whisper or training a lightweight TTS model, closing the largest current capability gap.
- **Extending the corpus-building methodology to the remaining six languages.** The Chauhan et al. (2021) methodology (distributing everyday topics to native writers, digitizing existing print material via OCR) is a replicable template for Mandeali, Kullui, Chambeali, Sirmauri, Kinnauri, and Bhoti — this is arguably the most impactful non-code contribution a follow-on project could make.
- **Formal evaluation benchmark expansion.** The existing 500-sentence Kangri test set is a start, but a broader, domain-stratified benchmark (covering government, health, education contexts specifically) would give much more actionable evaluation signal than a single aggregate BLEU score.
- **Cross-lingual transfer study across Himachali languages.** Once even a second language (e.g., Mandeali) has a seed corpus, studying whether Kangdi-grounded prompting transfers partially to related Western Pahari languages would be a genuinely novel research contribution, not just an engineering exercise.

---

## 8. References

[^1]: Joshi, P., Santy, S., Budhiraja, A., Bali, K., & Choudhury, M. (2020). The State and Fate of Linguistic Diversity and Inclusion in the NLP World. *Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics (ACL 2020)*, 6282–6293. https://aclanthology.org/2020.acl-main.560/

[^2]: Magueresse, A., Carles, V., & Heetderks, E. (2020). Low-resource Languages: A Review of Past Work and Future Challenges. *arXiv:2006.07264*.

[^3]: Hedderich, M. A., Lange, L., Adel, H., Strötgen, J., & Klakow, D. (2021). A Survey on Recent Approaches for Natural Language Processing in Low-Resource Scenarios. *Proceedings of NAACL-HLT 2021*. https://aclanthology.org/2021.naacl-main.201/

[^4]: Haddow, B., Bawden, R., Barone, A. V. M., Helcl, J., & Birch, A. (2022). Survey of Low-Resource Machine Translation. *arXiv:2109.00486*.

[^5]: Gala, J., et al. (2023). IndicTrans2: Towards High-Quality and Accessible Machine Translation Models for all 22 Scheduled Indian Languages. *Transactions on Machine Learning Research*. (Cited here for its Census/Scheduled-language context; full citation at [^17].)

[^6]: Chauhan, S., Saxena, S., & Daniel, P. (2021). Monolingual and Parallel Corpora for Kangri Low Resource Language. *arXiv:2103.11596*. Corpus: https://github.com/chauhanshweta/Kangri_corpus (CC0-1.0).

[^7]: Radford, A., Kim, J. W., Xu, T., Brockman, G., McLeavey, C., & Sutskever, I. (2022). Robust Speech Recognition via Large-Scale Weak Supervision. *arXiv:2212.04356*. Published at ICML 2023, PMLR 202:28492-28518.

[^8]: Ren, Y., Hu, C., Tan, X., Qin, T., Zhao, S., Zhao, Z., & Liu, T.-Y. (2021). FastSpeech 2: Fast and High-Quality End-to-End Text to Speech. *9th International Conference on Learning Representations (ICLR 2021)*.

[^9]: AI4Bharat. Indic-TTS: multispeaker text-to-speech models for Indic languages. https://ai4bharat.iitm.ac.in/ (project page; ongoing research effort, no single archival paper cited here to avoid overclaiming a specific publication).

[^10]: Agarwal, M., & Anastasopoulos, A. (2024). A Concise Survey of OCR for Low-Resource Languages. *Proceedings of the 4th Workshop on NLP for Indigenous Languages of the Americas (AmericasNLP 2024)*. https://aclanthology.org/2024.americasnlp-1.10/

[^11]: Smith, R. (2007). An Overview of the Tesseract OCR Engine. *Ninth International Conference on Document Analysis and Recognition (ICDAR 2007)*, Vol. 2, 629–633.

[^12]: Brown, T. B., et al. (2020). Language Models are Few-Shot Learners. *Advances in Neural Information Processing Systems 33 (NeurIPS 2020)*. arXiv:2005.14165.

[^13]: Lewis, P., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *Advances in Neural Information Processing Systems 33 (NeurIPS 2020)*, 9459–9474. arXiv:2005.11401.

[^14]: Conneau, A., et al. (2020). Unsupervised Cross-lingual Representation Learning at Scale. *Proceedings of ACL 2020*, 8440–8451. https://aclanthology.org/2020.acl-main.747/

[^15]: Kakwani, D., Kunchukuttan, A., Golla, S., N.C., G., Bhattacharyya, A., Khapra, M. M., & Kumar, P. (2020). IndicNLPSuite: Monolingual Corpora, Evaluation Benchmarks and Pre-trained Multilingual Language Models for Indian Languages. *Findings of the Association for Computational Linguistics: EMNLP 2020*, 4948–4961.

[^16]: Khanuja, S., et al. (2021). MuRIL: Multilingual Representations for Indian Languages. *arXiv:2103.10730*. Google Research.

[^17]: Gala, J., Chitale, P. A., AK, R., Gumma, V., Doddapaneni, S., et al. (2023). IndicTrans2: Towards High-Quality and Accessible Machine Translation Models for all 22 Scheduled Indian Languages. *Transactions on Machine Learning Research*. arXiv:2305.16307.

[^18]: Hu, E. J., Shen, Y., Wallis, P., Allen-Zhu, Z., Li, Y., Wang, S., Wang, L., & Chen, W. (2021). LoRA: Low-Rank Adaptation of Large Language Models. *arXiv:2106.09685*.

[^19]: First Attempt at Building Parallel Corpora for Machine Translation of Northeast India's Very Low-Resource Languages. (2023). *arXiv:2312.04764*. (Cited for its documented pattern of near-zero prior data availability, directly analogous to the Himachali-language situation.)

*Note on scope: this review prioritizes papers directly load-bearing for HimBhasha AI's design decisions over exhaustive theme coverage. Several themes (TTS, Indic OCR specifically) have thinner directly-applicable literature than others (LLMs, RAG, Indic NLP) — this asymmetry is reported honestly rather than padded with tangential citations.*
