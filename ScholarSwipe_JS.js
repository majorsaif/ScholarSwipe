// Configuration (calls to local host on device through fast api )
const API_BASE_URL = 'http://localhost:8000'; // Update this to your FastAPI backend URL
// in general, the localhost will be 8000

// State Management
const state = {
    currentQuery: '',
    papers: [],
    currentIndex: 0,
    savedPapers: [],
};

// DOM Elements
const searchPage = document.getElementById('searchPage');
const swipePage = document.getElementById('swipePage');
const resultsPage = document.getElementById('resultsPage');
const loadingOverlay = document.getElementById('loadingOverlay');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const backBtn = document.getElementById('backBtn');
const queryDisplay = document.getElementById('queryDisplay');
const currentCardEl = document.getElementById('currentCard');
const totalCardsEl = document.getElementById('totalCards');
const cardStack = document.getElementById('cardStack');
const discardBtn = document.getElementById('discardBtn');
const keepBtn = document.getElementById('keepBtn');

const resultsCount = document.getElementById('resultsCount');
const savedPapersList = document.getElementById('savedPapersList');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const createBibliographyBtn = document.getElementById('createBibliographyBtn');
const generateSummaryBtn = document.getElementById('generateSummaryBtn');
const summarySection = document.getElementById('summarySection');
const summaryContent = document.getElementById('summaryContent');
const newSearchBtn = document.getElementById('newSearchBtn');
const loadingText = document.getElementById('loadingText');

// Utility Functions
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');
}

function showLoading(message = 'Loading...') {
    loadingText.textContent = message;
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

function updateCounter() {
    currentCardEl.textContent = state.currentIndex + 1;
    totalCardsEl.textContent = state.papers.length;
}

// API Functions
async function searchPapers(query) {
    const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        throw new Error('Failed to search papers');
    }

    return await response.json();
}

