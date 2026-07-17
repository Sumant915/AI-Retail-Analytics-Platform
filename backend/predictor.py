import joblib
import json
import pandas as pd
from backend.feature_engineering import create_features
# ==========================
# Load Trained Model
# ==========================

model = joblib.load("models/xgboost_model.pkl")

# ==========================
# Load Feature Columns
# ==========================

with open("models/feature_columns.json", "r") as f:
    feature_columns = json.load(f)

# ==========================
# Load Store Dataset
# ==========================

store_df = pd.read_csv("data/store.csv")

# ==========================
# Get Store Information
# ==========================
# Fill missing values
store_df["CompetitionDistance"].fillna(
    store_df["CompetitionDistance"].median(),
    inplace=True
)

store_df["CompetitionOpenSinceMonth"].fillna(
    store_df["CompetitionOpenSinceMonth"].median(),
    inplace=True
)

store_df["CompetitionOpenSinceYear"].fillna(
    store_df["CompetitionOpenSinceYear"].median(),
    inplace=True
)

store_df["PromoInterval"] = store_df["PromoInterval"].fillna("")

def get_store_info(store_id):
    """
    Returns store information for the given Store ID.
    """

    store_info = store_df[store_df["Store"] == store_id]

    if store_info.empty:
        return None

    return store_info.iloc[0]

def predict_sales(
    store_id,
    date,
    promo,
    school_holiday,
    state_holiday
):
    # Get store information
    store = get_store_info(store_id)

    if store is None:
        return None

    # Create feature vector
    features = create_features(
        store,
        date,
        promo,
        school_holiday,
        state_holiday,
        feature_columns
    )

    # Predict sales
    prediction = model.predict(features)
    return prediction[0]