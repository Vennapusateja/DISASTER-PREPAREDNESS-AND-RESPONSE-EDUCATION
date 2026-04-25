# DISASTER.OS - Disaster Preparedness & Simulation Platform

A production-ready interactive disaster training, simulation, and risk prediction platform designed for real-world preparedness and education.

---

## 🚀 Overview

DISASTER.OS transforms disaster preparedness into an intelligent and interactive system:

* 🎮 **Interactive Simulation Engine**

  * Real-time Fire, Earthquake, and Flood simulations
  * Intensity-based dynamic visuals
  * Educational debrief with corrective actions

* 🧠 **Multi-Hazard Risk Predictor**

  * Predict risk for Fire, Flood, and Earthquake
  * Supports single or combined hazard scenarios
  * Provides preventive measures and safety recommendations

* 🎓 **Certification System**

  * 10-question quiz modules
  * XP-based scoring and badges
  * Gamified learning experience

* 📊 **Operational Dashboard**

  * Tracks user performance
  * Leaderboard and analytics
  * Drill efficiency scoring

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites

Install the following:

* Node.js (v18 or higher)
* MongoDB (running locally)

---

### 2. Clone the Repository

```bash
git clone <repository-url>
cd disaster_prep_system
```

---

### 3. Backend Setup

```bash
cd backend
npm install
```

#### Create `.env` file inside `backend/`

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/disaster_prep
JWT_SECRET=change_this_to_any_random_string_123

# =========================
# TWILIO (OPTIONAL)
# =========================
# Uncomment only if SMS alerts are required

#TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXX
#TWILIO_AUTH_TOKEN=your_auth_token_here
#TWILIO_PHONE_NUMBER=+1234567890
```

---

### 4. Start Backend Server

```bash
npm run dev
```

Expected output:

```
Connected to MongoDB
API running on http://localhost:5000
```

---

### 5. Start MongoDB

#### Windows:

* Open **Services**
* Start **MongoDB Server**

#### Mac/Linux:

```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

---

### 6. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Application Access

* Frontend → http://localhost:5173
* Backend → http://localhost:5000

---

## 🧪 Testing Flow

### 🔐 Authentication

* Register or login

---

### 🎮 Simulation Engine

* Select disaster (Fire / Earthquake / Flood)
* Adjust intensity (1–10)
* Observe dynamic visual changes
* Complete drill → view:

  * Efficiency score
  * Correct actions
  * Preventive measures
  * Safety tips

---

### 🧠 Risk Predictor

* Select one or more hazards
* Input environmental data
* Click **Predict Risk**
* View:

  * Individual risk levels
  * Combined risk
  * Recommendations

---

### 🎓 Certification

* Complete 10-question quiz
* Earn XP and badges

---

### 🏆 Dashboard

* Track performance
* View leaderboard ranking

---

## 📲 Twilio SMS Integration (Optional)

This feature enables real-time SMS alerts.

### Steps:

1. Create account on Twilio
2. Get:

   * Account SID
   * Auth Token
   * Phone Number
3. Update `.env`:

```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

### ⚠️ Note:

* Twilio is optional
* System works fully without it

---

## ⚠️ Important Notes

* This project runs **locally only**
* `.env` file is NOT included for security
* Use `.env.example` as reference if provided
* Do not expose secret keys publicly

---

## 🏁 Final Status

✔ Interactive Simulations
✔ Multi-Hazard Risk Prediction
✔ Gamified Learning System
✔ Analytics Dashboard
✔ Fully Local Deployment

---

## 👨‍💻 Author

Developed as a complete Disaster Preparedness Solution for real-world training and simulation.
## Last Updated: Final Version 🚀