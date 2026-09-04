import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler


def load_data(file_path):
    df = file_path.copy()

    df = pd.concat([df['emot'].apply(pd.Series), df], axis=1).drop('emot', axis=1)

    df['time'] = df['time'].str.split().str[-1]
    df['time'] = pd.to_datetime(df['time'], format='%H:%M:%S')

    print("\n[UTILS] load_data result:")
    print(df)

    return df


def preprocess_data(df):
    df = df.copy()

    first_time_value = df['time'].iloc[0]
    last_time_value = df['time'].iloc[-1]

    df['start time'] = first_time_value
    df['end time'] = last_time_value

    df['start time'] = pd.to_datetime(df['start time'], format='%H:%M:%S')
    df['time'] = pd.to_datetime(df['time'], format='%H:%M:%S')
    df['time'] = (df['time'] - df['start time']).dt.total_seconds()

    X = df[['number', 'time']]

    print("\n[UTILS] Before scaling X:")
    print(X)

    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    print("\n[UTILS] After scaling X:")
    print(X)

    return X


def predict_labels(model, X):
    predictions = model.predict(X, verbose=0)
    predicted_labels = np.argmax(predictions, axis=1)
    return predicted_labels, predictions


def round_and_format_predictions(predictions):
    rounded_arr = np.round(predictions, decimals=5)
    formatted_arr = [[f'{num:.5f}' for num in row] for row in rounded_arr]
    return formatted_arr