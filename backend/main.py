from fastapi import FastAPI
from pydantic import BaseModel
from backend.predictor import predict_sales
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Rossmann Sales Prediction API",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    store: int
    date: str
    promo: int
    school_holiday: int
    state_holiday: str


@app.get("/")
def home():
    return {
        "message": "Rossmann Sales Prediction API is Running 🚀"
    }


@app.post("/predict")
def predict(request: PredictionRequest):

    prediction = predict_sales(
        store_id=request.store,
        date=request.date,
        promo=request.promo,
        school_holiday=request.school_holiday,
        state_holiday=request.state_holiday
    )

    if prediction is None:
        return {
            "error": "Invalid Store ID"
        }

    return {
        "Store ID": request.store,
        "Prediction Date": request.date,
        "Predicted Sales": round(float(prediction), 2)
    }