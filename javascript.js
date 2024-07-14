// Board object
const board = (function() {
    // Create an empty array grid
    let grid = [];

    // Winning lines
    const winningLines = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],   // Rows
        [1, 4, 7], [2, 5, 8], [3, 6, 9],   // Columns
        [1, 5, 9], [3, 5, 7]               // Diagonals
    ];


    // Initialize the grid with empty values
    function initializeBoard() {
        grid = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                row.push(null); 
            }
            grid.push(row);
        }
    }

    function displayGrid() {
        // console.log(grid.map(row => row.map(cell => cell || '.').join(' ')).join('\n'));
        renderHTML.grid(grid);
    }

    // Sets player marker on chosen cell
    function setPlayerMarker(row, col, marker) {
        if (grid[row][col] === null) {
            grid[row][col] = marker;
            return true;
        } else {
            return false;
        }
    }

    // Exposed functions
    return { setPlayerMarker, initializeBoard, displayGrid, winningLines };
})();

// Player object
const createPlayer = (function() {
    let currentPlayer = 0 // Tracks current player, 0 or 1
    const markers = ['X', 'O'] // Available markers

    return function(name) {
        let playerName = name;
        let playerMarker = markers[currentPlayer];
        let playerPositions = [];
        let score = 0;

        currentPlayer = currentPlayer === 0 ? 1 : 0; // Switch 0 and 1

        getName = () => playerName;
    
        getMarker = () => playerMarker;

        getScore = () => score;

        addScore = () => score++;
        
        addPlayerPosition = (position) =>  playerPositions.push(position); // keeps track of players marks on the grid

        getPlayerPositions = () => playerPositions;

        resetPlayerPositions = () => playerPositions = [];
        
        // Exposed functions
        return { getName, getMarker, addPlayerPosition, getPlayerPositions, getScore, addScore, resetPlayerPositions };
    }
})();


// Game object, controls the flow of the game
const game = (function() {   
    let players = [];
    let currentPlayer = 0;
    let turnCount = 0;
    let isGameActive = true; 

    // Initialises the game
    function initializeGame() {  
        reset();
        board.initializeBoard();
        renderHTML.getPlayerName(() => {
            renderHTML.playersScore(players);
            board.displayGrid();
            renderHTML.gameMessage(`${getCurrentPlayer().getName()} place your marker!`);
        });
    }

    // Turns: each time user click cells. 
    function playTurn(position) {
        if (!isGameActive) return; // If the game is not active, do nothing
        const currentPlayer = getCurrentPlayer();

        const row = Math.floor((position - 1) / 3); // Converts current positions row
        const col = (position - 1) % 3; // Converts current positions col

        if (board.setPlayerMarker(row, col, currentPlayer.getMarker())) {
            currentPlayer.addPlayerPosition(position); // Add new placed marker to current user.
            board.displayGrid();
            turnCount++;
            if (gameOver()) {
                isGameActive = false;
                return;
            }
            switchTurn();
            renderHTML.gameMessage(`${getCurrentPlayer().getName()} place your marker!`);
        } else {
            renderHTML.gameMessage("already occupied");
        }
    }

    // Switch player for next turn.
    function switchTurn() {
        currentPlayer = currentPlayer === 0 ? 1 : 0;
    }

    // Adds two player with their names 
    function addPlayer(player1, player2) {
        const p1 = createPlayer(player1);
        const p2 = createPlayer(player2);
        players.push(p1, p2);
    }
    
    // Checks if game is over
    function gameOver() {
        let gameWon = checkWinner();

        if (gameWon) {
            renderHTML.gameMessage(`${getCurrentPlayer().getName()} WINS!`);
            renderHTML.replayOrReset();
            getCurrentPlayer().addScore();
            renderHTML.playersScore(players);
            return true;
        }
        if (turnCount === 9 && !gameWon) {
            renderHTML.gameMessage("It's a tie!");
            renderHTML.replayOrReset();
            return true;
        }
    }

    // Checks for winning line. 
    function checkWinner() {
        const player = getCurrentPlayer().getPlayerPositions();
        for (let lines of board.winningLines) {
            if (lines.every(pos => player.includes(pos))) {
                return true;
            }
        }
        return false;
    }

    // Resets game
    function reset() {
        players = [];
        turnCount = 0;
        currentPlayer = 0;
        isGameActive = true;
        renderHTML.gameMessage(``);
    }

    // Replay game
    function replay() {
        turnCount = 0;
        currentPlayer = 0;
        players[0].resetPlayerPositions();
        players[1].resetPlayerPositions();
        isGameActive = true;
        board.initializeBoard();
        board.displayGrid();
        renderHTML.gameMessage(`${getCurrentPlayer().getName()} place your marker!`);
    }

    // Returns current player
    getCurrentPlayer = () => players[currentPlayer];
    // Return all players
    getAllPlayers = () => players;


    return { initializeGame, getCurrentPlayer, playTurn, addPlayer, replay }
})();

