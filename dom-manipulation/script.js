// Initial quotes
let quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Knowledge is power.", category: "Education" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuote');

// Display a random quote
function showRandomQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  const quote = quotes[random];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category!");
    return;
  }

  quotes.push({ text, category });
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("Quote added successfully!");
}

newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Display one quote on load
showRandomQuote();
// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) return alert("Please fill both fields!");

  quotes.push({ text, category });
  saveQuotes();  // persist change
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("Quote added and saved!");
}
