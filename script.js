const init = document.querySelector(".initial-box"),
xBtn = init.querySelector(".selection .X-sym"),
oBtn = init.querySelector(".selection .O-sym"),
game = document.querySelector(".game"),
boxes = document.querySelectorAll("section span"),
board = game.querySelector(".board"),
message = game.querySelector(".result"),
replay = game.querySelector("button");

let xIcon = "fas fa-times"; // cross icon
let oIcon = "far fa-circle"; // circle icon
let player = "X";
let runBot = true;

window.onload = ()=> {
    for (let i = 0; i < boxes.length; i++) {
       boxes[i].setAttribute("onclick", "clickedBox(this)"); // clickable for each box
    }
    xBtn.onclick = ()=>   {
        init.classList.add("hide");
        game.classList.add("show");
    }

    oBtn.onclick = ()=> { 
        init.classList.add("hide");
        game.classList.add("show");
        board.setAttribute("class", "board active player");
    }
}

function getSym(classname){
    return document.querySelector(".box" + classname).id; 
}

// stops one side from wining when there are two symbols of the same on the same row
function gamePoint(val1, val2, val3) {
    if(getSym(val1) == getSym(val2) && getSym(val2) == "X" && !getSym(val3) ||
        getSym(val1) == getSym(val2) && getSym(val2) == "O" && !getSym(val3)) {
        return val3;
    } else if (getSym(val2) == getSym(val3) && getSym(val2) == "X" && !getSym(val1) || 
        getSym(val2) == getSym(val3) && getSym(val2) == "O" && !getSym(val1)) {
        return val1;
    } else if (getSym(val1) == getSym(val3) && getSym(val1) == "X" && !getSym(val2) || 
        getSym(val1) == getSym(val3) && getSym(val1) == "O" && !getSym(val2)) {
        return val2;
    } else {
        return false;
    }
}

// fills clicked boxes with the respective icon
function clickedBox(element){
    if (board.classList.contains("player")) {
        player = "O";
        element.innerHTML = `<i class="${oIcon}"></i>`;
    } else {
        element.innerHTML = `<i class="${xIcon}"></i>`;
    }
    board.classList.add("active");
    element.setAttribute("id", player);
    if (!selectWinner()) {
        game.style.pointerEvents = "none"; // deactivate the game until the bot has made its move
        element.style.pointerEvents = "none"; // deactivate the selected box
    } 
    setTimeout(()=> {bot(runBot);}, 500);
}

// auto bot player
function bot(){
    let array = [];
    let wincondition = [1,2,3,4,5,6,7,8,9,1,4,7,2,5,8,3,6,9,1,5,9,3,5,7]; // winning conditions of the game
    if (runBot) {
        let newId = false;
        player = "O";
        for (let i = 0; i < boxes.length; i++) { // put the index of the empty boxes inside the array
            if (boxes[i].childElementCount == 0) {
                array.push(i);
            }
        }
        for (let j = 0; j < wincondition.length; j+=3) { // algorithm to prevent the player from winning
            newId = gamePoint(wincondition[j], wincondition[j+1], wincondition[j+2]);
            if (newId != false) {
                newId -= 1;
                break;
            }
        }
        if (newId == false) {
            newId = array[Math.floor(Math.random() * array.length)];
        }
        if (array.length > 0){
            if (board.classList.contains("player")) { 
                player = "X";
                boxes[newId].innerHTML = `<i class="${xIcon}"></i>`;
            } else {
                boxes[newId].innerHTML = `<i class="${oIcon}"></i>`;
            }
            board.classList.remove("active");
            boxes[newId].setAttribute("id", player);
            selectWinner();
        }
        boxes[newId].style.pointerEvents = "none";
        game.style.pointerEvents = "auto";
        player = "X";
    }
}

// determines if the signs are the same
function signCheck(val1, val2, val3, sign) {
    if (getSym(val1) == sign && getSym(val2) == sign && getSym(val3) == sign) {
        return true;
    }
}

// determines if any side won
function selectWinner() {
    if (signCheck(1,2,3,player) || signCheck(4,5,6, player) || signCheck(7,8,9, player) || 
        signCheck(1,4,7, player) || signCheck(2,5,8, player) || signCheck(3,6,9, player) || 
        signCheck(1,5,9, player) || signCheck(3,5,7, player)) {
        runBot = false;
        bot(runBot);
        message.innerHTML = `Player ${player} won the game!`;
        board.style.pointerEvents = "none"; //deactivate the board
        return true;
    } else { 
        if (getSym(1) != "" && getSym(2) != "" && getSym(3) != "" && 
            getSym(4) != "" && getSym(5) != "" && getSym(6) != "" && 
            getSym(7) != "" && getSym(8) != "" && getSym(9) != "") {
            runBot = false;
            bot(runBot);
            message.textContent = "Match has been drawn!";
            board.style.pointerEvents = "none"; //deactivate the board
            return true;
        }
    }
}

// replay the game
replay.onclick = ()=>{
    window.location.reload();
}