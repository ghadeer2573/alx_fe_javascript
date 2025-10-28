// ====== GLOBAL VARIABLES ======
let quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Knowledge is power.", category: "Education" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuote');
const categoryFilter = document.getElementById('categoryFilter');

// ====== LOCAL STORAGE HANDLING ======
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// ====== DOM MANIPULATION ======
function showRandomQuote() {
  const selected = categoryFilter.value;
  const filteredQuotes = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote in session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("✅ Quote added successfully!");
}

// ====== CATEGORY FILTERING ======
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem('selectedCategory', selected);
  showRandomQuote();
}

function restoreFilter() {
  const savedCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = savedCategory;
  showRandomQuote();
}

// ====== JSON IMPORT/EXPORT ======
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('✅ Quotes imported successfully!');
      } else {
        alert('⚠️ Invalid JSON format!');
      }
    } catch {
      alert('⚠️ Error reading JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ====== SERVER SYNC SIMULATION ======
async function syncWithServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
    const serverData = await response.json();

    const serverQuotes = serverData.map(item => ({
      text: item.title,
      category: "Server"
    }));

    // Conflict resolution: server data takes precedence
    quotes = [...serverQuotes, ...quotes];
    saveQuotes();
    populateCategories();

    alert("🔄 Synced with server successfully!");
  } catch (error) {
    console.error("Sync failed:", error);
    alert("⚠️ Failed to sync with server.");
  }
}

// ====== INITIALIZATION ======
window.onload = function() {
  loadQuotes();
  populateCategories();
  restoreFilter();

  const lastViewed = sessionStorage.getItem('lastViewedQuote');
  if (lastViewed) {
    const quote = JSON.parse(lastViewed);
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
  } else {
    showRandomQuote();
  }
};

newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
