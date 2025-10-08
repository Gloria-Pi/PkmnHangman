/**
 * @file main.js
 * @author Gloria Paita
 * 
 * @description
 * This script implements a two-player Pokémon-themed Hangman game.
 * Each player attempts to guess a randomly selected Pokémon name.
 * The game displays hangman progress, handles letter input,
 * tracks score, and supports game continuation and full reset.
 */

//---------------------------------------------------------------------
// THE HANGMAN SECTION

/**
 * List of image paths representing hangman drawing stages.
 * The image updates with each incorrect guess.
 * @type {string[]}
 */
const hangmanStages = [
    "./assets/img/hangman-stages/hangman-0.svg",
    "./assets/img/hangman-stages/hangman-1.svg",
    "./assets/img/hangman-stages/hangman-2.svg",
    "./assets/img/hangman-stages/hangman-3.svg",
    "./assets/img/hangman-stages/hangman-4.svg",
    "./assets/img/hangman-stages/hangman-5.svg",
    "./assets/img/hangman-stages/hangman-6.svg",
    "./assets/img/hangman-stages/hangman-7.png",
    "./assets/img/hangman-stages/hangman-8.png",
    "./assets/img/hangman-stages/hangman-9.png"
];

// -----------------------------------------------------------------------------
// PLAYER 1 OBJECT

/**
 * Object containing Player 1's data, state, and methods.
 * Handles score, guessed letters, hangman visuals, and input logic.
 * Methods interact with the DOM to update the game state.
 */
