import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
const database = new pg.Client({
    host: "localhost",
    user: "postgres",
    database: "CricketPlayers",
    password: "admin123",
    port: 5432
});
database.connect();
let players = [];
let currentPlayer = {};
database.query("select * from cricplayers", function (err, res) {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        players = res.rows;
    }
});
let totalcount = 0;
app.get("/", function (req, res) {
    totalcount=0;
    nextPlayer();
    res.render("index.ejs", { player: currentPlayer});
});
app.post("/submit", function (req, res) {
    var nation_name = req.body.nation_name.trim();
    console.log(nation_name.toLowerCase());
    console.log(currentPlayer.country.toLowerCase());
    let is_Correct=false;
    if(nation_name.toLowerCase()===currentPlayer.country.toLowerCase()) {
        console.log("correct");
        totalcount++ 
        is_Correct=true;
    }
    nextPlayer();
    res.render("index.ejs",{
        player:currentPlayer,
        totalScore:totalcount,
        wasCorrect:is_Correct
    });
});


function nextPlayer(){
    var randomPlayer=players[Math.floor(Math.random()*players.length)]
    currentPlayer=randomPlayer;
}
app.listen(port, function () {
    console.log(port);
});
