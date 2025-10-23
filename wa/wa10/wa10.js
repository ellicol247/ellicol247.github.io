const triviaBtn = document.querySelector("#js-new-quote");
const answerBtn = document.querySelector("#js-tweet");

const breedNameEl = document.querySelector("#js-quote-text");
const factEl = document.querySelector("#js-answer-text");
const imgEl = document.querySelector("#js-fish-img");

const endpoint = "https://dog.ceo/api/breeds/image/random";

// Small facts database keyed by breed name (all lowercase)
const breedFacts = {
  "bulldog": "Bulldogs were originally bred for bull baiting in England.",
  "dalmatian": "Dalmatians are known for their unique spotted coats and were once used as carriage dogs.",
  "poodle": "Poodles are highly intelligent and excel in obedience training.",
  "labrador": "Labrador Retrievers are one of the most popular dog breeds worldwide.",
  "beagle": "Beagles have an exceptional sense of smell and are used for detection work.",
  "husky": "Siberian Huskies are famous for their endurance and sled-pulling capabilities.",
  "chihuahua": "Chihuahuas are the smallest dog breed in the world.",
  "boxer": "Boxers are energetic and playful, often called “clowns” of the dog world.",
  "rottweiler": "Rottweilers are strong and loyal guard dogs.",
  "shiba": "Shiba Inus are a Japanese breed known for their spirited personality and fox-like appearance."
};

let current = {
  breed: "",
  fact: "",
  image: ""
};

triviaBtn.addEventListener("click", newDog);
answerBtn.addEventListener("click", showFact);

async function newDog() {
  breedNameEl.textContent = "Loading dog...";
  factEl.textContent = "";
  imgEl.src = "";
  imgEl.alt = "Loading image...";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Network error: " + response.status);
    }
    const data = await response.json();

    // Image url example:
    // https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg
    // Breed info is in the URL path: after "breeds/"
    const url = data.message;
    const breed = extractBreedName(url);

    current.breed = capitalizeWords(breed);
    current.image = url;
    current.fact = breedFacts[breed.toLowerCase()] || "Sorry, no fact available for this breed.";

    displayDog(current.breed, current.image);
  } catch (err) {
    console.error(err);
    breedNameEl.textContent = "Failed to load a dog. Try again.";
    factEl.textContent = "";
    imgEl.src = "";
  }
}

function extractBreedName(url) {
  // Extract breed name from URL path between 'breeds/' and next slash
  // Sometimes breed name is compound like hound-afghan (use first part)
  const parts = url.split("/");
  const breedsIndex = parts.findIndex(part => part === "breeds");
  if (breedsIndex !== -1 && parts.length > breedsIndex + 1) {
    // Take the breed part (sometimes with -)
    const breedPart = parts[breedsIndex + 1];
    // Some breed names are compound, return the first part for fact lookup
    return breedPart.split("-")[0];
  }
  return "Unknown";
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function displayDog(breed, image) {
  breedNameEl.textContent = breed;
  factEl.textContent = "";
  imgEl.src = image;
  imgEl.alt = `A cute ${breed} dog`;
}

function showFact() {
  if (!current.fact) {
    factEl.textContent = "No fact to show, press 'Show me a random dog!' first.";
  } else {
    factEl.textContent = current.fact;
  }
}

// Load initial dog on page load
newDog();