const p1 = {

    /**
     * Displays a message in Player 1's narration box.
     * @param {string} p1Message - Message to display.
     */
    msgToThePlayer: function (p1Message) {
        document.querySelector("#p1-narration-div > p").textContent = p1Message;
    },

    name: "",

    /**
     * Retrieves Player 1's name from the input field.
     * Defaults to "Trainer 1" if no name is entered.
     * Updates all DOM references to the player’s name.
     */
    setName: function () {
        const player1Name = document.querySelector("#player1-name-input");
        this.name = player1Name.value.trim() || "Trainer 1";
        const p1Name = document.querySelectorAll(".player1-name");
        p1Name.forEach(element => {
            element.textContent = this.name;
        });
    },

    score: 0,

    /**
     * Increments Player 1's score by one and updates the DOM.
     */
    giveAPoint: function () {
        this.score += 1;
        document.querySelector("#player1-score > p:nth-child(2)").textContent = this.score;
    },

    /**
     * Resets Player 1's score to zero and updates the DOM.
     */
    resetScore: function () {
        this.score = 0;
        document.querySelector("#player1-score > p:nth-child(2)").textContent = this.score;
    },

    totalHearts: [],

    /**
     * Resets Player 1's heart display to 10 full hearts.
     */
    resetHearts: function () {
        const heartP = document.querySelector("#p1-hangman-tries > .remaining-tries");
        this.totalHearts = ["❤", "❤", "❤", "❤", "❤", "❤", "❤", "❤", "❤", "❤"];
        heartP.textContent = this.totalHearts.join("");
    },

    /**
     * Removes one heart from the heart display.
     */
    removeHearts: function () {
        const heartP = document.querySelector("#p1-hangman-tries > .remaining-tries");
        this.totalHearts.splice(-1, 1);
        heartP.textContent = this.totalHearts.join("");
    },

    numberOfGuesses: 0,
    wrongGuesses: -1,
    currentHangmanStage: 0,

    /**
     * Updates the hangman image based on the number of wrong guesses.
     * @param {string[]} hangmanArray - Array of image paths.
     */
    updateHangman: function (hangmanArray) {
        this.currentHangmanStage = hangmanArray[this.wrongGuesses];
        const hangmanNode = document.querySelector("#p1-hangman");
        hangmanNode.src = this.currentHangmanStage;
    },

    /**
     * Resets the hangman image to the starting graphic.
     */
    resetHangman: function () {
        const hangmanNode = document.querySelector("#p1-hangman");
        hangmanNode.src = "./assets/img/hangman-stages/hangman-start.png";
    },

    pickedWord: "",
    pickedWordArray: [],
    blankSpacesArray: [],
    alreadyGuessedLetters: [],

    /**
     * Updates the displayed word blanks in the DOM.
     */
    updateBlanks: function () {
        const newUnderscoreP = document.querySelector("#player1-section > .picked-word-div p");
        newUnderscoreP.textContent = this.blankSpacesArray.join("");
    },

    /**
     * Randomly selects a word from the given list and initializes game state.
     * @param {string[]} listOfWords - List of Pokémon names.
     */
    pickWord: function (listOfWords) {
        const pickedWordIndex = Math.floor((Math.random() * listOfWords.length));
        this.pickedWord = listOfWords[pickedWordIndex].toUpperCase();
        // Open the console to see which word was picked for Player 1 this round
        console.log("P1:", this.pickedWord);

        //eg. from "BUBBLES" to ["B", "U", "B", "B", "L", "E", "S"]
        this.pickedWordArray = this.pickedWord.split("");

        //eg from "YES" to ["_", "_", "_"]
        this.blankSpacesArray = this.pickedWord.replace(/[A-Z]/gi, "_").split("");
        this.updateBlanks();
    },

    /**
     * Displays the most recently guessed letter in the DOM.
     */
    displayGuessedLetters: function () {
        const previousPicksTitle = document.querySelector("#p1-guessed-letters-div > p");
        const newP = document.createElement("p");
        newP.textContent = this.alreadyGuessedLetters[this.alreadyGuessedLetters.length - 1];
        previousPicksTitle.insertAdjacentElement("afterend", newP);
    },

    /**
     * Resets all guessed letters and removes them from the DOM.
     */
    resetGuessedLetters: function () {
        this.alreadyGuessedLetters = [];

        const previousPicks = document.querySelectorAll("#p1-guessed-letters-div p");

        // Skip the first <p> (which is the "Past Picks" title)
        previousPicks.forEach((pElement, index) => {
            if (index !== 0) {
                pElement.remove();
            }
        });
    },

    /**
     * Checks if the most recent letter is in the word.
     * Updates blanks or hangman state accordingly.
     */
    isInWord: function () {
        const selectedLetter = this.alreadyGuessedLetters[this.alreadyGuessedLetters.length - 1];

        if (this.pickedWordArray.indexOf(selectedLetter) !== -1) {
            //Exchanging the letters with blanks "_"
            for (let index = 0; index < this.pickedWordArray.length; index++) {
                if (selectedLetter === this.pickedWordArray[index]) {
                    this.blankSpacesArray[index] = selectedLetter;
                } else {
                    continue;
                }
            }
            this.updateBlanks();
            this.msgToThePlayer(`GOTCHA, letter "${selectedLetter}" was caught!`);
            this.didPlayerWin();

        } else {
            this.msgToThePlayer(`Oh no, the letter "${selectedLetter}" ran away!`);
            this.removeHearts();
            this.displayGuessedLetters();
            this.wrongGuesses++;
            this.updateHangman(hangmanStages);
            this.didPlayerLose();
        }
    },

    /**
     * Checks if the player has guessed the entire word correctly.
     * Displays win message and updates score if so.
     */
    didPlayerWin: function () {
        if (this.pickedWordArray.join("") === this.blankSpacesArray.join("")) {

            this.msgToThePlayer("Victory! You gained +1 gym badges!");
            this.giveAPoint();

            const heartP = document.querySelector("#p1-hangman-tries > .remaining-tries");
            heartP.textContent = "VICTORY";

            disableAllInputs();
            enableContinueBtn();
        }
    },

    /**
     * Checks if the player has reached the maximum number of incorrect guesses.
     * Displays defeat message and disables further input.
     */
    didPlayerLose: function () {
        if (this.wrongGuesses === 9) {
            this.msgToThePlayer("Oh no, you lost! Want a rematch?");

            //disables the input
            document.querySelector("#player1-input").classList.add("disabled");
            document.querySelector("#player1-input").disabled = true;

            const heartP = document.querySelector("#p1-hangman-tries > .remaining-tries");
            heartP.textContent = "DEFEAT";
        }
    }
};


// -----------------------------------------------------------------------------
// INPUT HANDLING - PLAYER 1

/**
 * Handles keyup events for Player 1’s input field.
 * Filters valid single-letter inputs and handles repeated or invalid keys.
 * @param {KeyboardEvent} event
 */
