from pathlib import Path
from typing import Any

import torch
from huggingface_hub import snapshot_download
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from models.domain.sentiment import Sentiment


class SentimentService:
    _emotion_direction_model = None
    _emotion_direction_tokenizer = None
    _emotion_direction_device = None

    MODEL_REPOSITORY_ID = (
        "seara/rubert-tiny2-russian-emotion-detection-ru-go-emotions"
    )
    MODEL_PATH = (
        Path(__file__).resolve().parents[2]
        / "ml"
        / "models"
        / "emotion_direction_model"
    )
    DEFAULT_THRESHOLD = 0.35
    DEFAULT_MAX_LENGTH = 128

    LABEL_TO_EMOTION_DIRECTION = {
        "admiration": Sentiment.ADMIRATION,
        "amusement": Sentiment.AMUSEMENT,
        "anger": Sentiment.ANGER,
        "annoyance": Sentiment.ANNOYANCE,
        "approval": Sentiment.APPROVAL,
        "caring": Sentiment.CARING,
        "confusion": Sentiment.CONFUSION,
        "curiosity": Sentiment.CURIOSITY,
        "desire": Sentiment.DESIRE,
        "disappointment": Sentiment.DISAPPOINTMENT,
        "disapproval": Sentiment.DISAPPROVAL,
        "disgust": Sentiment.DISGUST,
        "embarrassment": Sentiment.EMBARRASSMENT,
        "excitement": Sentiment.EXCITEMENT,
        "fear": Sentiment.FEAR,
        "gratitude": Sentiment.GRATITUDE,
        "grief": Sentiment.GRIEF,
        "joy": Sentiment.JOY,
        "love": Sentiment.LOVE,
        "nervousness": Sentiment.NERVOUSNESS,
        "optimism": Sentiment.OPTIMISM,
        "pride": Sentiment.PRIDE,
        "realization": Sentiment.REALIZATION,
        "relief": Sentiment.RELIEF,
        "remorse": Sentiment.REMORSE,
        "sadness": Sentiment.SADNESS,
        "surprise": Sentiment.SURPRISE,
        "neutral": Sentiment.NEUTRAL,
    }

    @classmethod
    def _is_model_downloaded(cls) -> bool:
        required_files = (
            "config.json",
            "tokenizer_config.json",
        )
        has_weights = (
            (cls.MODEL_PATH / "model.safetensors").exists()
            or (cls.MODEL_PATH / "pytorch_model.bin").exists()
        )
        return has_weights and all(
            (cls.MODEL_PATH / file_name).exists()
            for file_name in required_files
        )

    @classmethod
    def download_model(cls, force_download: bool = False) -> Path:
        cls.MODEL_PATH.mkdir(parents=True, exist_ok=True)
        snapshot_download(
            repo_id=cls.MODEL_REPOSITORY_ID,
            local_dir=cls.MODEL_PATH,
            force_download=force_download,
            ignore_patterns=["*.h5", "*.ot", "flax_model.msgpack"],
        )
        return cls.MODEL_PATH

    @classmethod
    def _load_model(cls, allow_download: bool = True):
        if (
            cls._emotion_direction_model is not None
            and cls._emotion_direction_tokenizer is not None
        ):
            return

        if not cls._is_model_downloaded():
            if not allow_download:
                raise FileNotFoundError(
                    "Локальная модель эмоций не найдена. "
                    "Сначала вызовите SentimentService.download_model()."
                )
            cls.download_model()

        cls._emotion_direction_device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )
        cls._emotion_direction_tokenizer = AutoTokenizer.from_pretrained(
            cls.MODEL_PATH,
            local_files_only=True,
        )
        cls._emotion_direction_model = (
            AutoModelForSequenceClassification.from_pretrained(
                cls.MODEL_PATH,
                local_files_only=True,
            )
        )
        cls._emotion_direction_model.to(cls._emotion_direction_device)
        cls._emotion_direction_model.eval()

    def predict_emotions(
        self,
        text: str,
        threshold: float = DEFAULT_THRESHOLD,
        top_k: int | None = None,
        allow_download: bool = True,
    ) -> list[dict[str, Any]]:
        normalized_text = " ".join((text or "").split())
        if not normalized_text:
            return []

        self._load_model(allow_download=allow_download)

        inputs = self._emotion_direction_tokenizer(
            normalized_text,
            truncation=True,
            max_length=self.DEFAULT_MAX_LENGTH,
            return_tensors="pt",
        )
        inputs = {
            key: value.to(self._emotion_direction_device)
            for key, value in inputs.items()
        }

        with torch.no_grad():
            logits = self._emotion_direction_model(**inputs).logits

        scores = torch.sigmoid(logits)[0].tolist()
        predictions: list[dict[str, Any]] = []
        for label_id, score in enumerate(scores):
            label = self._emotion_direction_model.config.id2label[label_id]
            if float(score) < threshold:
                continue

            predictions.append(
                {
                    "emotion": self.LABEL_TO_EMOTION_DIRECTION.get(label),
                    "label": label,
                    "score": round(float(score), 4),
                }
            )

        predictions.sort(key=lambda item: item["score"], reverse=True)
        if not predictions:
            top_label_id = int(torch.argmax(logits, dim=1).item())
            top_label = self._emotion_direction_model.config.id2label[top_label_id]
            top_score = round(float(scores[top_label_id]), 4)
            predictions.append(
                {
                    "emotion": self.LABEL_TO_EMOTION_DIRECTION.get(top_label),
                    "label": top_label,
                    "score": top_score,
                }
            )

        if top_k is not None:
            return predictions[:top_k]
        return predictions

    def predict_primary_emotion(
        self,
        text: str,
        allow_download: bool = True,
    ) -> Sentiment | None:
        predictions = self.predict_emotions(
            text=text,
            top_k=1,
            allow_download=allow_download,
        )
        if not predictions:
            return None
        return predictions[0]["emotion"]

    def predict_primary_emotion_details(
        self,
        text: str,
        allow_download: bool = True,
    ) -> dict[str, Any] | None:
        predictions = self.predict_emotions(
            text=text,
            top_k=1,
            allow_download=allow_download,
        )
        if not predictions:
            return None
        return predictions[0]