async function generateConclusion(papers) {
    const response = await fetch(`${API_BASE_URL}/generate_conclusion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ papers })
    });

    if (!response.ok) {
        throw new Error('Failed to generate conclusion');
    }

    return await response.json();
}

async function generateBibliography(papers) {
    const response = await fetch(`${API_BASE_URL}/generate_bibliography`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ papers })
    });

    if (!response.ok) {
        throw new Error('Failed to generate bibliography');
    }

    return await response.json();
}

// Card Functions
function createCard(paper, index) {
    const card = document.createElement('div');
    card.className = 'paper-card';
    card.dataset.index = index;
    card.style.zIndex = state.papers.length - index;
    card.style.display = index === state.currentIndex ? 'block' : 'none';

    // Get the best available description
    const description = paper.summary?.summary || paper.abstract || paper.snippet || 'This paper explores key concepts and findings in the research area.';

    card.innerHTML = `
        <div class="card-source">${extractDomain(paper.url)}</div>
        <h2 class="card-title">${paper.title}</h2>
        <p class="card-snippet">${description}</p>

        <div class="card-summary">
            <div class="summary-item">
                <div class="summary-label">🔍 Key Findings</div>
                <div class="summary-text">${paper.summary?.key_findings || 'Processing...'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">🔬 Methodology</div>
                <div class="summary-text">${paper.summary?.methodology || 'Processing...'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">⚠️ Limitations</div>
                <div class="summary-text">${paper.summary?.limitations || 'Processing...'}</div>
            </div>
        </div>

        <div class="card-scores">
            <div class="score-badge">
                <div class="score-label">Relevance</div>
                <div class="score-value">${paper.summary?.relevance_score || 85}%</div>
            </div>
            <div class="score-badge">
                <div class="score-label">Authenticity</div>
                <div class="score-value">${paper.summary?.authenticity_score || 90}%</div>
            </div>
        </div>

        <a href="${paper.url}" target="_blank" class="card-link">
            Read Full Paper
        </a>
    `;

    addSwipeListeners(card);
    return card;
}

function extractDomain(url) {
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        return domain;
    } catch {
        return 'Research Paper';
    }
}

function updateCardVisibility() {
    document.querySelectorAll('.paper-card').forEach((card, idx) => {
        card.style.display = idx === state.currentIndex ? 'block' : 'none';
    });
}

// Swipe Functionality
let startX = 0, currentX = 0, isDragging = false;
const SWIPE_THRESHOLD = 150;

function addSwipeListeners(card) {
    card.addEventListener('mousedown', handleDragStart);
    card.addEventListener('touchstart', handleDragStart);
}

function handleDragStart(e) {
    if (parseInt(e.currentTarget.dataset.index) !== state.currentIndex) return;

    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    currentX = startX; // Initialize currentX
    e.currentTarget.classList.add('swiping');

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
}

function handleDragMove(e) {
    if (!isDragging) return;
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = currentX - startX;
    const card = document.querySelector(`.paper-card[data-index="${state.currentIndex}"]`);
    if (card && Math.abs(diff) > 10) { // Only show animation if moved more than 10px
        card.style.transform = `translateX(${diff}px) rotate(${diff / 20}deg)`;
    }
}

function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    const diff = currentX - startX;
    const card = document.querySelector(`.paper-card[data-index="${state.currentIndex}"]`);
    
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);

    if (card) {
        card.classList.remove('swiping');
        // ONLY swipe if threshold is met
        if (Math.abs(diff) >= SWIPE_THRESHOLD) {
            if (diff > 0) {
                swipeRight();
            } else {
                swipeLeft();
            }
        } else {
            // Reset - no swipe
            card.style.transform = '';
        }
    }
}

function swipeLeft() {
    const card = document.querySelector(`.paper-card[data-index="${state.currentIndex}"]`);
    if (!card) return;
    card.classList.add('swipe-left');
    setTimeout(() => { nextCard(); }, 400);
}

function swipeRight() {
    const card = document.querySelector(`.paper-card[data-index="${state.currentIndex}"]`);
    if (!card) return;
    state.savedPapers.push(state.papers[state.currentIndex]);
    card.classList.add('swipe-right');
    setTimeout(() => { nextCard(); }, 400);
}

function nextCard() {
    state.currentIndex++;
    if (state.currentIndex >= state.papers.length) {
        showResults();
    } else {
        updateCounter();
        updateCardVisibility();
    }
}

// Results Display
function showResults() {
    if (!state.savedPapers.length) {
        alert('No papers saved! Try searching again.');
        showPage(searchPage);
        return;
    }

    resultsCount.textContent = `Query: ${state.currentQuery} • You saved ${state.savedPapers.length} paper${state.savedPapers.length > 1 ? 's' : ''}`;
    savedPapersList.innerHTML = '';

    state.savedPapers.forEach((paper, index) => {
        const paperItem = document.createElement('div');
        paperItem.className = 'saved-paper-item';
        paperItem.innerHTML = `
            <div class="paper-header">
                <div class="paper-info">
                    <h3>${index + 1}. ${paper.title}</h3>
                    <p>${extractDomain(paper.url)} • Relevance: ${paper.summary?.relevance_score || 85}%</p>
                </div>
                <div class="paper-actions">
                    <button class="btn-toggle-details" data-index="${index}">
                        <span class="toggle-icon">▼</span> Details
                    </button>
                    <a href="${paper.url}" target="_blank" class="card-link">View Paper →</a>
                </div>
            </div>
            
            <div class="paper-details" id="details-${index}" style="display: none;">
                <div class="details-content">
                    <div class="detail-section">
                        <h4>🔍 Key Findings</h4>
                        <p>${paper.summary?.key_findings || 'N/A'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>🔬 Methodology</h4>
                        <p>${paper.summary?.methodology || 'N/A'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>⚠️ Limitations</h4>
                        <p>${paper.summary?.limitations || 'N/A'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>📊 Summary</h4>
                        <p>${paper.summary?.summary || 'N/A'}</p>
                    </div>
                    
                    <div class="detail-scores">
                        <div class="score-badge">
                            <div class="score-label">Relevance</div>
                            <div class="score-value">${paper.summary?.relevance_score || 85}%</div>
                        </div>
                        <div class="score-badge">
                            <div class="score-label">Authenticity</div>
                            <div class="score-value">${paper.summary?.authenticity_score || 90}%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        savedPapersList.appendChild(paperItem);
        
        // Add click handler for toggle details button
        const toggleBtn = paperItem.querySelector('.btn-toggle-details');
        const detailsDiv = paperItem.querySelector('.paper-details');
        const toggleIcon = toggleBtn.querySelector('.toggle-icon');
        
        toggleBtn.addEventListener('click', () => {
            const isVisible = detailsDiv.style.display === 'block';
            
            if (isVisible) {
                // Hide details
                detailsDiv.style.display = 'none';
                toggleIcon.textContent = '▼';
                toggleBtn.classList.remove('active');
            } else {
                // Show details
                detailsDiv.style.display = 'block';
                toggleIcon.textContent = '▲';
                toggleBtn.classList.add('active');
            }
        });
    });

    summarySection.style.display = 'none';
    showPage(resultsPage);
}

// Export Functions
function exportAsCSV() {
    if (!state.savedPapers.length) {
        alert('No papers to export!');
        return;
    }

    const headers = ['Title', 'URL', 'Source', 'Relevance Score', 'Authenticity Score', 'Key Findings', 'Methodology', 'Limitations'];
    
    const rows = state.savedPapers.map(paper => {
        return [
            `"${(paper.title || '').replace(/"/g, '""')}"`,
            `"${paper.url || ''}"`,
            `"${extractDomain(paper.url)}"`,
            paper.summary?.relevance_score || 85,
            paper.summary?.authenticity_score || 90,
            `"${(paper.summary?.key_findings || '').replace(/"/g, '""')}"`,
            `"${(paper.summary?.methodology || '').replace(/"/g, '""')}"`,
            `"${(paper.summary?.limitations || '').replace(/"/g, '""')}"`
        ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scholarswipe-papers-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// Generate Bibliography Function
async function createBibliography() {
    if (!state.savedPapers.length) {
        alert('No papers saved!');
        return;
    }

    showLoading('Generating bibliography...');
    try {
        const result = await generateBibliography(state.savedPapers);
        
        // Create a downloadable text file
        const blob = new Blob([result.bibliography], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scholarswipe-bibliography-${Date.now()}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        
        //alert(`Bibliography generated in ${result.format} format and downloaded!`);
    } catch (error) {
        alert('Failed to generate bibliography. Please try again.');
        console.error(error);
    } finally {
        hideLoading();
    }
}

// Format text into nice paragraphs
function formatSummaryText(text) {
    // Remove citation brackets like [1], [2], [1,2], etc.
    text = text.replace(/\[\d+(?:,\s*\d+)*\]/g, '');
    
    // Remove markdown bold/italic markers but keep the text
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '$1');
    text = text.replace(/\*\*(.+?)\*\*/g, '$1');
    text = text.replace(/\*(.+?)\*/g, '$1');
    text = text.replace(/__(.+?)__/g, '$1');
    text = text.replace(/_(.+?)_/g, '$1');
    
    // Remove LaTeX commands
    text = text.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1');
    text = text.replace(/\\[a-zA-Z]+/g, '');
    
    // Clean up multiple spaces
    text = text.replace(/\s+/g, ' ');
    
    // Split into paragraphs and format
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
}

// Generate Overall Literature Review
async function generateOverallSummary() {
    if (!state.savedPapers.length) {
        alert('No papers saved!');
        return;
    }

    showLoading('Generating overall summary...');
    try {
        const result = await generateConclusion(state.savedPapers);
        
        // Format the conclusion nicely
        const formattedContent = formatSummaryText(result.conclusion);
        
        summaryContent.innerHTML = formattedContent;
        summarySection.style.display = 'block';
        summarySection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert('Failed to generate summary. Please try again.');
        console.error(error);
    } finally {
        hideLoading();
    }
}

// Event Listeners
searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return alert('Please enter a research question');

    showLoading('Searching research papers...');
    state.currentQuery = query;

    try {
        const results = await searchPapers(query);
        state.papers = results.papers || [];
        state.currentIndex = 0;
        state.savedPapers = [];

        if (!state.papers.length) throw new Error('No papers found');

        queryDisplay.textContent = query;
        updateCounter();

        cardStack.innerHTML = '';
        state.papers.forEach((paper, i) => {
            const card = createCard(paper, i);
            cardStack.appendChild(card);
        });

        showPage(swipePage);
    } catch (error) {
        alert('Failed to search papers. Make sure the backend is running!');
        console.error(error);
    } finally {
        hideLoading();
    }
});

searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') searchBtn.click(); });
backBtn.addEventListener('click', () => { if (confirm('Go back? Progress will be lost.')) showPage(searchPage); });
discardBtn.addEventListener('click', swipeLeft);
keepBtn.addEventListener('click', swipeRight);

document.addEventListener('keydown', e => {
    if (!swipePage.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') swipeLeft();
    if (e.key === 'ArrowRight') swipeRight();
});

exportCsvBtn.addEventListener('click', exportAsCSV);
createBibliographyBtn.addEventListener('click', createBibliography);
generateSummaryBtn.addEventListener('click', generateOverallSummary);

newSearchBtn.addEventListener('click', () => { 
    searchInput.value = ''; 
    state.savedPapers = [];
    state.papers = [];
    state.currentIndex = 0;
    showPage(searchPage); 
});


console.log('ScholarSwipe initialized! Make sure your backend is running at:', API_BASE_URL);
