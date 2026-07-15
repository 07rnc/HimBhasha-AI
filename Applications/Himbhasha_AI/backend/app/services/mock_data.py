import re
import uuid

# Seed translation dictionaries
TRANSLATIONS = {
    "english": {
        "hello": {"hindi": "नमस्ते", "kangdi": "नमस्ते / बंदगी", "pron": "nuh-muh-steh / buhn-duh-gee"},
        "how are you": {"hindi": "आप कैसे हैं?", "kangdi": "तुहाड़ा क्या हाल है?", "pron": "tuh-haa-daa kyaa haal hai"},
        "thank you": {"hindi": "धन्यवाद", "kangdi": "धन्यवाद / मेहरबानी", "pron": "dhuh-nyuh-vaad / meh-ruhr-baa-nee"},
        "what are you doing": {"hindi": "आप क्या कर रहे हैं?", "kangdi": "तूं क्या करदा है?", "pron": "toon kyaa kur-daa hai"},
        "sit down": {"hindi": "बैठिए", "kangdi": "बैठी जा ग्या भाई", "pron": "bai-thee jaa gyaa bhaa-ee"},
        "i am going": {"hindi": "मैं जा रहा हूँ", "kangdi": "मैं घरे जो जादा है", "pron": "main ghuh-reh joh jaa-daa hai"},
        "water": {"hindi": "पानी", "kangdi": "पाणी", "pron": "paa-nee"},
        "food": {"hindi": "खाना", "kangdi": "रोटी", "pron": "roh-tee"},
        "winter": {"hindi": "सर्दी", "kangdi": "स्याल", "pron": "syaal"},
        "snow": {"hindi": "बर्फ", "kangdi": "बरफ", "pron": "buh-ruhf"},
        "mountain": {"hindi": "पहाड़", "kangdi": "धार", "pron": "dhaar"}
    },
    "hindi": {
        "नमस्ते": {"english": "Hello", "kangdi": "नमस्ते / बंदगी", "pron": "nuh-muh-steh / buhn-duh-gee"},
        "आप कैसे हैं": {"english": "How are you?", "kangdi": "तुहाड़ा क्या हाल है?", "pron": "tuh-haa-daa kyaa haal hai"},
        "धन्यवाद": {"english": "Thank you", "kangdi": "धन्यवाद / मेहरबानी", "pron": "dhuh-nyuh-vaad / meh-ruhr-baa-nee"},
        "क्या कर रहे हैं": {"english": "What are you doing?", "kangdi": "तूं क्या करदा है?", "pron": "toon kyaa kur-daa hai"},
        "बैठिए": {"english": "Sit down", "kangdi": "बैठी जा ग्या भाई", "pron": "bai-thee jaa gyaa bhaa-ee"},
        "जा रहा हूँ": {"english": "I am going", "kangdi": "मैं घरे जो जादा है", "pron": "main ghuh-reh joh jaa-daa hai"},
        "पानी": {"english": "Water", "kangdi": "पाणी", "pron": "paa-nee"},
        "खाना": {"english": "Food", "kangdi": "रोटी", "pron": "roh-tee"},
        "सर्दी": {"english": "Winter", "kangdi": "स्याल", "pron": "syaal"},
        "बर्फ": {"english": "Snow", "kangdi": "बरफ", "pron": "buh-ruhf"},
        "पहाड़": {"english": "Mountain", "kangdi": "धार", "pron": "dhaar"}
    },
    "kangdi": {
        "बंदगी": {"english": "Hello", "hindi": "नमस्ते", "pron": "buhn-duh-gee"},
        "हाल है": {"english": "How are you?", "hindi": "आप कैसे हैं?", "pron": "tuh-haa-daa kyaa haal hai"},
        "मेहरबानी": {"english": "Thank you", "hindi": "धन्यवाद", "pron": "dhuh-nyuh-vaad / meh-ruhr-baa-nee"},
        "करदा है": {"english": "What are you doing?", "hindi": "आप क्या कर रहे हैं?", "pron": "toon kyaa kur-daa hai"},
        "बैठी जा": {"english": "Sit down", "hindi": "बैठिए", "pron": "bai-thee jaa gyaa bhaa-ee"},
        "जादा है": {"english": "I am going", "hindi": "मैं जा रहा हूँ", "pron": "main ghuh-reh joh jaa-daa hai"},
        "पाणी": {"english": "Water", "hindi": "पानी", "pron": "paa-nee"},
        "रोटी": {"english": "Food", "hindi": "खाना", "pron": "roh-tee"},
        "स्याल": {"english": "Winter", "hindi": "सर्दी", "pron": "syaal"},
        "बरफ": {"english": "Snow", "hindi": "बर्फ", "pron": "buh-ruhf"},
        "धार": {"english": "Mountain", "hindi": "पहाड़", "pron": "dhaar"}
    }
}

