import os
import inspect
import math
import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from datasets import Dataset
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    DataCollatorWithPadding,
    TrainingArguments,
    Trainer
)

# =====================
# CONFIG
# =====================
DATA_PATH = "ml/data/sentiment_dataset.csv"
MODEL_NAME = "DeepPavlov/rubert-base-cased"
OUTPUT_DIR = "ml/models/emotion_model"

EPOCHS = 3
BATCH_SIZE = 8
LEARNING_RATE = 2e-5
MAX_LENGTH = 64
SAVE_STEPS = 100
LOGGING_STEPS = 50


def resolve_model_path():
    hub_root = os.path.join(
        os.path.expanduser("~"),
        ".cache",
        "huggingface",
        "hub",
        "models--DeepPavlov--rubert-base-cased",
    )
    ref_path = os.path.join(hub_root, "refs", "main")

    if os.path.exists(ref_path):
        with open(ref_path, "r", encoding="utf-8") as f:
            snapshot = f.read().strip()
        snapshot_path = os.path.join(hub_root, "snapshots", snapshot)
        if os.path.isdir(snapshot_path):
            return snapshot_path

    return MODEL_NAME


# =====================
# LOAD DATA
# =====================
def load_data():
    print("[LOAD] Loading dataset...")
    df = pd.read_csv(DATA_PATH)

    if "src" not in df.columns:
        raise KeyError("Column 'src' not found in dataset")

    df = df.groupby("src", group_keys=False).apply(
        lambda group: group.sample(
            n=max(1, math.ceil(len(group) * 0.05)),
            random_state=42
        )
    ).reset_index(drop=True)

    # ожидаем колонки: text, label
    df = df[["text", "label"]]

    # убираем мусор
    df = df[df["label"] != "skip"]
    df = df.dropna()

    print("[OK] Dataset loaded")
    print(df["label"].value_counts())

    return df


# =====================
# PREPROCESS
# =====================
def preprocess(df):
    print("[PREP] Preprocessing...")

    # если метки числа — мапим вручную
    mapping = {
        0: "negative",
        1: "neutral",
        2: "positive"
    }

    if df["label"].dtype != object:
        df["label"] = df["label"].map(mapping)

    labels = sorted(df["label"].unique())

    label2id = {label: int(i) for i, label in enumerate(labels)}
    id2label = {int(i): label for label, i in label2id.items()}

    df["label_id"] = df["label"].map(label2id)

    print("[LABELS]", label2id)

    return df, label2id, id2label


# =====================
# SPLIT
# =====================
def split_data(df):
    print("[SPLIT] Splitting dataset...")

    train_df, test_df = train_test_split(
        df,
        test_size=0.1,
        stratify=df["label_id"],
        random_state=42
    )

    return train_df, test_df


# =====================
# TOKENIZATION
# =====================
def tokenize_datasets(train_df, test_df, tokenizer):
    print("[TOKENIZE] Tokenizing...")

    train_dataset = Dataset.from_pandas(train_df)
    test_dataset = Dataset.from_pandas(test_df)

    def tokenize(batch):
        return tokenizer(
            batch["text"],
            truncation=True,
            max_length=MAX_LENGTH
        )

    train_dataset = train_dataset.map(tokenize, batched=True)
    test_dataset = test_dataset.map(tokenize, batched=True)

    train_dataset.set_format(
        type="torch",
        columns=["input_ids", "attention_mask", "label_id"]
    )
    test_dataset.set_format(
        type="torch",
        columns=["input_ids", "attention_mask", "label_id"]
    )

    train_dataset = train_dataset.rename_column("label_id", "labels")
    test_dataset = test_dataset.rename_column("label_id", "labels")

    return train_dataset, test_dataset


# =====================
# TRAIN
# =====================
def train_model(train_dataset, test_dataset, tokenizer, label2id, id2label):
    print("[MODEL] Loading model...")
    model_path = resolve_model_path()
    use_fp16 = torch.cuda.is_available()

    model = AutoModelForSequenceClassification.from_pretrained(
        model_path,
        num_labels=len(label2id),
        id2label=id2label,
        label2id=label2id,
        local_files_only=True
    )

    training_kwargs = {
        "output_dir": OUTPUT_DIR,
        "learning_rate": LEARNING_RATE,
        "per_device_train_batch_size": BATCH_SIZE,
        "per_device_eval_batch_size": BATCH_SIZE,
        "num_train_epochs": EPOCHS,
        "fp16": use_fp16,
        "save_strategy": "steps",
        "save_steps": SAVE_STEPS,
        "logging_strategy": "steps",
        "logging_steps": LOGGING_STEPS,
        "load_best_model_at_end": True,
        "metric_for_best_model": "eval_loss",
        "greater_is_better": False,
        "report_to": "none",
    }

    # transformers 4.x used evaluation_strategy, 5.x uses eval_strategy
    training_signature = inspect.signature(TrainingArguments.__init__)
    if "eval_strategy" in training_signature.parameters:
        training_kwargs["eval_strategy"] = "steps"
        training_kwargs["eval_steps"] = SAVE_STEPS
    else:
        training_kwargs["evaluation_strategy"] = "steps"
        training_kwargs["eval_steps"] = SAVE_STEPS

    training_args = TrainingArguments(**training_kwargs)

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
        data_collator=DataCollatorWithPadding(tokenizer=tokenizer),
    )

    print("[TRAIN] Training started...")
    trainer.train()

    print("[EVAL] Evaluating...")
    metrics = trainer.evaluate()
    print(metrics)

    return model, trainer


# =====================
# SAVE
# =====================
def save_model(model, tokenizer):
    print("[SAVE] Saving model...")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

    print(f"[OK] Model saved to {OUTPUT_DIR}")


# =====================
# MAIN
# =====================
def main():
    df = load_data()
    df, label2id, id2label = preprocess(df)
    train_df, test_df = split_data(df)

    tokenizer = AutoTokenizer.from_pretrained(
        resolve_model_path(),
        fix_mistral_regex=True,
        local_files_only=True
    )

    train_dataset, test_dataset = tokenize_datasets(
        train_df, test_df, tokenizer
    )

    model, _ = train_model(
        train_dataset, test_dataset, tokenizer, label2id, id2label
    )

    save_model(model, tokenizer)


if __name__ == "__main__":
    main()