// Renders all html. 
const renderHTML = (function() {
    // Cache document elements
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('reset');
    const replayButton = document.getElementById('replay');
    const gameBoard = document.getElementById('gameboard');
    const messageDiv = document.getElementById('game_message');
    const player1 = document.getElementById('player_one');
    const player2 = document.getElementById('player_two');
    const popup = document.getElementById('popup');
    const popupSubmit = document.getElementById('submit-names');
    const gameScore = document.getElementById('gamescore');

    // Starts game when button clicked.
    startButton.addEventListener('click', () => {
        game.initializeGame();
        startButton.style.display = 'none';
    });

    resetButton.addEventListener('click', () => {
        game.initializeGame();
        resetButton.style.display = 'none';
        replayButton.style.display = 'none';
    });

    replayButton.addEventListener('click', () => {
        game.replay();
        replayButton.style.display = 'none';
        resetButton.style.display = 'none';
    });

    // Displays gameboard with position value
    function grid(grid) {
        gameBoard.innerHTML = ''; // Clear the board

        let position = 1; // Cells are 1 - 9

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.className = `bg-white flex items-center justify-center h-24 text-5xl font-bold border-gray-700`;
                
                if (i < 2) cell.className += ' border-b-4';
                if (j < 2) cell.className += ' border-r-4';
                cell.dataset.position = position; // GIve position value for the cell
                cell.textContent = grid[i][j] || '';
                cell.addEventListener('click', selectedCell);
                gameBoard.appendChild(cell);

                position++;
            }
        }
    }

    // Displays replay and reset button
    function replayOrReset() {
        replayButton.style.display = 'inline-block';
        resetButton.style.display = 'inline-block';
    }

    // Display in game message
    function gameMessage(message) {
        if (message) {
            messageDiv.textContent = message;
            messageDiv.style.display = 'block'; // Show the message
        } else {
            messageDiv.textContent = ''; // Clear any previous message
            messageDiv.style.display = 'none'; // Hide the message
        }
    }

    // Triggers event on the grid
    function selectedCell(event) {
        const position = event.target.dataset.position;
        game.playTurn(parseInt(position));
    }

    // Displays player name and score
    function playersScore(players) {
        gameScore.textContent = players[0].getScore() + '  SCORE  ' + players[1].getScore();
        player1.textContent = players[0].getName() + ': X';
        player2.textContent = players[1].getName() + ': O';
    }

    // Popup for playername input
    function getPlayerName(callback) {
        popup.style.display = 'flex';

        popupSubmit.addEventListener('click', () => {
            const p1 = document.getElementById('player1').value;
            const p2 = document.getElementById('player2').value;

            if (p1 && p2) {
                popup.style.display = 'none';
                game.addPlayer(p1, p2);
                callback();
            } else {
                alert("Please enter names for both players.");
            }
        });
    }

    return { playersScore, grid, gameMessage, getPlayerName, replayOrReset }
})();