# General conversational queries answered by Vaani
CHAT_RESPONSES = [
    {"pattern": r"hello|hi|hey|नमस्ते|बंदगी", "response": "बंदगी! मैं वाणी हूँ। मैं कांगड़ी सीखने और अनुवाद करने में आपकी मदद कर सकती हूँ। आज हम क्या बातचीत करेंगे?"},
    {"pattern": r"how are you|क्या हाल है", "response": "मेरा हाल बहुत खरा (अच्छा) है! आप बताइए, आपका क्या हाल है?"},
    {"pattern": r"learn|सिखना|कांगड़ी", "response": "कांगड़ी हिमाचल प्रदेश की एक बहुत ही सुंदर और समृद्ध भाषा है। शुरुआत करने के लिए आप 'Learn' मॉड्यूल में जाकर अभिवादन और दैनिक वाक्यों का अभ्यास कर सकते हैं।"},
    {"pattern": r"weather|मौसम|स्याल", "response": "हिमाचल का मौसम आज सुहावना है! पहाड़ों (धारों) पर ठंडी हवा चल रही है और स्याल (सर्दियों) में बर्फबारी की संभावना रहती है।"},
    {"pattern": r"food|खाना|मदरा|धाम", "response": "हिमाचली खाना बहुत स्वादिष्ट होता है, विशेषकर कांगड़ी धाम! क्या आपने कभी मदरा या बबरू खाया है?"},
    {"pattern": r"preserve|बचाना|योगदान", "response": "कांगड़ी भाषा को भावी पीढ़ी के लिए सहेजने में आपका योगदान अमूल्य है। आप 'Preserve Our Language' मॉड्यूल में जाकर अपनी स्थानीय कहानियाँ या मुहावरे रिकॉर्ड करके भेज सकते हैं।"}
]

DEFAULT_CHAT_RESPONSE = "मुझे आपकी बात सुनकर खुशी हुई। कांगड़ी भाषा के बारे में कुछ और पूछें या 'Translate' मॉड्यूल का उपयोग करके अनुवाद करें।"

# A short mock base64 audio representation of silent audio to fulfill Voice TTS requirement without bloating codebase
MOCK_AUDIO_BASE64 = (
    "UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA"
)

def get_chat_response(message: str) -> str:
    message_lower = message.lower()
    for item in CHAT_RESPONSES:
        if re.search(item["pattern"], message_lower):
            return item["response"]
    return DEFAULT_CHAT_RESPONSE

def get_translation(text: str, src: str, target: str) -> tuple:
    text_clean = text.strip().lower()
    src = src.lower()
    target = target.lower()
    
    # Try searching dictionaries
    for key, dict_val in TRANSLATIONS.get(src, {}).items():
        if key in text_clean:
            match = dict_val
            translated_text = match.get(target, f"[Translated {text} to {target}]")
            pron = match.get("pron", "") if target == "kangdi" or src == "kangdi" else ""
            return translated_text, pron
            
    # Simple Fallback translation mocks
    if target == "kangdi":
        return f"{text} (कांगड़ी अनुवाद)", "kuh-nuhk-dee"
    elif target == "hindi":
        return f"{text} (हिंदी अनुवाद)", None
    else:
        return f"Translated: {text}", None

def get_voice_response(audio_base64: str) -> tuple:
    # Simulates transcribing audio and answering from Vaani
    # Default transcription and response
    transcription = "तुहाड़ा क्या हाल है?"
    response = "मेरा हाल बहुत खरा है! आप बताइए, आपका क्या हाल है?"
    return transcription, response, MOCK_AUDIO_BASE64

def process_document_action(file_name: str, action: str, question: str = None) -> str:
    if action == "summarize":
        return (
            f"यह दस्तावेज़ '{file_name}' हिमाचल प्रदेश में कृषि सुधारों और फसल सिंचाई योजनाओं के बारे में है। "
            f"इसमें कांगड़ा घाटी में सिंचाई पंपों की सब्सिडी के बारे में विस्तार से बताया गया है। "
            f"मुख्य निष्कर्ष: 1. किसानों को सोलर पंप पर 80% छूट। 2. आवेदन पत्र पंचायत कार्यालय में पटवारी के माध्यम से जमा होंगे।"
        )
    elif action == "translate":
        return (
            f"दस्तावेज़ का कांगड़ी अनुवाद:\n\n"
            f"\"कणक दी फसल तैयार है और पंचायत दफ्तर च पानी दी सरकारी स्कीम दा काम शुरू होई ग्या है।\""
        )
    elif action == "ask":
        q_lower = question.lower() if question else ""
        if "crop" in q_lower or "फसल" in q_lower:
            return "दस्तावेज़ के अनुसार, रबी की मुख्य फसल 'कणक' (गेंहू) है, और इसके लिए सिंचाई की स्कीम पंचायत द्वारा लागू की गई है।"
        elif "where" in q_lower or "कहाँ" in q_lower or "office" in q_lower:
            return "दस्तावेज़ में उल्लेख है कि सभी प्रकार के आवेदन स्थानीय पंचायत दफ्तर में जाकर जमा करने होंगे।"
        else:
            return f"आपके प्रश्न '{question}' का उत्तर: दस्तावेज़ सिंचाई सोलर पंपों पर किसानों को मिलने वाली 80% की छूट के बारे में जानकारी प्रदान करता है।"
    return "Invalid document action requested."
