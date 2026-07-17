const form = document.getElementById("predictionForm");
const predictBtn = document.getElementById("predictBtn");
const resetBtn = document.getElementById("resetBtn");
const spinner = document.getElementById("spinner");
const statusMessage = document.getElementById("statusMessage");
const resultCard = document.getElementById("resultCard");
const predictionAmount = document.getElementById("predictionAmount");
const resultStore = document.getElementById("resultStore");
const resultDate = document.getElementById("resultDate");
const resultPromo = document.getElementById("resultPromo");
const resultSchoolHoliday = document.getElementById("resultSchoolHoliday");
const resultStateHoliday = document.getElementById("resultStateHoliday");
const resultResponseTime = document.getElementById("resultResponseTime");
const resultBackendStatus = document.getElementById("resultBackendStatus");
const summaryForecast = document.getElementById("summaryForecast");
const summaryPromotion = document.getElementById("summaryPromotion");
const summaryBackend = document.getElementById("summaryBackend");
const summaryResponseTime = document.getElementById("summaryResponseTime");
const insightDemand = document.getElementById("insightDemand");
const insightPromotion = document.getElementById("insightPromotion");
const insightHoliday = document.getElementById("insightHoliday");
const insightRecommendation = document.getElementById("insightRecommendation");
const insightBusiness = document.getElementById("insightBusiness");
const historyList = document.getElementById("historyList");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const downloadCsvBtn = document.getElementById("downloadCsvBtn");
const copyPredictionBtn = document.getElementById("copyPredictionBtn");
const dateInput = document.getElementById("date");
const backendStatus = document.getElementById("backendStatus");
const loadingMessage = document.createElement("div");
loadingMessage.className = "loading-message";
loadingMessage.setAttribute("aria-live", "polite");
statusMessage.parentNode.insertBefore(loadingMessage, statusMessage.nextSibling);

const HISTORY_STORAGE_KEY = "retail-prediction-history";
const API_BASE_URLS = [
  "https://ai-retail-analytics-api.onrender.com"
];
const loadingMessages = [
  "Loading model...",
  "Generating features...",
  "Running inference...",
  "Preparing prediction..."
];

function setTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((node) => {
    node.textContent = "";
  });
}

function setError(fieldId, message) {
  const errorNode = document.querySelector(`[data-error="${fieldId}"]`);
  if (errorNode) {
    errorNode.textContent = message;
  }
}

function validateForm() {
  clearErrors();
  const storeValue = document.getElementById("store").value.trim();
  const dateValue = dateInput.value;
  const promoValue = document.getElementById("promo").value;
  const schoolHolidayValue = document.getElementById("schoolHoliday").value;
  const stateHolidayValue = document.getElementById("stateHoliday").value;

  let isValid = true;

  if (!storeValue) {
    setError("store", "Store ID is required.");
    isValid = false;
  } else {
    const storeNumber = Number(storeValue);
    if (!Number.isInteger(storeNumber) || storeNumber <= 0) {
      setError("store", "Store ID must be a positive integer.");
      isValid = false;
    }
  }

  if (!dateValue) {
    setError("date", "Please choose a prediction date.");
    isValid = false;
  }

  if (promoValue !== "0" && promoValue !== "1") {
    setError("promo", "Promo must be 0 or 1.");
    isValid = false;
  }

  if (schoolHolidayValue !== "0" && schoolHolidayValue !== "1") {
    setError("schoolHoliday", "School holiday must be 0 or 1.");
    isValid = false;
  }

  if (!stateHolidayValue) {
    setError("stateHoliday", "Please select a state holiday value.");
    isValid = false;
  }

  return isValid;
}

function setLoading(isLoading) {
  predictBtn.disabled = isLoading;
  resetBtn.disabled = false;
  const label = predictBtn.querySelector(".btn-label");
  label.textContent = isLoading ? "Predicting..." : "Predict Sales";
  spinner.classList.toggle("hidden", !isLoading);
  if (isLoading) {
    statusMessage.classList.add("hidden");
    loadingMessage.textContent = loadingMessages[0];
    loadingMessage.classList.remove("hidden");
  } else {
    loadingMessage.textContent = "";
    loadingMessage.classList.add("hidden");
  }
}

function setBackendStatus(state, message) {
  backendStatus.className = `backend-badge ${state}`;
  backendStatus.querySelector(".badge-label").textContent = message;
}

async function checkBackendStatus() {
  for (const baseUrl of API_BASE_URLS) {
    try {
      await fetch(`${baseUrl}/`, { method: "GET", mode: "no-cors" });
      setBackendStatus("online", "Backend Online");
      return;
    } catch (error) {
      // Try the next URL.
    }
  }
  setBackendStatus("offline", "Backend Offline");
}

