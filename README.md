# HealthGuardian Chatbot

**HealthGuardian** is a conversational AI chatbot designed for healthcare purposes. It allows doctors to input a patient's prescription and condition, and uses this information combined with ChatGPT/Gemini API's general medical knowledge to answer patient queries. The bot maintains context across interactions, enabling it to handle follow-up questions intelligently.

## Features
- **Doctor Input**: Doctors can input patient prescriptions and conditions.
- **Personalized Responses**: Chatbot generates responses based on the doctor’s input combined with general medical knowledge.
- **Follow-up Questions**: The chatbot remembers past queries and uses them to provide relevant answers for follow-up questions.
- **Contextual Conversations**: The chatbot maintains session-based memory, allowing it to track patient interactions over time.
- **AI-powered**: Powered by the OpenAI (ChatGPT) or Gemini API for natural language understanding and response generation.

---

## Table of Contents

- [Project Setup](#project-setup)
- [Architecture](#architecture)
- [Key Components](#key-components)
- [Session Management](#session-management)
- [API Integration](#api-integration)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)

---
##note the repo name has been changed clone accordingly

## Project Setup

### Prerequisites

To get started with the project, you need to have the following installed:
- **Astro Js , 3js , react -3 -fibre** 
- **Turso**  (for session storage)
-  **Gemini API key**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/healthguardian-chatbot.git
   cd healthguardian-chatbot
2,**Install dependencies:**
```npm install



**.env**
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

**

Usage
Doctor Inputs Patient Details: The doctor enters the patient’s prescription and condition via a user interface.
Patient Asks Questions: Patients ask questions related to their condition or medication.
Chatbot Provides Answers: The chatbot responds using a combination of the doctor's input and general medical knowledge from the OpenAI/Gemini API.

**
