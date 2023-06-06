const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const { open } = require("sqlite");
const initialise = async () => {
  try {
    db = await open({
      filename: dbPath,
      Driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running Successfully");
    });
  } catch (e) {
    console.log(`error in running ${e.message}`);
    process.exit(1);
  }
};

//1. Get list of players
app.get("/players", async (request, response) => {
  const getPlayersList = `
    Select * 
    from cricket_team `;
  const dbResponse = await db.all(getPlayersList);
  response.send(dbResponse);
});

// 2.Post New player

app.post("/players", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayer = `
     INSERT INTO
      book (playerName,jerseyNumber,role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         ${role}
      );`;
  const dbResponse = db.run(addPlayer);
  response.send("Player Added to Team");
});
