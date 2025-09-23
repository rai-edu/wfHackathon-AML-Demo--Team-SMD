
# 🛡️ AML Smart Contract Checks for Non-Custodial Wallets  
*Using Oracle & Google Datasets*  

## 📌 Problem Statement  
In the digital economy, banks face increasing exposure to transactions involving both custodial and non-custodial wallets.  

- **Custodial Wallets** are governed by institutions and regulated frameworks.  
- **Non-Custodial Wallets**, where users hold their own private keys, introduce unique risks:  
  - Limited governance over **high-value, high-risk transactions**  
  - Possible involvement in **AML-flagged / suspicious activities**  
  - No visibility into **historical wallet behavior**  
  - Absence of a **risk rating mechanism** for smart contracts  

👉 There is an urgent need for **real-time AML (Anti-Money Laundering) risk assessment** of non-custodial wallets during blockchain transactions.  

---
# 🏆 Solution Statement

## Title  
**Real-Time AML Compliance for Non-Custodial Wallets using Oracle + Google Public Datasets**

---

## 📌 Problem Addressed  
With the rapid rise of non-custodial wallets in the digital economy, financial institutions face a significant gap in visibility, governance, and AML compliance.  
Traditional AML frameworks are designed for custodial systems and fail to address high-risk transactions in decentralized ecosystems, resulting in potential exposure to money laundering, fraud, and suspicious activity.

---

## 💡 Our Solution  
We developed a **blockchain-integrated AML compliance solution** that uses a dedicated **Oracle service** to perform **real-time risk assessments** of non-custodial wallets.

---

## 🔑 Key Capabilities  
- 🔗 **Oracle Service** connects to Google’s public blockchain datasets to fetch transaction histories.  
- 🧠 **Risk Scoring & Rating** (1–100 score, 1–10 rating) powered by rules-based checks and optional AI/ML models.  
- 🚦 **Compliance Decisioning** – smart contracts automatically allow or block transactions based on risk thresholds.  
- 📄 **Contextual Reports** – last 10–20 transactions, risk factors, and AML reasoning provided for auditability.

---

## 🛠️ Architecture Highlights  
- **Oracle Service:** Node.js/TypeScript backend + AML check engine  
- **Smart Contract Integration:** Built with Core Block + Tachyon to enforce compliance before transaction execution  
- **Data Source:** Google Public Datasets for wallet history & anomaly detection  

---

## 🎯 Impact  
- ✅ Enables **real-time AML screening** for DeFi transactions  
- 🛡️ Reduces exposure to **high-risk wallets** & potential compliance breaches  
- 📊 Provides **data-driven decisioning** for risk management teams  
- 🌉 Bridges **traditional AML practices** with decentralized finance ecosystems  

---

## 🚀 Future Enhancements  
- 🤖 **AI/ML-based adaptive fraud detection** for evolving attack patterns  
- 🔗 **Multi-chain compatibility** for broader blockchain coverage  
- 🖥️ **Web dashboard** for compliance monitoring & audit trails  

---

## 🎯 Solution Overview  
We built a system that integrates an **Oracle** with **Google's public transaction datasets** to provide **AML compliance checks** for non-custodial wallets.  

Our solution empowers **smart contracts** to:  
- ✅ Validate AML compliance before execution  
- 🚩 Flag high-risk or non-compliant wallets  
- 📊 Provide a **quantified Risk Score (1–100)** and **Risk Rating (1–10)** for decision-making  

---

## 🛠️ Architecture  

1. **Oracle Service**  
   - Fetches wallet transaction history from Google’s public datasets  
   - Runs AML compliance checks (risk scoring, anomaly detection, suspicious patterns)  
   - Provides **last 10–20 transactions** per wallet for context  

2. **Smart Contract Integration**  
   - Calls the Oracle during execution  
   - Makes **automated compliance decisions**  
   - Supports:  
     - Risk Scoring  
     - Risk Rating (1–10 scale)  
     - Compliance Flag (Yes/No)  
     - AML Reasoning Report  

3. **Tech Stack**  
   - **Core Block** + **Tachyon** → Smart contract & Oracle framework  
   - **Node.js / TypeScript** → Oracle Service backend  
   - **Google Public Datasets** → Transaction history & AML checks  
   - **Optional AI/ML** → For enhanced fraud detection and dynamic risk scoring  

---

## 📊 Demo Workflow  

1. **Smart Contract Execution Triggered**  
2. **Oracle Fetches Wallet Data**  
3. **AML Compliance Check Performed**  
   - Risk Score (0–100)  
   - Risk Rating (1–10)  
   - Compliant: ✅ Yes / ❌ No  
   - Reason: "High total received amount and/or frequent incoming transactions"  
4. **Smart Contract Proceeds or Rejects Transaction** based on compliance  

---

## 📸 Screenshots  

### 🔹 Oracle AML Service Running
![WhatsApp Image 2025-09-22 at 10 30 33](https://github.com/user-attachments/assets/69820f2d-ad9d-411b-8ba2-964d788b7802)



### 🔹 Block Finalization & Transaction Proposals 
![WhatsApp Image 2025-09-22 at 10 30 34 (1)](https://github.com/user-attachments/assets/f3c13e6d-7b0f-4ef5-ab15-7b8cef70ab64)



### 🔹 Transaction History Retrieval (JSON Format)  
![WhatsApp Image 2025-09-22 at 10 30 34 (2)](https://github.com/user-attachments/assets/4f0bbb8c-3358-4403-a3b3-a4f3f87ff193)



### 🔹 AML Risk Check Responses  
![WhatsApp Image 2025-09-22 at 10 30 34](https://github.com/user-attachments/assets/49dee64c-1439-4080-ac79-5a5efd52e60c)



---

## 🎥 Demo Video  
👉 [Watch the Demo - Youtube](https://www.youtube.com/watch?v=DsJ8I6n6XgE)  
<!-- Link video from video folder  -->
<video src="video/DEMO[Team-SMD].mp4" controls width="600"></video>

[Download - Demo File](artifact/demo/DEMO[Team-SMD].mp4)
---

## 🚀 Future Enhancements  
- Integrate **AI/ML anomaly detection** for evolving fraud patterns  
- Build a **web dashboard** for compliance officers to monitor flagged wallets  
- Support **multi-chain integration** beyond current setup  

---

## 👥 Team  
Built by TEAM SMD .  