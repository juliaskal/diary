from pathlib import Path
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from models import Emotion


class EmotionService:
    _emotion_model = None
    _emotion_tokenizer = None
    _emotion_device = None

    EMOTION_MODEL_PATH = Path(__file__).resolve().parents[2] / "ml" / "models" / "emotion_model"
    EMOTION_LABEL_MAP = {
        "negative": Emotion.NEGATIVE,
        "neutral": Emotion.NEUTRAL,
        "positive": Emotion.POSITIVE,
    }

    @classmethod
    def _load_emotion_model(cls):
        if cls._emotion_model is not None and cls._emotion_tokenizer is not None:
            return

        cls._emotion_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        cls._emotion_tokenizer = AutoTokenizer.from_pretrained(
            cls.EMOTION_MODEL_PATH,
            local_files_only=True,
        )
        cls._emotion_model = AutoModelForSequenceClassification.from_pretrained(
            cls.EMOTION_MODEL_PATH,
            local_files_only=True,
        )
        cls._emotion_model.to(cls._emotion_device)
        cls._emotion_model.eval()

    def predict_emotion(self, text: str) -> Emotion | None:
        normalized_text = " ".join((text or "").split())
        if not normalized_text:
            return None

        self._load_emotion_model()

        inputs = self._emotion_tokenizer(
            normalized_text,
            truncation=True,
            max_length=64,
            return_tensors="pt",
        )
        inputs = {
            key: value.to(self._emotion_device)
            for key, value in inputs.items()
        }

        with torch.no_grad():
            logits = self._emotion_model(**inputs).logits

        predicted_label_id = int(torch.argmax(logits, dim=1).item())
        predicted_label = self._emotion_model.config.id2label[predicted_label_id]
        return self.EMOTION_LABEL_MAP.get(predicted_label.lower())
