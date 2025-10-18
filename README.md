ScholarSwipe - Match with your next citation.
A hackathon project built using FastAPI and the Perplexity Sonar API to help students and researchers quickly find, swipe, and save AI-summarized academic papers from trusted sources. Export liked papers for easy literature review and bibliographies.

🔍 Project Overview
ScholarSwipe is designed to streamline the process of discovering relevant academic research. Instead of sifting through countless search results, users can input a research question and swipe through summarized papers, making the literature review process more efficient and engaging.

⚙️ Features
FastAPI Backend: Handles queries to the Perplexity Sonar API and serves AI-generated summaries.
React Frontend: Provides a swipeable interface for users to browse academic papers.
AI-Powered Summaries: Each paper includes key findings, methodology, limitations, relevance, and credibility scores.
Export Functionality: Users can export their liked papers as JSON or CSV for further analysis.

🛠️ Tech Stack
Backend: Python 3.12, FastAPI, Uvicorn
Frontend: React, TailwindCSS
API: Perplexity Sonar API
Others: CSV

🚀 Getting Started
Prerequisites
Ensure you have Python 3.12 installed. If not, download it from the official Python website.

Installation
Clone the repository:
  git clone https://github.com/majorsaif/ScholarSwipe.git
  cd ScholarSwipe
Install backend dependencies:
  py -3.12 -m pip install -r requirements.txt
Insert API Key:
  Line 15 of ScholarSwipe_Backend: PERPLEXITY_API_KEY = "INSERT API KEY HERE"
Run the FastAPI backend:
  py -3.12 -m uvicorn ScholarSwipe_Backend:app --reload --host 0.0.0.0 --port 8000
Open HTML File:
  ScholarSwipe.html


