# 🛒 AI Retail Analytics Platform

An end-to-end Machine Learning web application that predicts future sales for Rossmann retail stores using historical sales data and XGBoost.

The project combines data analysis, feature engineering, machine learning, FastAPI, and a responsive web interface to provide sales predictions and business insights.

---

## 📌 Features

- 📈 Predict future store sales
- 🤖 XGBoost Regression Model
- ⚡ FastAPI REST API
- 🌐 Responsive Frontend
- 📅 Automatic Date Feature Engineering
- 🏪 Store-specific predictions
- 🎯 Business recommendations
- 📊 Prediction history
- 📉 Real-world retail analytics use case

---

## 🛠️ Tech Stack

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost

### Backend
- FastAPI
- Uvicorn

### Frontend
- HTML
- CSS
- JavaScript

---

## 📂 Project Structure

```
MachineLearningProject/
│
├── backend/
│   ├── main.py
│   ├── predictor.py
│   └── feature_engineering.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── data/
│
├── models/
│   ├── xgboost_model.pkl
│   └── feature_columns.json
│
├── notebooks/
│
├── requirements.txt
├── RUN.md
└── README.md
```

---

## 📊 Dataset

Dataset: **Rossmann Store Sales**

The dataset contains historical sales information of **1,115 Rossmann stores** including:

- Sales
- Customers
- Promotions
- Holidays
- Store information
- Competition details

---

## 🧠 Machine Learning Pipeline

- Data Cleaning
- Exploratory Data Analysis (EDA)
- Feature Engineering
- Model Training
- Model Evaluation
- XGBoost Regression
- Model Serialization
- API Development
- Frontend Integration

---

## 🚀 Run Locally

### Clone Repository

```bash
git clone https://github.com/Sumant915/AI-Retail-Analytics-Platform.git
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start Backend

```bash
python -m uvicorn backend.main:app --reload
```

### Start Frontend

```bash
cd frontend
python -m http.server 3000
```

Open:

```
http://127.0.0.1:3000
```

---

## 📸 Application

- Home Page
- Sales Prediction Form
- Prediction Result Dashboard
- Business Insights
- Prediction History

---

## 🔮 Future Improvements

- Live sales dashboard
- Interactive visualizations
- User authentication
- Cloud deployment
- Multi-store forecasting
- Inventory optimization

---

## 👨‍💻 Developer

**Sumantra Singh**

- GitHub: https://github.com/Sumant915
- LinkedIn: https://www.linkedin.com/in/sumantra-singh-a85956317

---

## 📄 License

This project is licensed under the MIT License.