function handleP1Keyup(event) {
    let pressedKey = event.key.toUpperCase();

    //checks whether it's a letter or another key
    if (/^[A-Z]$/i.test(pressedKey)) {
        //checks whether it's the first time the player selects said letter
        if (p1.alreadyGuessedLetters.includes(pressedKey)) {
            p1.msgToThePlayer("You've already caught that letter!");
        } else {
            p1.alreadyGuessedLetters.push(pressedKey);
            p1.isInWord();
            didBothPlayersHaveAGo(p1, p2);
        }

        //"Enter", "Shift", etc
    } else if (/^.{2,}$/.test(pressedKey)) {
        p1.msgToThePlayer("You pressed a forbidden key");
    } else {
        p1.msgToThePlayer("Not a letter!");
    }
    setTimeout(() => {
        const inputFieldP1 = document.querySelector("#player1-input");
        inputFieldP1.value = "";
    }, 1000);
}

// Attach listener
function registerP1Letters() {
    const inputFieldP1 = document.querySelector("#player1-input");
    inputFieldP1.addEventListener("keyup", handleP1Keyup);
}

// Detach and reattach listener
function resetP1LetterHistory() {
    const inputFieldP1 = document.querySelector("#player1-input");
    inputFieldP1.removeEventListener("keyup", handleP1Keyup);
    inputFieldP1.addEventListener("keyup", handleP1Keyup);
}

// -----------------------------------------------------------------------------
// PLAYER 2 OBJECT

/**
 * Same structure and behavior as Player 1, but scoped to Player 2's DOM elements.
 */
const p2 = {
    msgToThePlayer: function (p2Message) {
        document.querySelector("#p2-narration-div > p").textContent = p2Message;
    },
    name: "",
    setName: function () {
        const player2Name = document.querySelector("#player2-name-input");
        this.name = player2Name.value.trim() || "Trainer 2";
        const p2Name = document.querySelectorAll(".player2-name");
        p2Name.forEach(element => {
            element.textContent = this.name;
        });
    },
    score: 0,
    giveAPoint: function () {
        this.score += 1;
        document.querySelector("#player2-score > p:nth-child(2)").textContent = this.score;
    },
    resetScore: function () {
        this.score = 0;
        document.querySelector("#player2-score > p:nth-child(2)").textContent = this.score;
    },
    totalHearts: [],
    resetHearts: function () {
        const heartP = document.querySelector("#p2-hangman-tries > .remaining-tries");
        this.totalHearts = ["❤", "❤", "❤", "❤", "❤", "❤", "❤", "❤", "❤", "❤"];
        heartP.textContent = this.totalHearts.join("");
    },
    removeHearts: function () {
        const heartP = document.querySelector("#p2-hangman-tries > .remaining-tries");
        this.totalHearts.splice(-1, 1);
        heartP.textContent = this.totalHearts.join("");
    },
    numberOfGuesses: 0,
    wrongGuesses: -1,
    currentHangmanStage: 0,
    updateHangman: function (hangmanArray) {
        this.currentHangmanStage = hangmanArray[this.wrongGuesses];
        const hangmanNode = document.querySelector("#p2-hangman");
        hangmanNode.src = this.currentHangmanStage;
    },
    resetHangman: function () {
        const hangmanNode = document.querySelector("#p2-hangman");
        hangmanNode.src = "./assets/img/hangman-stages/hangman-start.png";
    },
    pickedWord: "",
    pickedWordArray: [],
    blankSpacesArray: [],
    alreadyGuessedLetters: [],
    updateBlanks: function () {
        const newUnderscoreP = document.querySelector("#player2-section > .picked-word-div p");
        newUnderscoreP.textContent = this.blankSpacesArray.join("");
    },
    pickWord: function (listOfWords) {
        const pickedWordIndex = Math.floor((Math.random() * listOfWords.length));
        this.pickedWord = listOfWords[pickedWordIndex].toUpperCase();
        //Open the console to see which word was picked for Player 2 this round
        console.log("P2:", this.pickedWord);

        //eg. from "BUBBLES" to ["B", "U", "B", "B", "L", "E", "S"]
        this.pickedWordArray = this.pickedWord.split("");

        //eg from "YES" to ["_", "_", "_"]
        this.blankSpacesArray = this.pickedWord.replace(/[A-Z]/gi, "_").split("");

        this.updateBlanks();
    },
    displayGuessedLetters: function () {
        const previousPicksTitle = document.querySelector("#p2-guessed-letters-div > p");
        const newP = document.createElement("p");
        newP.textContent = this.alreadyGuessedLetters[this.alreadyGuessedLetters.length - 1];
        previousPicksTitle.insertAdjacentElement("afterend", newP);
    },
    resetGuessedLetters: function () {
        this.alreadyGuessedLetters = [];

        const previousPicks = document.querySelectorAll("#p2-guessed-letters-div p");

        // Skip the first <p> (which is the "Past Picks" title)
        previousPicks.forEach((pElement, index) => {
            if (index !== 0) {
                pElement.remove();
            }
        });
    },
    isInWord: function () {
        const selectedLetter = this.alreadyGuessedLetters[this.alreadyGuessedLetters.length - 1];

        if (this.pickedWordArray.indexOf(selectedLetter) !== -1) {
            for (let index = 0; index < this.pickedWordArray.length; index++) {
                if (selectedLetter === this.pickedWordArray[index]) {
                    this.blankSpacesArray[index] = selectedLetter;
                } else {
                    continue;
                }
            }
            this.updateBlanks();
            this.msgToThePlayer(`GOTCHA, letter "${selectedLetter}" was caught!`);
            this.didPlayerWin();
        } else {
            this.msgToThePlayer(`Oh no, the letter "${selectedLetter}" ran away!`);
            this.removeHearts();
            this.displayGuessedLetters();
            this.wrongGuesses++;
            this.updateHangman(hangmanStages);
            this.didPlayerLose();
        }
    },
    didPlayerWin: function () {
        if (this.pickedWordArray.join("") === this.blankSpacesArray.join("")) {

            this.msgToThePlayer("Victory! You gained +1 gym badges!");
            this.giveAPoint();

            const heartP = document.querySelector("#p2-hangman-tries > .remaining-tries");
            heartP.textContent = "VICTORY";

            disableAllInputs();
            enableContinueBtn();
        }
    },
    didPlayerLose: function () {
        if (this.wrongGuesses === 9) {
            this.msgToThePlayer("Oh no, you lost! Want a rematch?");

            //disables the input
            document.querySelector("#player2-input").classList.add("disabled");
            document.querySelector("#player2-input").disabled = true;

            const heartP = document.querySelector("#p2-hangman-tries > .remaining-tries");
            heartP.textContent = "DEFEAT";
        }
    }
};

