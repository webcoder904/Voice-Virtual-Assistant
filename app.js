// API keys
const worldNewsApiKey = '9e1e64a41e944957a8e08575480558fa'; // Replace with your World News API key
const weatherApiKey = '3045dd712ffe6e702e3245525ac7fa38'; // Replace with your OpenWeatherMap API key
const BASE_URL = "https://saurav.tech/NewsAPI/";

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

    if (hour >= 0 && hour < 12) {
        greeting = "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }

    speak(`${greeting} Sujal Sir. I'm your virtual assistant. How can I help you today?`);
}

// Event listener for button click
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

// Event listener for speech recognition result
recognition.addEventListener('result', (event) => {
    const message = event.results[0][0].transcript.trim().toLowerCase();
    content.textContent = message;
    takeCommand(message);
});

// Event listener for form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const message = input.value.trim().toLowerCase();
    content.textContent = message;
    await takeCommand(message);
    input.value = ''; // Clear the input field after submitting the message
});

// Event listener for Enter key press in input field
if (input) {
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default Enter key behavior
            form.dispatchEvent(new Event('submit')); // Submit the form programmatically
        }
    });
} else {
    console.error('Input field not found.');
}

// Function to handle user commands
async function takeCommand(message) {
    if (message.includes('hello')) {
        wishMe(); // Reinvoke wishMe() to dynamically adjust the greeting
    } else if (message.includes('hey')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes('who is your owner')) {
        speak("I am a virtual assistant trained by the Sujal talrejas webcoder904 team.");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
        speak("This is what I found on the internet regarding " + message);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(message.replace("wikipedia", "").trim())}`, "_blank");
        speak("This is what I found on Wikipedia regarding " + message);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The current time is ${time}`);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak(`Today's date is ${date}`);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        speak("Opening Calculator");
    } else if (message.includes('activate whatsapp')) {
        // Attempt to open WhatsApp desktop application if protocol handler is available
        window.location.href = "whatsapp://";
        speak("Attempting to activate WhatsApp...");
    } else if (message.includes('activate edge')) {
        // Attempt to open WhatsApp desktop application if protocol handler is available
        window.location.href = "microsoft-edge:";
        speak("Attempting to activate WhatsApp...");
    
    } else if (message.includes("open linkedin")) {
        window.open("https://www.linkedin.com/in/sujal-kishore-kumar-talreja-65975b216/", "_blank");
        speak("Opening LinkedIn...");
    } else if (message.includes("open what")) {
        window.open("C:/Users/sujal/OneDrive/Desktop/WhatsApp.lnk", "_blank");
    } else if (message.includes("open instagram")) {
        window.open("https://instagram.com", "_blank");
        speak("Opening Instagram...");
    } else if (message.includes("chatgpt")) {
        window.open("https://chat.openai.com/", "_blank");
        speak("Opening ChatGPT...");
    } else if (message.includes("open portfolio")) {
        window.open("https://webcoder904.github.io/New-advance-updated-portfolio/", "_blank");
        speak("Opening Portfolio...");
    } else if (message.includes("open gmail")) {
        window.open("https://mail.google.com", "_blank");
        speak("Opening Gmail...");
    } else if (message.includes("open drive") || message.includes("open google drive")) {
        window.open("https://drive.google.com", "_blank");
        speak("Opening Google Drive...");
    } else if (message.includes("open github")) {
        window.open("https://github.com/webcoder904", "_blank");
        speak("Opening GitHub...");
    } else if (message.includes("current weather")) {
        const city = "Ahmedabad"; // Replace 'YOUR_CITY_NAME' with the desired city name
        const weatherData = await getWeather(city);
        if (weatherData) {
            const weatherDescription = weatherData.weather[0].description;
            const temperature = weatherData.main.temp;
            speak(`The current weather in ${city} is ${weatherDescription} with a temperature of ${temperature} degrees Celsius.`);
        } else {
            speak("Sorry, I couldn't fetch the weather data at the moment. Please try again later.");
        }
    } else if (message.includes("latest news")) {
        const newsData = await getTopHeadlines('technology', 'us'); // Example category and country
        if (newsData && newsData.articles && newsData.articles.length > 0) {
            const articles = newsData.articles.map(article => article.title).join('. ');
            speak(`Here are the latest news headlines: ${articles}`);
        } else {
            speak("Sorry, I couldn't fetch the latest news at the moment. Please try again later.");
        }
    } else {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
        speak("I found some information for " + message + " on Google");
    }
}

// Function to fetch top headlines from NewsAPI
async function getTopHeadlines(category, country) {
    const apiUrl = `${BASE_URL}/top-headlines/category/${category}/${country}.json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch top headlines: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching top headlines:', error);
        return null;
    }
}

// Function to fetch weather data
async function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
