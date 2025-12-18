const grid = document.getElementById('sudoku-grid');
const newGameBtn = document.getElementById('new-game');
const checkBtn = document.getElementById('check-solution');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');


let board = [];
let solution = [];
let timer;
let seconds =0;
let score = 0;

//genarate a 9x9 board
function emptyBoard() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
}

//check if placing number is valid
function isValid(board, row, col, num) {
    for(let i=0;i<9;i++){
        if(board[row][i]===num || board[i][col]===num) return false;
    }
    const startRow = Math.floor(row/3)*3;
    const startCol = Math.floor(col/3)*3;
    for(let i = startRow; i< startRow+3;i++){
        for(let j = startCol; j< startCol+3;j++){
            if(board[i][j]===num) return false;
    }
    }
    return true;
}

//solve the board using backtracking
function solve(board) {
    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
            if(board[row][col] === 0){
                const nums = shuffle([...Array(9).keys()].map(n=>n+1));
                for(let num of nums){
                    if(isValid(board, row, col, num)){
                        board[row][col] = num;
                        if(solve(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

//shuffle array
function shuffle(arr) {
    for(let i = arr.length -1; i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

//remove numbers to create puzzle
function removeNumbers(board, difficulty= 40){
    let removed = 0;
    while(removed < difficulty){
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if(board[row][col] !== 0){
            board[row][col] = 0;
            removed++;
        }
    }
    return board;
}


//generate new puzzle
function generatePuzzle(){
    board = emptyBoard();
    solve(board);
    solution = board.map(row => row.slice());
    removeNumbers(board);

}

//render grid
function renderGrid(){
    grid.innerHTML = '';
    for(let row =0; row <9; row++){
        for(let col =0; col <9; col++){
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.dataset.row = row;
            input.dataset.col = col;

            if(board[row][col] !==0){
                input.value = board[row][col];
                input.disabled = true;
            }

            input.addEventListener('input', handleInput);
            grid.appendChild(input);
        }
    }
}

//handle user input
function handleInput(e){
    const input = e.target;
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    const value = parseInt(input.value);

    if(!value || value <1 || value >9){
        input.value = '';
        return;

    }

    if(value === solution[row][col]){
        input.classList.remove('invalid');
        board[row][col] = value;
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
    }
    else{
        input.classList.add('invalid');
        score -= 5;
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

//check solution
function checkSolution(){
    for(let row =0; row <9; row++){
        for(let col =0; col <9; col++){
            if(board[row][col] !== solution[row][col]){
                alert('Incorrect Solution! Keep Trying.');
                return;
            }
        }
    }
    clearInterval(timer);

  // Show congratulations card
  const card = document.getElementById("congrats-card");
  const msg = document.getElementById("congrats-time-score");
  msg.textContent = `Time: ${formatTime(seconds)} | Score: ${score}`;
  showCongrats();
}
//timer
function startTimer(){
    clearInterval(timer);
    seconds =0;
    timer = setInterval(()=>{
        seconds++;
        timerDisplay.textContent = `Timer: ${formatTime(seconds)}`;
    },1000);
}

//format time
function formatTime(sec){
    const mins = Math.floor(sec /60).toString().padStart(2,'0');
    const seconds = (sec %60).toString().padStart(2,'0');
    return `${mins}:${seconds}`;
}
//new game
function newGame(){
    score =0;
    scoreDisplay.textContent = `Score: ${score}`;
    generatePuzzle();
    renderGrid();
    startTimer();
}

//event listeners
newGameBtn.addEventListener('click', newGame);
checkBtn.addEventListener('click', checkSolution);

//start first game
newGame();

function showCongrats() {
  const card = document.getElementById("congrats-card");
  card.classList.add("show");
}

function closeCongrats() {
  const card = document.getElementById("congrats-card");
  card.classList.remove("show");
}




function generateConfetti() {
  const container = document.querySelector(".confetti-container");
  container.innerHTML = ''; // clear previous confetti

  const colors = ["#ff6fd8", "#7a7cff", "#23d5ab", "#ffe066", "#ff5e57"];

  for(let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * container.offsetWidth + "px";
    confetti.style.animationDuration = (Math.random() * 2 + 3) + "s";
    confetti.style.width = confetti.style.height = (Math.random() * 8 + 6) + "px";
    container.appendChild(confetti);

    // remove after animation
    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }
}

// Update showCongrats to include confetti
function showCongrats() {
  const card = document.getElementById("congrats-card");
  card.classList.add("show");
  generateConfetti();
}
