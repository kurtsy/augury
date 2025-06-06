const birdImage = document.getElementById("birdImage");
const birdCaption = document.getElementById("birdCaption");
const birdSymbolism = document.getElementById("birdSymbolism");
const refreshButton = document.getElementById("refreshButton");

refreshButton.addEventListener("click", fetchBirdImageFromWikimedia);

async function fetchBirdImageFromWikimedia() {
  birdCaption.textContent = "Calling to the skies...";
  birdSymbolism.textContent = "Listening for wings...";

  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=categorymembers&gcmtitle=Category:Birds&gcmtype=file&gcmlimit=50&prop=imageinfo&formatversion=2&iiprop=url|extmetadata`;

    const response = await fetch(url);
    const data = await response.json();

    const pages = data.query?.pages;
    const files = Object.values(pages || {}).filter(p => p.imageinfo?.[0]?.url);

    if (!files.length) {
      birdCaption.textContent = "No bird could be seen. Try again.";
      birdImage.src = ""; // clear image
      return;
    }

    const chosen = files[Math.floor(Math.random() * files.length)];
    const imageUrl = chosen.imageinfo[0].url;
    const rawTitle = chosen.title.replace("File:", "").replace(/_/g, " ");
    const species = rawTitle.split(".")[0];

    birdImage.src = imageUrl;
    birdImage.alt = species;
    birdCaption.textContent = `${species} — the omen appears.`;

    fetchBirdSymbolism(species);

  } catch (error) {
    console.error("Image fetch error:", error);
    birdCaption.textContent = "The veil remains drawn.";
    birdSymbolism.textContent = "";
    birdImage.src = "";
  }
}

async function fetchBirdSymbolism(species) {
  console.log("Sending species to server:", species);
  debugger;

  try {
    const response = await fetch("https://augury.onrender.com/api/omen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ species })
    });

    const data = await response.json();
    console.log("Response from server:", data);
    birdSymbolism.textContent = data.omen || "The omen hides its meaning today.";
  } catch (err) {
    console.error("Omen fetch error:", err);
    birdSymbolism.textContent = "The spirits are silent...";
  }
}

// Load one bird omen when the page starts
document.addEventListener("DOMContentLoaded", () => {
  fetchBirdImageFromWikimedia();
});
