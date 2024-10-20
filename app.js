// API keys
const worldNewsApiKey = '9e1e64a41e944957a8e08575480558fa';
const weatherApiKey = '3045dd712ffe6e702e3245525ac7fa38';
const stockApiKey = '0a4132fe7329452ea79488a6d4030791';
const timeSeriesApiKey = 'your_api_key';
const BASE_URL = 'https://saurav.tech/NewsAPI/';

// DOM elements
const content = document.querySelector('.content');
const btn = document.querySelector('.talk');
const form = document.querySelector('form');
const input = document.querySelector('input[type="text"]');

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

// Speech synthesis function
function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.volume = 1;
  text_speak.pitch = 1;
  window.speechSynthesis.speak(text_speak);
}

// Greeting function
function wishMe() {
  const hour = new Date().getHours();
  let greeting = '';

  if (hour >= 0 && hour < 12) greeting = 'Good Morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else greeting = 'Good Evening';

  speak(`${greeting} Sujal Sir. I'm your virtual assistant. How can I help you today?`);
}

// Event listener for button click
btn.addEventListener('click', () => {
  content.textContent = 'Listening...';
  recognition.start();
});

// Event listener for form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = input.value.trim().toLowerCase();
  content.textContent = message;
  await takeCommand(message);
  input.value = '';
});

// Event listener for Enter key press in input field
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
});

// Handle user commands
async function takeCommand(message) {
  if (message.includes('hello')) wishMe();
  else if (message.includes('hey')) speak('Hello Sir, How May I Help You?');
  else if (message.includes('who is sujal talreja')) await describeSujal();
  else if (message.includes('who is your owner')) {
    speak('I am an Eranix virtual assistant created by Sujal Talreja\'s Webcoder904 team.');
  } else if (message.includes('weather')) await fetchWeather();
  else if (message.includes('news')) await fetchNews();
  else if (message.includes('stock')) await fetchStockPrice();
  else if (message.includes('joke')) tellJoke();
  else if (message.includes('quote')) await fetchQuote();
  else if (message.includes('timer')) startTimer(message);
  else if (message.includes('reminder')) setReminder(message);
  else if (message.includes('time')) speak(`The current time is ${new Date().toLocaleTimeString()}`);
  else if (message.includes('date')) speak(`Today's date is ${new Date().toLocaleDateString()}`);
  else handleWebSearch(message);
}

// Describe Sujal Talreja
async function describeSujal() {
  const description = `Sujal Talreja is a 21-year-old self-taught web developer and cybersecurity enthusiast ...`; // Truncated for brevity
  speak(description);
}

// Fetch weather data
async function fetchWeather() {
  const city = 'Ahmedabad';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const description = data.weather[0].description;
    const temp = data.main.temp;
    speak(`The weather in ${city} is ${description} with a temperature of ${temp}°C.`);
  } catch {
    speak('Unable to fetch weather data.');
  }
}

// Fetch latest news
async function fetchNews() {
  const apiUrl = `${BASE_URL}/top-headlines/category/technology/in.json`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const headlines = data.articles.slice(0, 5).map(a => a.title).join('. ');
    speak(`Here are the top news headlines: ${headlines}`);
  } catch {
    speak('Unable to fetch news.');
  }
}

// Fetch stock price
async function fetchStockPrice() {
  speak('Which stock would you like to check?');
  recognition.onresult = async (event) => {
    const stockName = event.results[0][0].transcript.trim().toUpperCase();
    const apiUrl = `https://api.twelvedata.com/price?symbol=${stockName}&apikey=${stockApiKey}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      speak(`The current price of ${stockName} is $${data.price}`);
    } catch {
      speak('Unable to fetch stock price.');
    }
  };
}

// Tell a random joke
function tellJoke() {
  const jokes = [
    'Why did the scarecrow win an award? Because he was outstanding in his field!',
    'I told my wife she was drawing her eyebrows too high. She looked surprised.'
  ];
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  speak(joke);
}

// Fetch a random quote
async function fetchQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    speak(`Here is a quote: "${data.content}" by ${data.author}`);
  } catch {
    speak('Unable to fetch quote.');
  }
}

// Start a timer
function startTimer(message) {
  const timeInSeconds = parseInt(message.match(/\d+/)[0], 10) * 60;
  setTimeout(() => speak('Timer finished!'), timeInSeconds * 1000);
  speak(`Timer set for ${timeInSeconds / 60} minutes.`);
}

// Set a reminder
function setReminder(message) {
  const reminderText = message.replace('reminder', '').trim();
  setTimeout(() => speak(`Reminder: ${reminderText}`), 5000); // Example: Reminder in 5 seconds
  speak('Reminder set.');
}

// Handle web search commands
function handleWebSearch(query) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(searchUrl, '_blank');
  speak(`I found some information about ${query} on Google.`);
}

// Speech recognition result listener
recognition.addEventListener('result', async (event) => {
  const message = event.results[0][0].transcript.trim().toLowerCase();
  content.textContent = message;
  await takeCommand(message);
});
