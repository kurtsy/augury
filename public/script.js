const birdImage = document.getElementById("birdImage");
const birdCaption = document.getElementById("birdCaption");
const birdSymbolism = document.getElementById("birdSymbolism");
const refreshButton = document.getElementById("refreshButton");

async function fetchBirdImageFromWikimedia() {
  birdCaption.textContent = "Calling to the skies...";
  birdSymbolism.textContent = "Listening for wings...";

const birdSpeciesList = [
  "Owl", "Crow", "Raven", "Magpie", "Jay", "Cardinal", "Hawk", "Eagle",
  "Vulture", "Falcon", "Kestrel", "Osprey", "Swan", "Egret", "Crane",
  "Spoonbill", "Ibis", "Stork", "Pelican", "Anhinga", "Cormorant", "Kingfisher",
  "Woodpecker", "Flicker", "Hummingbird", "Finch", "Goldfinch", "Grosbeak",
  "Waxwing", "Chickadee", "Titmouse", "Wren", "Bluebird", "Robin", "Catbird",
  "Mockingbird", "Thrasher", "Grackle", "Blackbird", "Meadowlark", "Starling",
  "Swallow", "Martin", "Loon", "Grebe", "Killdeer", "Snipe", "Woodcock", "Gull",
  "Tern", "Dove", "Peacock", "Quail", "Bobwhite", "Emu", "Ostrich", "Cassowary",
  "Shoebill", "Hoatzin", "Secretarybird", "Condor", "Quetzal", "Bird of Paradise",
  "Lyrebird", "Penguin", "Flamingo", "Albatross", "Nightingale", "Canary",
  "Pigeon", "Parrot", "Cockatoo", "Macaw", "Lovebird", "Toucan", "Hornbill",
  "Jacana", "Avocet", "Lapwing", "Phalarope", "Rail", "Bustard", "Cuckoo",
  "Swift", "Coot", "Bittern", "Curlew", "Godwit", "Sandpiper", "Whimbrel",
  "Skimmer", "Shearwater", "Petrel", "Booby", "Frigatebird", "Greylag Goose",
  "Canada Goose", "Duck", "Teal", "Mallard", "Shoveler", "Pintail", "Eider",
  "Harlequin Duck", "Scoter", "Merganser", "Weaver", "Bowerbird", "Bee-eater", "Roller", "Drongo", "Shrike", "Lark", "Bulbul", "Warbler", "Thrush", "Pipit", "Accentor", "Bunting", "Tanager",
  "Barbet", "Sunbird", "Spurfowl", "Francolin", "Bustard", "Cisticola",
  "Courser", "Pratincole", "Stone-curlew", "Pluvian", "Jacamar", "Antbird",
  "Frogmouth", "Nightjar", "Oilbird", "Seriema", "Kagu", "Tinamous", "Guineafowl",
  "Roadrunner", "Coucal", "Ani", "Turaco", "Mousebird", "Sunbittern", "Tropicbird",
  "Egret", "Heron", "Bittern", "Crake", "Moorhen", "Gallinule", "Spoonbill",
  "Bustard", "Rail", "Cormorant", "Sheathbill", "Harrier", "Buzzard",
  "Jabiru", "Stilt", "Phalarope", "Dotterel", "Turnstone", "Wagtail", "Trogon",
  "Motmot", "Chough", "Darter", "Rook", "Wheatear", "Siskin", "Kinglet",
  "Gannet", "Iora", "Leafbird", "Nuthatch", "Treecreeper", "Flowerpecker",
  "Fairywren", "Boobook", "Grassbird", "Babbler", "Laughingthrush", "Minivet",
  "Paradise Flycatcher", "Helmetshrike", "Brubru", "Plover", "Dotterel", "Sandgrouse",
  "Bushshrike", "Penduline Tit", "Rufous Hornero", "Lapwing", "Thick-knee", "Ovenbird",
  "Manakin", "Cotinga", "Bellbird", "Antpitta", "Tapaculo", "Trumpeter", "Chachalaca"
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
