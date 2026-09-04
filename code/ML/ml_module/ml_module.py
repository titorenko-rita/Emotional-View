import os
from collections import Counter

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


POSITIVE_EMOTIONS = {"Happy", "Surprise"}
NEGATIVE_EMOTIONS = {"Sad", "Angry", "Fear", "Disgust"}
NEUTRAL_EMOTIONS = {"Neutral"}


def turbo_ml_func(dict_file):
    """
    Rule-based satisfaction scoring.

    Input:
        dict_file = {
            "emot": [
                {"time": "...", "emotion": "Happy", "number": 2},
                ...
            ]
        }

    Output:
        0 - not satisfied
        1 - partially satisfied
        2 - fully satisfied
    """

    emot_list = dict_file.get("emot", [])

    if not emot_list:
        print("[RULE_ML] Empty emot list -> return 1")
        return 1

    emotions = [item.get("emotion", "Neutral") for item in emot_list]
    total = len(emotions)

    counts = Counter(emotions)

    positive_count = sum(counts[e] for e in POSITIVE_EMOTIONS)
    negative_count = sum(counts[e] for e in NEGATIVE_EMOTIONS)
    neutral_count = sum(counts[e] for e in NEUTRAL_EMOTIONS)

    positive_ratio = positive_count / total
    negative_ratio = negative_count / total
    neutral_ratio = neutral_count / total

    # --- Tail analysis: last 30% of session matters more ---
    tail_size = max(1, round(total * 0.3))
    tail = emotions[-tail_size:]
    tail_counts = Counter(tail)

    tail_positive = sum(tail_counts[e] for e in POSITIVE_EMOTIONS) / len(tail)
    tail_negative = sum(tail_counts[e] for e in NEGATIVE_EMOTIONS) / len(tail)

    # --- Beginning/end trend ---
    head_size = max(1, round(total * 0.3))
    head = emotions[:head_size]
    head_counts = Counter(head)

    head_positive = sum(head_counts[e] for e in POSITIVE_EMOTIONS) / len(head)
    head_negative = sum(head_counts[e] for e in NEGATIVE_EMOTIONS) / len(head)

    print("\n[RULE_ML] ===== NEW SESSION =====")
    print(f"[RULE_ML] total={total}")
    print(f"[RULE_ML] counts={dict(counts)}")
    print(
        f"[RULE_ML] positive_ratio={positive_ratio:.3f}, "
        f"negative_ratio={negative_ratio:.3f}, "
        f"neutral_ratio={neutral_ratio:.3f}"
    )
    print(
        f"[RULE_ML] head_positive={head_positive:.3f}, head_negative={head_negative:.3f}"
    )
    print(
        f"[RULE_ML] tail_positive={tail_positive:.3f}, tail_negative={tail_negative:.3f}"
    )

    # -------------------------------------------------------
    # Rule 1. Strong negative session
    # -------------------------------------------------------
    if negative_ratio >= 0.50:
        print("[RULE_ML] Rule 1 -> 0 (strong negative ratio)")
        return 0

    # -------------------------------------------------------
    # Rule 2. Strong positive session
    # -------------------------------------------------------
    if positive_ratio >= 0.65:
        print("[RULE_ML] Rule 2 -> 2 (strong positive ratio)")
        return 2

    # -------------------------------------------------------
    # Rule 3. End became clearly worse
    # -------------------------------------------------------
    if tail_negative >= 0.50 and tail_negative > tail_positive:
        print("[RULE_ML] Rule 3 -> 0 (negative ending)")
        return 0

    # -------------------------------------------------------
    # Rule 4. End became clearly better
    # -------------------------------------------------------
    if tail_positive >= 0.40 and tail_positive > tail_negative:
        print("[RULE_ML] Rule 4 -> 2 (positive ending)")
        return 2

    # -------------------------------------------------------
    # Rule 5. Strong improvement from start to end
    # -------------------------------------------------------
    if tail_positive - head_positive >= 0.25 and tail_negative <= head_negative:
        print("[RULE_ML] Rule 5 -> 2 (improvement by end)")
        return 2

    # -------------------------------------------------------
    # Rule 6. Strong deterioration from start to end
    # -------------------------------------------------------
    if tail_negative - head_negative >= 0.25 and tail_positive <= head_positive:
        print("[RULE_ML] Rule 6 -> 0 (deterioration by end)")
        return 0

    # -------------------------------------------------------
    # Rule 7. Mostly neutral or mixed session
    # -------------------------------------------------------
    print("[RULE_ML] Rule 7 -> 1 (mixed / mostly neutral)")
    return 1