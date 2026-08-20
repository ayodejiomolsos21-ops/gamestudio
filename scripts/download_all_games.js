import fs from 'fs';

async function extractAllGames() {
  const domain = "https://a.luminsdk.com";
  console.log("Creating session...");
  const sessionRes = await fetch(`${domain}/api/v1/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://bullismygoat.s3.amazonaws.com",
      "Referer": "https://bullismygoat.s3.amazonaws.com/x7k9m2p.html",
      "User-Agent": "Mozilla/5.0"
    },
    body: JSON.stringify({})
  });
  const sessionData = await sessionRes.json();
  const sessionId = sessionData.session_id;
  console.log("Obtained Session ID:", sessionId);

  const headers = {
    "Origin": "https://bullismygoat.s3.amazonaws.com",
    "Referer": "https://bullismygoat.s3.amazonaws.com/x7k9m2p.html",
    "X-Session": sessionId,
    "User-Agent": "Mozilla/5.0"
  };

  let allGames = [];
  let page = 1;
  const limit = 100;

  while (true) {
    console.log(`Fetching page ${page}...`);
    const res = await fetch(`${domain}/api/v1/games?page=${page}&limit=${limit}`, { headers });
    if (!res.ok) {
      console.error(`Page ${page} failed with status ${res.status}`);
      break;
    }
    const data = await res.json();
    if (!data || !data.games || data.games.length === 0) {
      console.log("No more games found.");
      break;
    }

    allGames.push(...data.games);
    console.log(`Page ${page}: got ${data.games.length} games (total so far: ${allGames.length} / ${data.total})`);

    if (allGames.length >= data.total || page >= data.pages) {
      break;
    }
    page++;
  }

  console.log(`\nSuccessfully downloaded ${allGames.length} games!`);

  // Write raw games to disk
  fs.writeFileSync('./src/data/luminGames.json', JSON.stringify(allGames, null, 2));
  console.log("Saved raw games to ./src/data/luminGames.json");

  // Inspect sample
  console.log("First 5 games:", allGames.slice(0, 5));
  console.log("Last 5 games:", allGames.slice(-5));
}

extractAllGames().catch(console.error);
