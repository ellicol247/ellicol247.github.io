
const triviaBtn = document.querySelector("#js-new-quote");
const factBtn = document.querySelector("#js-tweet");


const breedNameEl = document.querySelector("#js-quote-text");
const factEl = document.querySelector("#js-answer-text");
const imgEl = document.querySelector("#js-fish-img");


const dogImageAPI = "https://dog.ceo/api/breeds/image/random";
const uselessFactAPI = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";

// store the current dog info
let current = {
  breed: "",
  fact: "",
  image: ""
};

// event listeners
triviaBtn.addEventListener("click", newDog);
factBtn.addEventListener("click", showFact);


async function newDog() {
  breedNameEl.textContent = "Loading dog...";
  factEl.textContent = "";
  imgEl.src = "";

  try {
    // get dog image
    const imageResponse = await fetch(dogImageAPI);
    if (!imageResponse.ok) throw new Error("Image fetch failed");
    const imageData = await imageResponse.json();

    const url = imageData.message;
    const breed = extractBreedName(url);
    current.breed = capitalizeWords(breed);
    current.image = url;

    // get random fact from the api
    const factResponse = await fetch(uselessFactAPI);
    if (!factResponse.ok) throw new Error("Fact fetch failed");
    const factData = await factResponse.json();

    current.fact = factData.text || "No useless fact available right now.";

    // show dog image and breed
    displayDog(current.breed, current.image);

  } catch (err) {
    console.error("Error loading data:", err);
    breedNameEl.textContent = "Failed to load dog or fact. Try again.";
    factEl.textContent = "";
    imgEl.src = "";
  }
}


function extractBreedName(url) {
  const parts = url.split("/");
  const breedsIndex = parts.indexOf("breeds");
  if (breedsIndex !== -1 && parts.length > breedsIndex + 1) {
    return parts[breedsIndex + 1].split("-")[0];
  }
  return "Unknown";
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}


function displayDog(breed, image) {
  breedNameEl.textContent = breed;
  imgEl.src = image;
  imgEl.alt = `A cute ${breed} dog`;
}


function showFact() {
  factEl.textContent = current.fact || "No fact available yet. Try loading a dog first!";
}

// load an initial dog on page load
newDog();
