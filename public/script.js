const birdImage = document.getElementById("birdImage");
const birdCaption = document.getElementById("birdCaption");
const birdSymbolism = document.getElementById("birdSymbolism");
const refreshButton = document.getElementById("refreshButton");

async function fetchBirdImageFromWikimedia() {
  birdCaption.textContent = "Calling to the skies...";
  birdSymbolism.textContent = "Listening for wings...";

  const birdSpeciesList = [
    "Barn Owl", "Great Horned Owl", "Snowy Owl", "Barred Owl", "Eastern Screech Owl", "Long-eared Owl",
    "Crow", "American Crow", "Raven", "Common Raven", "Magpie", "Eurasian Magpie", "Blue Jay", "Steller's Jay",
    "Northern Cardinal", "Red-tailed Hawk", "Cooper's Hawk", "Sharp-shinned Hawk", "Bald Eagle",
    "Golden Eagle", "Osprey", "Peregrine Falcon", "American Kestrel", "Turkey Vulture", "Black Vulture",
    "Mute Swan", "Trumpeter Swan", "Tundra Swan", "Great Blue Heron", "Little Blue Heron", "Great Egret",
    "Green Heron", "Snowy Egret", "Sandhill Crane", "Roseate Spoonbill", "White Ibis", "Glossy Ibis",
    "Wood Stork", "American White Pelican", "Brown Pelican", "Anhinga", "Double-crested Cormorant",
    "Kingfisher", "Belted Kingfisher", "Woodpecker", "Downy Woodpecker", "Pileated Woodpecker",
    "Red-bellied Woodpecker", "Northern Flicker", "Ruby-throated Hummingbird", "Anna's Hummingbird",
    "House Finch", "American Goldfinch", "European Goldfinch", "Evening Grosbeak", "Cedar Waxwing",
    "Black-capped Chickadee", "Tufted Titmouse", "Carolina Wren", "House Wren", "Eastern Bluebird",
    "American Robin", "Gray Catbird", "Northern Mockingbird", "Brown Thrasher", "Common Grackle",
    "Red-winged Blackbird", "Eastern Meadowlark", "Western Meadowlark", "European Starling",
    "Swallow", "Barn Swallow", "Tree Swallow", "Purple Martin", "Common Loon", "Pied-billed Grebe",
    "Horned Grebe", "Killdeer", "Wilson's Snipe", "American Woodcock", "Ring-billed Gull",
    "Herring Gull", "Laughing Gull", "Common Tern", "Caspian Tern", "Rock Dove", "Mourning Dove",
    "White-winged Dove", "Peacock", "Indian Peafowl", "Quail", "Gambel's Quail",
    "California Quail", "Northern Bobwhite", "Emu", "Ostrich", "Cassowary", "Shoebill", "Hoatzin",
    "Secretarybird", "Andean Condor", "Resplendent Quetzal", "Bird of Paradise", "Lyrebird",
    "Fairy Penguin", "King Penguin", "African Penguin", "Flamingo", "American Flamingo"
  ];

  let tries = 0;
  const maxTries = 10;
  let imageUrl = null;
  let species = "";

  while (!imageUrl && tries < maxTries) {
    tries++;
    species = birdSpeciesList[Math.floor(Math.random() * birdSpeciesList.length)];

    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(species)}&prop=pageimages&piprop=original&origin=*`
      );

      const data = await response.json();
      const pages = data.query.pages;
      const page = pages[Object.keys(pages)[0]];
      imageUrl = page.original?.source;

      if (imageUrl) {
        birdImage.style.display = "none";
        birdImage.classList.add("loading");

        birdImage.onload = () => {
          birdImage.classList.remove("loading");
          birdImage.style.display = "block";
        };

        birdImage.onerror = () => {
          birdImage.classList.remove("loading");
          birdImage.style.display = "none";
          birdCaption.textContent = "No image found for this omen.";
        };

        birdImage.src = imageUrl;
        birdCaption.textContent = species;
        fetchBirdSymbolism(species);
        return;
      }
    } catch (error) {
      console.error(`Attempt ${tries} failed for ${species}`, error);
    }
  }

  birdImage.src = "";
  birdCaption.textContent = "No bird with an image found. Try again.";
  birdSymbolism.textContent = "The sky is quiet.";
}

async function fetchBirdSymbolism(species) {
  try {
    const response = await fetch("/api/omen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ species }),
    });

    const data = await response.json();
    if (data.omen) {
      birdSymbolism.textContent = data.omen;
    } else {
      birdSymbolism.textContent = "The omen is unclear.";
    }
  } catch (error) {
    console.error("🛑 Failed to fetch omen:", error);
    birdSymbolism.textContent = "The spirits did not answer.";
  }
}

// Initial omen on page load
fetchBirdImageFromWikimedia();

// Draw a new omen on button click
refreshButton.addEventListener("click", fetchBirdImageFromWikimedia);
