import json
import requests
import logging
from .client import GeminiClient
from .types import GeminiChatPayload, GeminiChatResult, GeminiMessage
from .config import gemini_config

logger = logging.getLogger("gemini_service")

class GeminiService:
    def __init__(self, client: GeminiClient):
        self.client = client
        self.client.initialize()

    async def generate_content(self, prompt: str) -> GeminiChatResult:
        if not self.client._is_initialized:
            self.client.initialize()
            
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.client.model_name}:generateContent?key={self.client.api_key}"
        masked_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.client.model_name}:generateContent?key=***"
        
        logger.info(f"Gemini API request prompt: '{prompt}'")
        logger.info(f"Gemini API request model: {self.client.model_name}")
        logger.info(f"Gemini API request endpoint: {masked_url}")

        try:
            headers = {"Content-Type": "application/json"}
            data = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": gemini_config.temperature,
                    "maxOutputTokens": gemini_config.max_tokens
                }
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            logger.info(f"Gemini API response status: {response.status_code}")
            logger.info(f"Gemini API response text: {response.text}")
            
            if response.status_code != 200:
                raise RuntimeError(f"Gemini API returned status code {response.status_code}: {response.text}")
                
            res_json = response.json()
            candidates = res_json.get("candidates", [])
            if not candidates:
                raise RuntimeError(f"Gemini API response did not contain candidates content: {response.text}")
                
            response_text = candidates[0]["content"]["parts"][0]["text"]
            
            return GeminiChatResult(
                text=response_text,
                model_version=self.client.model_name
            )
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            raise e

    async def translate_text(self, text: str, src: str, target: str) -> tuple:
        if not self.client._is_initialized:
            self.client.initialize()
            
        prompt = f"Translate the following text from language code '{src}' to language code '{target}'. Provide only the translated text in the output. Text: {text}"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.client.model_name}:generateContent?key={self.client.api_key}"
        masked_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.client.model_name}:generateContent?key=***"
        
        logger.info(f"Gemini Translation API request prompt: '{prompt}'")
        logger.info(f"Gemini Translation API request model: {self.client.model_name}")
        logger.info(f"Gemini Translation API request endpoint: {masked_url}")

        try:
            headers = {"Content-Type": "application/json"}
            data = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.1,
                    "maxOutputTokens": gemini_config.max_tokens
                }
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            logger.info(f"Gemini Translation API response status: {response.status_code}")
            logger.info(f"Gemini Translation API response text: {response.text}")
            
            if response.status_code != 200:
                raise RuntimeError(f"Gemini translation returned status code {response.status_code}: {response.text}")
                
            res_json = response.json()
            candidates = res_json.get("candidates", [])
            if not candidates:
                raise RuntimeError(f"Gemini translation response did not contain candidates: {response.text}")
                
            translated = candidates[0]["content"]["parts"][0]["text"].strip()
            return translated, ""
        except Exception as e:
            logger.error(f"Gemini translation error: {e}")
            raise e