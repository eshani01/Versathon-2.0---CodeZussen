# 🚀 FinSight

> **Your intelligent, cloud-powered financial dashboard and receipt scanner.** 
> Built for [Name of Hackathon 2026].

FinSight is a modern financial tracking application that allows users to seamlessly log in via Google, scan physical receipts using AI/OCR, and visualize their spending habits in a personalized, interactive dashboard (featuring the Finny Orbit view). 

## ✨ Key Features

* **Secure Authentication:** Passwordless, one-tap login using **Google OAuth 2.0**.
* **AI Receipt Scanning:** Upload receipt images to automatically extract transaction details, amounts, and categories using OCR.
* **Serverless Cloud Database:** User data and transactions are securely persisted in real-time using **Neon Serverless PostgreSQL**.
* **Interactive Dashboard:** A dynamic frontend that welcomes users by name and visualizes financial data in an intuitive "Orbit" interface.

## 🛠️ Tech Stack

**Frontend**
* HTML5, CSS3, Vanilla JavaScript
* Google Identity Services (GSI) for Auth

**Backend**
* Node.js & Express.js
* RESTful API architecture
* `google-auth-library` for secure token verification

**Database**
* Neon (Serverless PostgreSQL)
* `pg` Node client for database pooling and queries