// -----------------------------------------------------------------------------
// INPUT HANDLING - PLAYER 2

/**
 * Handles keyup events for Player 2’s input field.
 * Filters valid single-letter inputs and handles repeated or invalid keys.
 * @param {KeyboardEvent} event
 */
function handleP2Keyup(event) {
    let pressedKey = event.key.toUpperCase();

    //checks whether it's a letter or another key
    if (/^[A-Z]$/i.test(pressedKey)) {
        //checks whether it's the first time the player selects said letter
        if (p2.alreadyGuessedLetters.includes(pressedKey)) {
            p2.msgToThePlayer("You've already caught that letter!");
        } else {
            p2.alreadyGuessedLetters.push(pressedKey);
            p2.isInWord();
            didBothPlayersHaveAGo(p1, p2);
        }

        //"Enter", "Shift", etc
    } else if (/^.{2,}$/.test(pressedKey)) {
        p2.msgToThePlayer("You pressed a forbidden key");
    } else {
        p2.msgToThePlayer("Not a letter!");
    }
    setTimeout(() => {
        const inputFieldP2 = document.querySelector("#player2-input");
        inputFieldP2.value = "";
    }, 1000);
}

// Attach listener
function registerP2Letters() {
    const inputFieldP2 = document.querySelector("#player2-input");
    inputFieldP2.addEventListener("keyup", handleP2Keyup);
}

// Detach and reattach listener
function resetP2LetterHistory() {
    const inputFieldP2 = document.querySelector("#player2-input");
    inputFieldP2.removeEventListener("keyup", handleP2Keyup);
    inputFieldP2.addEventListener("keyup", handleP2Keyup);
}

// -----------------------------------------------------------------------------
// GAME SETUP

/**
 * List of Pokémon starter names used as target words.
 * @type {string[]}
 */
