# Javascript: Tic-Tac-Toe

## Description
A browser based javascript Tic-Tac-Toe game. 
The approach of this project was inside out approach by creating working version of console based first than applying HTML/CSS DOM elements. 
This project also implements encapsulation by module pattern:IIFEs(Immediately Invoked Function Expression).
It is also my first attempt at using tailwind css. 

## Usage
You can play the game here [Tic-Tac-Toe](https://kcstarless.github.io/javascript-tic-tac-toe/).

1. To play the game user wil need to click `Lets Start!` button. 
2. Pop-up prompt will appear with two fields for `Player 1` and `Player 2`.
3. You can use the default names or pick your own name. 
4. An empty board, current score and player names will be displayed and a player will be notified to place their marker on the board. 
5. Game will switch player as player places their mark on the board.
6. If there is a winner game will end and players will have choice to player again or reset the whole game.
    - `Play Again!` path:
    This will keep existing players and score but plays new game.
    - `Reset!` path:
    This will reset whole game including player name and their score. User will be prompted to enter player 1 and 2 name again. 
7. Board will be locked and unable to click once winner is found or game is a tie. 
8. Players can not place or replace existing marker on the board. Player will be notified. 

## Game Logic
To determine the winner as game is played, it has pre-determined values of lines that is `winningLines` as follow:


```javascript

const winningLines = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9],   // Rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9],   // Columns
    [1, 5, 9], [3, 5, 7]               // Diagonals
];

```

The board is stored and displayed as 2D array as follow: 

```javascript

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

```

Every time marker is placed on the board that players position value will be stored in `playerPositions` array. This positions is checked against the `winningLines` to determine if there is a winner: 

```javascript

    function checkWinner() {
        const player = getCurrentPlayer().getPlayerPositions();
        for (let lines of board.winningLines) {
            if (lines.every(pos => player.includes(pos))) {
                return true;
            }
        }
        return false;
    }

```

When a player places marker on the screen. Thee `position(1-9)` is passed in as an argument and is used to deduce its row and column in a 2D array which is then stores the marker in 2D grid: 

```javascript

    const row = Math.floor((position - 1) / 3); // Converts current positions row
    const col = (position - 1) % 3; // Converts current positions col

```

## Final Thoughts
Didn't put much effort in css, but I did play around with tailwinds css, as I felt main goal of this project was to create a javascript game with inside out approach and get familiar with encapsulation and module. When I can I would like to implement pubsub in the future. 


