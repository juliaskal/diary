---
license: mit
language:
- ru
metrics:
- f1
- roc_auc
- precision
- recall
pipeline_tag: text-classification
tags:
- sentiment-analysis
- multi-label-classification
- sentiment analysis
- rubert
- sentiment
- bert
- tiny
- russian
- multilabel
- classification
- emotion-classification
- emotion-recognition
- emotion
- emotion-detection
datasets:
- seara/ru_go_emotions
---

This is [RuBERT-tiny2](https://huggingface.co/cointegrated/rubert-tiny2) model fine-tuned for __emotion classification__ of short __Russian__ texts.
The task is a __multi-label classification__ with the following labels:

```yaml
0: admiration
1: amusement
2: anger
3: annoyance
4: approval
5: caring
6: confusion
7: curiosity
8: desire
9: disappointment
10: disapproval
11: disgust
12: embarrassment
13: excitement
14: fear
15: gratitude
16: grief
17: joy
18: love
19: nervousness
20: optimism
21: pride
22: realization
23: relief
24: remorse
25: sadness
26: surprise
27: neutral
```

Label to Russian label:

```yaml
admiration: восхищение
amusement: веселье
anger: злость
annoyance: раздражение
approval: одобрение
caring: забота
confusion: непонимание
curiosity: любопытство
desire: желание
disappointment: разочарование
disapproval: неодобрение
disgust: отвращение
embarrassment: смущение
excitement: возбуждение
fear: страх
gratitude: признательность
grief: горе
joy: радость
love: любовь
nervousness: нервозность
optimism: оптимизм
pride: гордость
realization: осознание
relief: облегчение
remorse: раскаяние
sadness: грусть
surprise: удивление
neutral: нейтральность
```

## Usage

```python
from transformers import pipeline
model = pipeline(model="seara/rubert-tiny2-ru-go-emotions")
model("Привет, ты мне нравишься!")
# [{'label': 'love', 'score': 0.5955629944801331}]
```

## Dataset

This model was trained on translated GoEmotions dataset called [ru_go_emotions](https://huggingface.co/datasets/seara/ru_go_emotions).

An overview of the training data can be found on [Hugging Face card](https://huggingface.co/datasets/seara/ru_go_emotions) and on 
[Github repository](https://github.com/searayeah/ru-goemotions).

## Training

Training were done in this [project](https://github.com/searayeah/bert-russian-sentiment-emotion) with this parameters:

```yaml
tokenizer.max_length: null
batch_size: 64
optimizer: adam
lr: 0.00001
weight_decay: 0
num_epochs: 31
```

## Eval results (on test split)

|              |precision|recall|f1-score|auc-roc|support|
|--------------|---------|------|--------|-------|-------|
|admiration    |0.68     |0.61  |0.64    |0.92   |504    |
|amusement     |0.8      |0.84  |0.82    |0.96   |264    |
|anger         |0.55     |0.33  |0.42    |0.9    |198    |
|annoyance     |0.56     |0.03  |0.06    |0.81   |320    |
|approval      |0.6      |0.18  |0.28    |0.78   |351    |
|caring        |0.5      |0.04  |0.07    |0.84   |135    |
|confusion     |0.77     |0.07  |0.12    |0.9    |153    |
|curiosity     |0.51     |0.34  |0.41    |0.92   |284    |
|desire        |0.71     |0.18  |0.29    |0.88   |83     |
|disappointment|0.0      |0.0   |0.0     |0.76   |151    |
|disapproval   |0.48     |0.1   |0.17    |0.85   |267    |
|disgust       |0.94     |0.12  |0.22    |0.9    |123    |
|embarrassment |0.0      |0.0   |0.0     |0.84   |37     |
|excitement    |0.81     |0.2   |0.33    |0.88   |103    |
|fear          |0.73     |0.42  |0.54    |0.92   |78     |
|gratitude     |0.95     |0.89  |0.92    |0.99   |352    |
|grief         |0.0      |0.0   |0.0     |0.76   |6      |
|joy           |0.66     |0.52  |0.58    |0.93   |161    |
|love          |0.8      |0.79  |0.79    |0.97   |238    |
|nervousness   |0.0      |0.0   |0.0     |0.81   |23     |
|optimism      |0.67     |0.41  |0.51    |0.89   |186    |
|pride         |0.0      |0.0   |0.0     |0.89   |16     |
|realization   |0.0      |0.0   |0.0     |0.7    |145    |
|relief        |0.0      |0.0   |0.0     |0.84   |11     |
|remorse       |0.59     |0.71  |0.65    |0.99   |56     |
|sadness       |0.77     |0.37  |0.5     |0.89   |156    |
|surprise      |0.59     |0.35  |0.44    |0.88   |141    |
|neutral       |0.64     |0.58  |0.61    |0.81   |1787   |
|micro avg     |0.68     |0.43  |0.53    |0.93   |6329   |
|macro avg     |0.51     |0.29  |0.33    |0.87   |6329   |
|weighted avg  |0.62     |0.43  |0.48    |0.86   |6329   |