const starterPokemon = [
    "Bulbasaur", "Charmander", "Squirtle",
    "Chikorita", "Cyndaquil", "Totodile",
    "Treecko", "Torchic", "Mudkip",
    "Turtwig", "Chimchar", "Piplup",
    "Snivy", "Tepig", "Oshawott",
    "Chespin", "Fennekin", "Froakie",
    "Rowlet", "Litten", "Popplio",
    "Grookey", "Scorbunny", "Sobble",
    "Sprigatito", "Fuecoco", "Quaxly"
];

const continueButton = document.getElementById("continue-button");
continueButton.addEventListener("click", () => {
    continueForBothPlayers(p1, p2);
    disableContinueBtn();
});

/**
 * Continues the game for both players by resetting state and selecting new words.
 * @param {Object} player1 - Player 1 object.
 * @param {Object} player2 - Player 2 object.
 */
function continueForBothPlayers(player1, player2) {
    player1.resetHearts();
    player1.resetHangman();
    player1.resetGuessedLetters();
    resetP1LetterHistory();
    player1.msgToThePlayer("Here we go again!");
    player1.numberOfGuesses = 0;
    player1.wrongGuesses = -1;
    player1.pickWord(starterPokemon);
    registerP1Letters();

    player2.resetHearts();
    player2.resetHangman();
    player2.resetGuessedLetters();
    resetP2LetterHistory();
    player2.msgToThePlayer("Here we go again!");
    player2.numberOfGuesses = 0;
    player2.wrongGuesses = -1;
    player2.pickWord(starterPokemon);
    registerP2Letters();

    enableAllInputs();
}

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
    resetForBothPlayers(p1, p2);
});

/**
 * Fully resets the game for both players, including scores and guesses.
 * @param {Object} player1 - Player 1 object.
 * @param {Object} player2 - Player 2 object.
 */
function resetForBothPlayers(player1, player2) {
    player1.resetHearts();
    player1.resetHangman();
    player1.resetGuessedLetters();
    resetP1LetterHistory();
    player1.msgToThePlayer("Your Pokéball supply has been restored! Good luck!");
    player1.resetScore();
    player1.numberOfGuesses = 0;
    player1.wrongGuesses = -1;
    player1.pickWord(starterPokemon);

    player2.resetHearts();
    player2.resetHangman();
    player2.resetGuessedLetters();
    resetP2LetterHistory();
    player2.msgToThePlayer("Your Pokéball supply has been restored! Good luck!");
    player2.resetScore();
    player2.numberOfGuesses = 0;
    player2.wrongGuesses = -1;
    player2.pickWord(starterPokemon);

    enableAllInputs();
}

function disableAllInputs() {
    document.querySelector("#player1-input").disabled = true;
    document.querySelector("#player2-input").disabled = true;
}

function enableAllInputs() {
    document.querySelector("#player1-input").disabled = false;
    document.querySelector("#player2-input").disabled = false;
}

function enableContinueBtn() {
    document.querySelector("#continue-button").disabled = false;
}

function disableContinueBtn() {
    document.querySelector("#continue-button").disabled = true;
}

const gameStartButton = document.getElementById("game-start-button");

/**
 * Starts the game by setting player names, initializing UI, and assigning words.
 */
gameStartButton.addEventListener("click", () => {
    p1.setName();
    p2.setName();
    document.getElementById("game-section").classList.remove("hidden");
    document.getElementById("start-screen").classList.add("hidden");

    disableContinueBtn();
    p1.resetHearts();
    p2.resetHearts();
    p1.pickWord(starterPokemon);
    p2.pickWord(starterPokemon);
    registerP1Letters();
    registerP2Letters();
});


// -----------------------------------------------------------------------------
// GAME TURN HANDLING

/**
 * Determines if both players have taken a turn.
 * Disables the input field of the player who has already guessed.
 * @param {Object} player1 - Player 1 object.
 * @param {Object} player2 - Player 2 object.
 */
function didBothPlayersHaveAGo(player1, player2) {
    if (player1.alreadyGuessedLetters.length === player2.alreadyGuessedLetters.length) {
        enableAllInputs();
    } else if (player1.alreadyGuessedLetters.length > player2.alreadyGuessedLetters.length) {
        document.querySelector("#player1-input").disabled = true;
    } else {
        document.querySelector("#player2-input").disabled = true;
    }
}