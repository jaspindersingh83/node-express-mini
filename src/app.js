const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync("words.txt", "utf8");
  return contents.split("\n");
};

const allWords = readWords();
const randomInt = Math.floor(Math.random() * allWords.length);
const finalWorld = allWords[randomInt].toLowerCase();
console.log(finalWorld);
let lettersSoFar = new Set();

server.get("/", (req, res) => {
  res.status(200).send("Hello the Bollywood Star");
});
// TODO: your code to handle

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
server.post("/guess", (req, res) => {
  let { letter } = req.body;
  if (!isLetter(letter)) {
    res.status(400).send({ error: "Kindly enter an alphabet" });
  } else {
    if (lettersSoFar.has(letter)) {
      res.status(400).send({ error: "Letter Already Guessed" });
    } else {
      lettersSoFar.add(letter);
      res.send({ success: "letter added to guess" });
    }
  }
});

server.get("/guess", (req, res) => {
  let wordSoFar = "";
  let flag = true;
  for (let i = 0; i < finalWorld.length; i++) {
    let ch = finalWorld.charAt(i);
    if (lettersSoFar.has(ch)) {
      wordSoFar += ch;
    } else {
      flag = false;
      wordSoFar += "-";
    }
  }
  if (flag) {
    res.status(200).send(`Hurray you guesses the complete word ${wordSoFar}`);
  } else {
    res.status(200).send({ wordSoFar, guesses: Array.from(lettersSoFar) });
  }
});

server.listen(3000);
