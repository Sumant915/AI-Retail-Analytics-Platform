from datetime import datetime
import pandas as pd

def extract_date_features(date):
    date = datetime.strptime(date, "%Y-%m-%d")
    return {
        "Year": date.year,
        "Month": date.month,
        "Day": date.day,
        "DayOfWeek": date.weekday() + 1
    }

def get_season(month):
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8]:
        return "Summer"
    else:
        return "Autumn"

def calculate_competition_duration(year,month,competition_year,competition_month):
    duration = ((year-competition_year)*12)+(month-competition_month)
    return max(duration, 0)

def calculate_promo_duration(
    year,
    month,
    promo2,
    promo2_since_year,
    promo2_since_week
):

    if promo2 == 0:
        return 0

    promo_start = pd.to_datetime(
        f"{int(promo2_since_year)}-W{int(promo2_since_week):02d}-1",
        format="%G-W%V-%u",
        errors="coerce"
    )

    
    if pd.isna(promo_start):
        return 0

    duration = (
        (year - promo_start.year) * 12
        + (month - promo_start.month)
    )

    return max(duration, 0)

def is_promo_month(
    month,
    promo2,
    promo_interval
):
    if promo2 == 0:
        return 0

    month_names = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sept",
        10: "Oct",
        11: "Nov",
        12: "Dec"
    }

    # Handle missing PromoInterval
    if not promo_interval:
        return 0

    current_month = month_names[month]
    promo_months = [m.strip() for m in promo_interval.split(",")]

    return int(current_month in promo_months)

def create_features(
    store,
    date,
    promo,
    school_holiday,
    state_holiday,
    feature_columns
):

    date_features = extract_date_features(date)
    year = date_features["Year"]
    month = date_features["Month"]
    day = date_features["Day"]
    day_of_week = date_features["DayOfWeek"]

   
    # Season

    season = get_season(month)

    # Competition Duration

    competition_duration = calculate_competition_duration(
        year,
        month,
        store["CompetitionOpenSinceYear"],
        store["CompetitionOpenSinceMonth"]
    )


    # Promo Duration

    promo_duration = calculate_promo_duration(
        year,
        month,
        store["Promo2"],
        store["Promo2SinceYear"],
        store["Promo2SinceWeek"]
    )

    
    # Is Promo Month
    
    is_promo = is_promo_month(
        month,
        store["Promo2"],
        store["PromoInterval"]
    )

    # Create Feature Dictionary

    features = {
        "Store": store["Store"],
        "DayOfWeek": day_of_week,
        "Promo": promo,
        "SchoolHoliday": school_holiday,
        "CompetitionDistance": store["CompetitionDistance"],
        "Promo2": store["Promo2"],
        "Year": year,
        "Month": month,
        "Day": day,
        "CompetitionDuration": competition_duration,
        "PromoDuration": promo_duration,
        "IsPromoMonth": is_promo
    }

    # State Holiday Encoding

    features["StateHoliday_a"] = int(state_holiday == "a")
    features["StateHoliday_b"] = int(state_holiday == "b")
    features["StateHoliday_c"] = int(state_holiday == "c")

    # Store Type Encoding
    
    features["StoreType_b"] = int(store["StoreType"] == "b")
    features["StoreType_c"] = int(store["StoreType"] == "c")
    features["StoreType_d"] = int(store["StoreType"] == "d")

    # Assortment Encoding

    features["Assortment_b"] = int(store["Assortment"] == "b")
    features["Assortment_c"] = int(store["Assortment"] == "c")

    # Season Encoding

    features["Season_Spring"] = int(season == "Spring")
    features["Season_Summer"] = int(season == "Summer")
    features["Season_Winter"] = int(season == "Winter")

    # Convert dictionary to DataFrame
    features_df = pd.DataFrame([features])

    # Arrange columns in training order
    features_df = features_df.reindex(columns=feature_columns, fill_value=0)

    return features_df