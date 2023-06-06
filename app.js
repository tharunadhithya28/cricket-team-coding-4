const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const path = require("path");
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const { open } = require("sqlite");
const initialiseDBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running Successfully");
    });
  } catch (e) {
    console.log(`error in running ${e.message}`);
    process.exit(1);
  }
};

initialiseDBServer();

//1. Get list of players
app.get("/players/", async (request, response) => {
  const getPlayersList = `
    Select * 
    from cricket_team `;
  const dbResponse = await db.all(getPlayersList);
  response.send(dbResponse);
});

// 2.Post New player

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayer = `
     INSERT INTO
      book (player_name,jersey_number,role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         ${role}
      );`;
  const dbResponse = await db.run(addPlayer);
  response.send("Player Added to Team");
});

//3.get a single player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId}`;
  const dbResponse = await db.get(getPlayer);
  response.send(dbResponse);
});

//4.Update a player
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayer = `
    UPDATE
      cricket_team
    SET
      player_name='${playerName}',
      jersey_number=${jerseyNumber},
      role=${role},
    WHERE
      playerId = ${playerId};`;
  const dbResponse = await db.run(updatePlayer);
  response.send("Player Details Updated");
});

//5.Delete a player
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId}`;
  const dbResponse = await db.run(deletePlayer);
  response.send("Player Removed");
});