function showStatus(type, message) {
  statusMessage.className = `status-card ${type}`;
  statusMessage.innerHTML = `<strong>${message}</strong>`;
  statusMessage.classList.remove("hidden");
}

function hideStatus() {
  statusMessage.className = "status-card hidden";
  statusMessage.innerHTML = "";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function getPromoLabel(value) {
  return value === 1 ? "Promotion Running" : "No Promotion";
}

function getSchoolHolidayLabel(value) {
  return value === 1 ? "School Holiday" : "No School Holiday";
}

function getStateHolidayLabel(value) {
  const map = { "0": "No State Holiday", a: "Public Holiday", b: "Easter Holiday", c: "Christmas Holiday" };
  return map[value] || value;
}

function getInsight(predictionValue, promoValue, holidayValue) {
  if (predictionValue > 8000) {
    return {
      forecast: "High Demand",
      recommendation: "Increase inventory and staffing ahead of peak traffic.",
      holiday: holidayValue === "a" || holidayValue === "b" || holidayValue === "c" ? "Expected increase in customer footfall." : "Holiday effect is limited for this scenario.",
      promotion: promoValue === 1 ? "Promotion active" : "Promotion inactive",
      demand: "High",
      promotionText: promoValue === 1 ? "Active promotion is likely to lift sales." : "No active promotion. Maintain current stock strategy.",
      recommendationText: predictionValue > 8000 ? "Increase inventory and plan staffing for busy demand." : "Maintain current stock and monitor demand closely.",
    };
  }
  if (predictionValue >= 5000) {
    return {
      forecast: "Moderate Demand",
      recommendation: "Maintain current stock and monitor performance closely.",
      holiday: holidayValue === "a" || holidayValue === "b" || holidayValue === "c" ? "Holiday demand may create short-term uplift." : "Holiday effect is modest for this scenario.",
      promotion: promoValue === 1 ? "Promotion active" : "Promotion inactive",
      demand: "Moderate",
      promotionText: promoValue === 1 ? "Active promotion is supporting demand." : "No active promotion. Keep inventory balanced.",
      recommendationText: "Maintain current stock and monitor customer activity.",
    };
  }
  return {
    forecast: "Low Demand",
    recommendation: "Run a targeted campaign or reduce excess inventory.",
    holiday: holidayValue === "a" || holidayValue === "b" || holidayValue === "c" ? "Holiday impact may still support a small lift." : "No meaningful holiday uplift expected.",
    promotion: promoValue === 1 ? "Promotion active" : "Promotion inactive",
    demand: "Low",
    promotionText: promoValue === 1 ? "A promotion is active and may improve traffic." : "No promotion is active. Consider a tactical campaign.",
    recommendationText: "Run a targeted campaign or reduce excess inventory for slower demand.",
  };
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
  if (!history.length) {
    historyList.innerHTML = '<div class="history-item"><strong>No predictions yet</strong><span>Run your first forecast to populate this list.</span></div>';
    return;
  }

  historyList.innerHTML = history.map((item) => `
    <button class="history-item" type="button" data-store="${item.store}" data-date="${item.date}" data-promo="${item.promo}" data-school="${item.schoolHoliday}" data-state="${item.stateHoliday}">
      <strong>Store ${item.store}</strong>
      <span>${item.date} • ${formatCurrency(item.prediction)}</span>
    </button>
  `).join("");

  historyList.querySelectorAll(".history-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("store").value = button.dataset.store;
      document.getElementById("date").value = button.dataset.date;
      document.getElementById("promo").value = button.dataset.promo;
      document.getElementById("schoolHoliday").value = button.dataset.school;
      document.getElementById("stateHoliday").value = button.dataset.state;
      document.getElementById("stateHoliday").focus();
      document.querySelector("#prediction").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function saveHistory(payload, predictionValue) {
  const history = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
  const newEntry = {
    store: payload.store,
    date: payload.date,
    promo: payload.promo,
    schoolHoliday: payload.school_holiday,
    stateHoliday: payload.state_holiday,
    prediction: predictionValue,
  };
  const updatedHistory = [newEntry, ...history.filter((item) => !(item.store === payload.store && item.date === payload.date))].slice(0, 5);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  renderHistory();
}

function showResult(payload, requestPayload, responseTime) {
  const predictionValue = Number(payload["Predicted Sales"]);
  const insight = getInsight(predictionValue, requestPayload.promo, requestPayload.state_holiday);
  const backendLabel = backendStatus.querySelector(".badge-label").textContent;

  resultCard.classList.remove("hidden");
  predictionAmount.textContent = formatCurrency(predictionValue);
  resultStore.textContent = payload["Store ID"];
  resultDate.textContent = payload["Prediction Date"];
  resultPromo.textContent = getPromoLabel(requestPayload.promo);
  resultSchoolHoliday.textContent = getSchoolHolidayLabel(requestPayload.school_holiday);
  resultStateHoliday.textContent = getStateHolidayLabel(requestPayload.state_holiday);
  resultResponseTime.textContent = `${Math.round(responseTime)} ms`;
  resultBackendStatus.textContent = backendLabel;
  summaryForecast.textContent = insight.forecast;
  summaryPromotion.textContent = insight.promotion;
  summaryBackend.textContent = backendLabel;
  summaryResponseTime.textContent = `${Math.round(responseTime)} ms`;
  insightDemand.textContent = `Demand is ${insight.demand.toLowerCase()} for this scenario.`;
  insightPromotion.textContent = insight.promotionText;
  insightHoliday.textContent = insight.holiday;
  insightRecommendation.textContent = insight.recommendationText;
  insightBusiness.textContent = insight.recommendation;
  saveHistory(requestPayload, predictionValue);
}

function resetForm() {
  form.reset();
  setTodayDate();
  clearErrors();
  hideStatus();
  resultCard.classList.add("hidden");
  summaryForecast.textContent = "Awaiting prediction";
  summaryPromotion.textContent = "Awaiting prediction";
  summaryBackend.textContent = "Awaiting prediction";
  summaryResponseTime.textContent = "Awaiting prediction";
  insightDemand.textContent = "Awaiting prediction";
  insightPromotion.textContent = "Awaiting prediction";
  insightHoliday.textContent = "Awaiting prediction";
  insightRecommendation.textContent = "Awaiting prediction";
  insightBusiness.textContent = "Awaiting prediction";
}

function startLoadingMessages() {
  let index = 0;
  const timer = window.setInterval(() => {
    loadingMessage.textContent = loadingMessages[index % loadingMessages.length];
    index += 1;
  }, 800);
  return timer;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    showStatus("error", "Please fix the highlighted fields.");
    resultCard.classList.add("hidden");
    return;
  }

  hideStatus();
  setLoading(true);
  const loadingTimer = startLoadingMessages();
  const startedAt = performance.now();

  try {
    const payload = {
      store: Number(document.getElementById("store").value),
      date: dateInput.value,
      promo: Number(document.getElementById("promo").value),
      school_holiday: Number(document.getElementById("schoolHoliday").value),
      state_holiday: document.getElementById("stateHoliday").value,
    };

    let response;
    let data = null;

    for (const baseUrl of API_BASE_URLS) {
      try {
        response = await fetch(`${baseUrl}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        try {
          data = await response.json();
        } catch (error) {
          data = null;
        }

        if (response.ok) {
          break;
        }
      } catch (error) {
        response = null;
        data = null;
      }
    }

    if (!response || !response.ok) {
      throw new Error(data?.detail || "The prediction service returned an error.");
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    if (!data || typeof data["Predicted Sales"] === "undefined") {
      throw new Error("The server responded with an invalid prediction payload.");
    }

    showResult(data, payload, performance.now() - startedAt);
    showStatus("success", "Prediction completed successfully.");
  } catch (error) {
    const message = error.message === "Failed to fetch"
      ? "The prediction service is currently unavailable."
      : error.message || "Unable to generate a prediction right now.";
    showStatus("error", message);
    resultCard.classList.add("hidden");
  } finally {
    clearInterval(loadingTimer);
    setLoading(false);
  }
});

resetBtn.addEventListener("click", resetForm);

downloadPdfBtn.addEventListener("click", () => {
  window.print();
});

downloadCsvBtn.addEventListener("click", () => {
  const store = document.getElementById("store").value || "-";
  const date = dateInput.value || "-";
  const prediction = predictionAmount.textContent || "-";
  const promo = resultPromo.textContent || "-";
  const holiday = resultStateHoliday.textContent || "-";
  const csv = `Store,Date,Prediction,Promo,Holiday\n${store},${date},${prediction},${promo},${holiday}\n`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "prediction.csv";
  link.click();
  URL.revokeObjectURL(url);
});

copyPredictionBtn.addEventListener("click", async () => {
  const text = `Store: ${resultStore.textContent}\nDate: ${resultDate.textContent}\nPrediction: ${predictionAmount.textContent}\nPromo: ${resultPromo.textContent}\nHoliday: ${resultStateHoliday.textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    showStatus("success", "Prediction copied to clipboard.");
  } catch (error) {
    showStatus("error", "Unable to copy prediction.");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

setTodayDate();
checkBackendStatus();
renderHistory();
