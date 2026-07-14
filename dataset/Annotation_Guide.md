# Annotation Guide – HIMCorpus

## Overview

This guide establishes the annotation standards for the HIMCorpus dataset. Consistent annotation is critical to ensure that dataset entries can be correctly used by the **HIMCorpus Knowledge Layer**, conversational AI agents, and NLP models in the **HimBhasha AI** ecosystem.

This document outlines:
1. **Domain Labeling Standards**
2. **Intent Classification Taxonomy**
3. **Language Tagging & Script Conventions**
4. **Speaker & Location Metadata Logging**
5. **Pronunciation Transliteration System**

---

# 1. Domain Labeling Standards

Domains categorize the context of a phrase. In HIMCorpus, domain names must align with the folder names and must be lowercase strings.

| Domain Name | Directory Name | Scope & Examples |
| ----------- | -------------- | ---------------- |
| `greetings` | `Greetings/` | Openings, closings, blessings, and social etiquette |
| `daily_conversation` | `Daily_Conversation/` | Small talk, statements, request patterns, and agreement/disagreement |
| `education` | `Education/` | Classroom interactions, school subjects, and learning instructions |
| `healthcare` | `Healthcare/` | Physical symptoms, medical treatments, body parts, and clinical settings |
| `agriculture` | `Agriculture/` | Farming cycles, crops, livestock, traditional implements, and weather/soil |
| `government` | `Government/` | Schemes, administrative procedures, official offices, and certificates |
| `tourism` | `Tourism/` | Landmarks, hospitality, travel directions, and local attractions |
| `culture` | `Culture/` | Local folklore, festivals (e.g., Sair), custom rituals, and traditional dress |
| `emergency` | `Emergency/` | Safety concerns, medical distress, fires, and requesting urgent assistance |
| `numbers` | `Numbers/` | Counting, measurements, dates, currencies, and time expressions |
| `verbs` | `Verbs/` | Core actions (e.g., to go, to sit, to speak) used in everyday syntax |
| `questions` | `Questions/` | Sentence structures using wh-words (e.g., who, why, where) |
| `family` | `Family/` | Kinship vocabulary, naming relationships, and family contexts |
| `food` | `Food/` | Local cuisine (e.g., Siddu, Madra), ingredients, cooking methods, and tastes |
| `weather` | `Weather/` | Seasons, temperature, atmospheric conditions, and geographical events |

---

# 2. Intent Classification Taxonomy

Intents identify the specific communicative goal of a phrase. Every domain has a predefined list of allowed intents. Using intents outside this taxonomy is disallowed without schema extensions.

### Complete Intent Taxonomy Table

| Domain | Intent Label | Purpose | Example English Phrase |
| ------ | ------------ | ------- | ---------------------- |
| **greetings** | `greet` | Normal greetings | "Hello / How are you?" |
| | `farewell` | Parting phrases | "Goodbye / See you again." |
| | `welcome` | Welcoming a guest | "Welcome to our home." |
| | `thanks` | Expressing gratitude | "Thank you very much." |
| | `blessing` | Traditional blessings | "May God keep you happy." |
| **daily_conversation** | `small_talk` | Informal interactions | "What are you doing today?" |
| | `request` | Requesting something | "Please give me some water." |
| | `agreement` | Agreeing to a point | "Yes, that is correct." |
| | `disagreement` | Disagreeing or declining | "No, I do not think so." |
| | `apology` | Asking for forgiveness | "Forgive me, I made a mistake." |
| **education** | `classroom` | School environment terms | "Open your textbooks." |
| | `subject` | Specific fields of study | "I am learning science." |
| | `instruction` | Educational commands | "Listen carefully to this." |
| | `question` | Educational inquiry | "What is the capital of Himachal?" |
| | `praise` | Encouragement | "Well done, keep it up!" |
| **healthcare** | `symptom` | Medical complaints | "I have a severe headache." |
| | `treatment` | Clinical actions | "Apply this ointment daily." |
| | `appointment` | Doctor visit scheduling | "We need to visit the hospital." |
| | `medicine` | Pharmaceuticals/herbs | "Take this tablet after dinner." |
| | `body_part` | Anatomy terms | "My leg is hurting." |
| **agriculture** | `crop` | Cultivated produce | "The wheat crop is ready." |
| | `harvest` | Cutting and gathering | "We will harvest next week." |
| | `irrigation` | Watering fields | "Turn on the water pump." |
| | `livestock` | Farm animals | "Take the cows to graze." |
| | `tool` | Farm machinery/utensils | "Clean the plough before use." |
| **government** | `document` | Official certificates/forms | "Apply for a Bonafide Himachali certificate." |
| | `scheme` | Government welfare plans | "This scheme helps local farmers." |
| | `office` | Administrative offices | "Go to the Panchayat office." |
| | `official` | Officers/representatives | "Speak with the Patwari." |
| | `application` | Formal requests | "Submit your application form." |
| **tourism** | `direction` | Navigating landscapes | "Where is the temple located?" |
| | `accommodation` | Stays and hotels | "Is there a guest house nearby?" |
| | `attraction` | Sightseeing places | "This is a historical fort." |
| | `transport` | Bus, taxi, and road travel | "When does the bus to Kangra arrive?" |
| | `food_recommendation` | Local dining suggestions | "Where can I get traditional Dham?" |
| **culture** | `festival` | Seasonal celebrations | "Today is the Sair festival." |
| | `ritual` | Customary ceremonies | "This ritual is done for good luck." |
| | `folklore` | Oral storytelling/music | "Sing a traditional Himachali song." |
| | `tradition` | Customs/practices | "This is our ancestral tradition." |
| | `costume` | Clothes and jewelry | "Wear the traditional Dhatu." |
| **emergency** | `help` | General emergency cries | "Please help me quickly!" |
| | `fire` | Fire disasters | "There is a fire in the forest." |
| | `accident` | Vehicular or falling accident | "An accident happened on the road." |
| | `medical_emergency` | Serious health events | "Call an ambulance immediately." |
| | `police` | Crime or law enforcement | "Inform the police about this." |
| **numbers** | `cardinal` | Direct count numbers | "One, two, three, four." |
| | `ordinal` | Sequence numbers | "First, second, third, fourth." |
| | `measurement` | Quantifying quantities | "Five kilograms of apples." |
| | `quantity` | Comparative amounts | "Give me a little bit more." |
| | `time` | Time, days, and clocks | "It is five o'clock in the evening." |
| **verbs** | `movement` | Locomotion actions | "He is walking home." |
| | `communication` | Speaking, listening | "Listen to what I am saying." |
| | `daily_action` | Common activities | "I wake up early in the morning." |
| | `eating` | Consuming meals | "Drink some tea." |
| | `working` | Labor and tasks | "He works in the government office." |
| **questions** | `what` / `where` / `when` / `how` / `why` / `who` | Standard query syntax | "What is your name?" / "Where are you going?" / "Why are you crying?" |
| **family** | `relation` | Blood/marital relations | "She is my sister-in-law." |
| | `address` | Vocatives and address terms | "Uncle, please listen." |
| | `kinship` | Family tree terms | "Our joint family lives here." |
| | `marriage` | Wedlock and rituals | "They are hosting a wedding feast." |
| | `age_group` | Generation categories | "Children are playing outside." |
| **food** | `dish` | Specific prepared meals | "Today we cooked Madra." |
| | `ingredient` | Spices, grains, pulses | "Add mustard oil to the pan." |
| | `taste` | Flavor categories | "This mango is very sweet." |
| | `cooking` | Preparation techniques | "Knead the flour for babru." |
| | `meal` | Dining times | "Come, let's have dinner." |
| **weather** | `condition` | Rain, sun, wind states | "It is raining heavily." |
| | `season` | Local seasonal patterns | "Winter is very cold here." |
| | `forecast` | Future weather notices | "It might snow tomorrow." |
| | `temperature` | Heat and cold readings | "It is very warm today." |
| | `natural_event` | Landslides, storms, floods | "The road is blocked by a landslide." |

