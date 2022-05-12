const tellJokeBtn = document.getElementById("button-tellJoke");
const buttonControl = document.getElementById("button-control");
const buttonCaptions = document.getElementById("button-captions");
const captionsContainer = document.getElementById("captions-container");
const captionsWrapper = document.getElementById("captions-wrapper");
const captionsText = document.getElementById("captions-text");
const controlIcon = document.getElementById("buttonControl-icon");
const audioElement = document.getElementById("audio");

const apiUrl =
  "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist";

let firstTime = true;
let captionsOpen = false;

function replaceClass(element, oldValue, newValue) {
  element.classList.remove(oldValue);
  element.classList.add(newValue);
}

// Disable/Enable Buttons
function toggleButtons() {
  tellJokeBtn.disabled = !tellJokeBtn.disabled;

  if (tellJokeBtn.disabled) {
    replaceClass(controlIcon, "fa-play", "fa-pause");
  } else {
    replaceClass(controlIcon, "fa-pause", "fa-play");
  }
}

// Toggle play/pause control
function toggleControl() {
  toggleButtons();

  if (audioElement.paused) {
    audioElement.play();
  } else {
    audioElement.pause();
  }
}

// Change captions text
function updateCaptions(joke) {
  captionsText.innerHTML = joke;
  if (captionsOpen) {
    resizeCaptions(true);
  }
}

// Get Jokes from Joke API
async function getJoke() {
  try {
    // Disable buttons
    toggleButtons();

    if (firstTime) {
      buttonControl.disabled = false;
      buttonCaptions.disabled = false;
      replaceClass(controlIcon, "fa-play", "fa-pause");
      firstTime = false;
    }

    // TODO: Add a loader functionality

    let joke = "";

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.type == "single") {
      joke = data.joke;
    } else {
      joke = `${data.setup} ... ${data.delivery}`;
    }
    updateCaptions(joke);

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

function toggleCaptions() {
  captionsOpen = !captionsOpen;
  resizeCaptions(captionsOpen);
}

function resizeCaptions(close) {
  if (captionsOpen) {
    captionsContainer.style.height = captionsWrapper.clientHeight + "px";
    captionsContainer.style.borderWidth = "2px";
  } else {
    captionsContainer.style.height = 0;
    captionsContainer.style.borderWidth = "0px";
  }
}

tellJokeBtn.addEventListener("click", getJoke);
buttonControl.addEventListener("click", toggleControl);
buttonCaptions.addEventListener("click", toggleCaptions);

audioElement.addEventListener("ended", toggleButtons);
