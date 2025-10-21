# ScholarSwipe - Match with your next citation

A hackathon project built using FastAPI and the Perplexity Sonar API to help students and researchers quickly find, swipe, and save AI-summarized academic papers from trusted sources. Export liked papers for easy literature review and bibliographies..

---

## 🔍 Project Overview

ScholarSwipe is designed to streamline the process of discovering relevant academic research. Instead of sifting through countless search results, users can input a research question and swipe through summarized papers, making the literature review process more efficient and engaging.

---

## ⚙️ Features

- **FastAPI Backend:** Handles queries to the Perplexity Sonar API and serves AI-generated summaries.  
- **React Frontend:** Provides a swipeable interface for users to browse academic papers.  
- **AI-Powered Summaries:** Each paper includes key findings, methodology, limitations, relevance, and credibility scores.  
- **Export Functionality:** Users can export their liked papers CSV or bibliography for further analysis.

---

## 🛠️ Tech Stack

- **Backend:** Python 3.12, FastAPI, Uvicorn  
- **Frontend:** JavaScript
- **API:** Perplexity Sonar API  
- **Others:** CSV export  

---

## 🤖 Perplexity AI Integration

ScholarSwipe uses the **Perplexity Sonar API** to fetch relevant research papers based on the user’s query. The **Sonar-Pro LLM** is then used to generate structured summaries for each paper, including:

- Key findings  
- Methodology  
- Limitations  
- Relevance score  
- Authenticity score  

The backend exposes endpoints that return these summaries in JSON format, which the frontend then presents as swipeable cards.  

---

## 🚀 Getting Started

### Youtube video link

Here is the youtube video link showing how to use [ScholarSwipe](https://youtu.be/Zqk7BLMhx9I)

### Prerequisites

Ensure you have **Python 3.12** installed. If not, download it from the official [Python website](https://www.python.org/downloads/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/majorsaif/ScholarSwipe.git
   cd ScholarSwipe
2. **Insert your API Key**
   In ScholarSwipe_Backend.py, replace:
   ```python
   PERPLEXITY_API_KEY = "INSERT API KEY HERE"
3. **Run the FastAPI Backend**
   ```python
   py -3.12 -m uvicorn ScholarSwipe_Backend:app --reload --host 0.0.0.0 --port 8000
4. **Open the frontend**
   Open ScholarSwipe.html in your browser