---

# 3. Language Tagging & Script Conventions

To avoid ambiguity in corpus management, transcription must strictly follow these orthographic guidelines:

### A. Devanagari Script Representation
* All regional languages (Kangdi, Mandeali, Kulluvi, Chambeali, Sirmauri) except Bhoti must be transcribed in the **Devanagari script**.
* Standard Devanagari Unicode characters must be used. Avoid combining characters in non-standard ways.
* **Nukta (़)**: Use the Nukta for sounds specific to Himachali dialects that are not present in standard Hindi, such as retroflex lateral flaps.

### B. Bhoti Language Script Representation
* Bhoti must be transcribed in the **Tibetan script** (Uchen script) in its respective column, with standard Unicode formatting.
* A Romanized transliteration must be included in the `pronunciation` column.

### C. Orthography Cleanliness
* No special characters or symbols (such as `#`, `@`, `$`, `*`) are allowed in the language text fields.
* Punctuation is limited to standard Devanagari danda (`।`) and double danda (`॥`) for sentence completions. Commas (`,`) may be used for clause separation.

---

# 4. Speaker & Location Metadata Logging

Metadata adds academic and operational value to the corpus, helping researchers study dialect geography.

```text
Location Hierarchy:
State (Himachal Pradesh) ──► District ──► Tehsil ──► Village/Town
```

* **speaker_age**: Record the exact age of the native speaker. If unknown, record the best estimate. Do not leave blank if the source is `native_speaker`.
* **speaker_gender**: Must be lowercase `male`, `female`, or `other`.
* **district**: Must match one of the 12 official districts of Himachal Pradesh:
  * `Bilaspur`, `Chamba`, `Hamirpur`, `Kangra`, `Kinnaur`, `Kullu`, `Lahaul and Spiti`, `Mandi`, `Shimla`, `Sirmaur`, `Solan`, `Una`.
* **village**: Record the local village or ward name along with the nearest post office (e.g., `Dharamkot`, `Gaggal`, `Pragpur`).

---

# 5. Pronunciation Transliteration System

HIMCorpus uses the **Simplified Devanagari Pronunciation System (SDPS)** for its romanization column, making pronunciation guides readable for general users while remaining useful for AI TTS/STT training.

### Key Rules:
1. **Lowercase**: All text must be in lowercase.
2. **Syllable Separation**: Syllables must be separated by hyphens (e.g., `kaang-di`).
3. **Accent/Stress Capitalization**: The stressed syllable can be capitalized for clarity (e.g., `kaang-DI`).
4. **Devanagari Vowel Mapping**:
   * अ = `uh`
   * आ = `aa`
   * इ = `i`
   * ई = `ee`
   * उ = `u`
   * ऊ = `oo`
   * ए = `eh`
   * ऐ = `ai`
   * ओ = `oh`
   * औ = `au`
5. **Devanagari Consonant Mapping**:
   * ख = `kh`, छ = `chh`, थ = `th`, फ = `ph`, घ = `gh`, झ = `jh`, ढ = `dh`, भ = `bh`
   * Retroflexes (ट, ठ, ड, ढ, ण) must be represented clearly (e.g., `t`, `th`, `d`, `dh`, `n`) and described in dialect notes if they carry distinct phonetic weight.
   * Flaps (ड़, ढ़) are mapped to `rd` and `rdh` respectively.
