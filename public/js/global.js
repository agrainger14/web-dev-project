let displayText = ["Terrible", "Bad", "Meh", "Good", "Awesome"];
let moodsOne = ["Annoyed", "Depressed", "Angry", "Disappointed", "Anxious", "Stressed"];
let moodsTwo = ["Sad", "Jealous", "Confused", "Worried", "Afraid", "Lonely"];
let moodsThree = ["Neutral", "Nervous", "Tired", "Bored", "Confused", "Tense"];
let moodsFour = ["Happy", "Motivated", "Pleased", "Calm", "Hopeful", "Romantic"];
let moodsFive = ["Ecstatic", "Cheerful", "Enthusiastic", "Delighted", "Excited", "Energized"];

let highScoreMsg = "Glad to see you're keeping well! Here are some tips to keep your mood high:";
let lowScoreMsg = "Sorry to see you're not feeling too good, here are some tips that can help boost your mood:";
let tips = ['Try self-help CBT techniques', 'Increase helpful activity', 'Talk to someone', 'Get better sleep', 'Boost your mood with music', 'A little activity every day'];
const sourceLink = "https://www.nhs.uk/every-mind-matters/mental-health-issues/low-mood/";

const moodApi = "http://localhost:3000/api/mood";
const userApi = "http://localhost:3000/api/user";
const externalApi = "https://quotes.rest/qod";