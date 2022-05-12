const button = document.getElementById("button");
const audioElement = document.getElementById("audio");

const apiUrl =
  "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist";

// Disable/Enable Button
function toggleButton() {
  button.disabled = !button.disabled;
}

// Get Jokes from Joke API
async function getJoke() {
  try {
    // Disable button
    toggleButton();

    // TODO: Add a loader functionality

    let joke = "";
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.type == "single") {
      joke = data.joke;
    } else {
      joke = `${data.setup} ... ${data.delivery}`;
    }

    // Text-to-Speech
    tellJoke(joke);
  } catch (error) {
    console.log("Unexpected error:", error);
  }
}

// Passing Joke to VoiceRSS API
function tellJoke(joke) {
  VoiceRSS.speech({
    key: "56008d13c83f4c67a267b6c01477f05b",
    src: joke,
    hl: "en-us",
    v: "Mary",
    r: 1,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
}

button.addEventListener("click", getJoke);

audioElement.addEventListener("ended", toggleButton);
