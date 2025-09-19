// addLocations.js
import fs from "fs";
import readline from "readline";

const FILE = "locations.json";

function loadExisting() {
  if (!fs.existsSync(FILE)) return [];
  try {
    const text = fs.readFileSync(FILE, "utf8");
    // locations.js is JSON, so parse it
    const data = JSON.parse(text);
    return Array.isArray(data.locations) ? data.locations : [];
  } catch (err) {
    console.warn("⚠️ Could not read existing file, starting fresh:", err.message);
    return [];
  }
}

const locations = loadExisting();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Enter locations one by one. Type 'exit' or press Ctrl+C to finish.");
console.log(`Currently stored: ${locations.length}`);

function ask() {
  rl.question("> ", (answer) => {
    if (answer.toLowerCase() === "exit") {
      rl.close();
    } else {
      locations.push(answer);
      ask();
    }
  });
}

rl.on("close", () => {
  fs.writeFileSync(FILE, JSON.stringify({ locations }, null, 2));
  console.log(`\nSaved ${locations.length} locations to ${FILE}`);
  process.exit(0);
});

ask();
