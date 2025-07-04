var isPlaying = false;
var score = 0;
var lives;
var dropSpeed = 1;
var action;
var highScore = 0;
var hits = 0;
var totalSlices = 0;
var difficulty = 1;
var baseSpeed = 1;
var baseDelay = 800;

function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

// capture slice vectors for replay analytics
var replayData = [];
var lastPos = null;
var currentVector = null;

var fruits = ['apple', 'banana', 'grapes', 'mango', 'orange', 'peach', 'pear', 'pineapple','tomato','watermelon'];

function getHighScore() {
    var dbRef = db.ref().child("scores");
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if(data!=null){
            highScore=data;
        }
    });
}

function showHighScore(){
    window.alert("High Score: "+highScore);
}

function startGame(){
    isPlaying = true;
    score = 0;
    dropSpeed = 1;
    replayData = [];
    lastPos = null;
    currentVector = null;
    document.getElementById("value").innerHTML = score;
    document.getElementById("menubar").style.display = "none";
    document.getElementById("endgame").style.display = "none";
    document.getElementById("liferem").style.display = "flex";
    document.getElementById("container").style.display = "flex";
    lives = 3;
    addHeart();
    startFruits();
}

document.addEventListener("DOMContentLoaded", function(){
    getHighScore();

    document.getElementById("highScore").addEventListener("click", showHighScore);
    document.getElementById("highScore1").addEventListener("click", showHighScore);

    document.getElementById("start").addEventListener("click", function(){
        if(isPlaying === true){
            location.reload();
        } else {
            startGame();
        }
    });

    document.getElementById("restartGame").addEventListener("click", startGame);

    document.getElementById("restart").addEventListener("click", function(){
        location.reload();
    });

    document.getElementById("toggleDark").addEventListener("click", function(){
        document.body.classList.toggle("dark");
    });
});

// support both mouse and touch interactions for slicing the fruit
var fruitEl = document.getElementById("fruit");
fruitEl.addEventListener("mouseover", cut);
fruitEl.addEventListener("touchstart", cut);

// Detect pointer or touch movement across the container and slice the fruit
var containerEl = document.getElementById("container");
containerEl.addEventListener("mousemove", handleMove);
containerEl.addEventListener("touchmove", handleMove);

function handleMove(event){
    const x = event.pageX || event.touches?.[0]?.pageX;
    const y = event.pageY || event.touches?.[0]?.pageY;
    const now = Date.now();
    if(lastPos){
        const dt = now - lastPos.time;
        const dx = x - lastPos.x;
        const dy = y - lastPos.y;
        const velocity = Math.sqrt(dx*dx + dy*dy) / Math.max(dt,1);
        const direction = Math.atan2(dy, dx);
        currentVector = [velocity, direction];
    }
    lastPos = {x, y, time: now};
    if (isVisible(fruitEl)) {
        const rect = fruitEl.getBoundingClientRect();
        const offsetX = rect.left + window.pageXOffset;
        const offsetY = rect.top + window.pageYOffset;
        const w = rect.width;
        const h = rect.height;

        if (x >= offsetX && x <= offsetX + w &&
            y >= offsetY && y <= offsetY + h) {
            cut();
        }
    }
}

function addHeart(){
    var lifeEl = document.getElementById("life");
    lifeEl.innerHTML = "";
    for (var i = 0; i < lives; i++) {
        var img = document.createElement("img");
        img.src = "images/heart.png";
        img.className = "heart";
        lifeEl.appendChild(img);
    }
}

function spawnNextFruit(){
    totalSlices++;
    if(totalSlices > 0 && hits / totalSlices > 0.9){
        difficulty += 0.1;
    }
    dropSpeed = baseSpeed * difficulty;
    chooseFruit();
    var containerWidth = containerEl.clientWidth;
    fruitEl.style.left = Math.round((containerWidth - 350) * Math.random()) + 200 + "px";
    fruitEl.style.top = "-50px";
    fruitEl.style.display = "flex";
}
function startFruits(){
    spawnNextFruit();
    action = setInterval(function(){
        fruitEl.style.top = (fruitEl.offsetTop + dropSpeed) + "px";
        if(fruitEl.offsetTop > containerEl.offsetHeight){
            if(lives > 1 ){
                spawnNextFruit();
                lives-=1;
                addHeart();
            }else{
                isPlaying = false;
                document.getElementById("liferem").style.display = "none";
                document.getElementById("fsc").textContent = score;
                lives-=1;
                addHeart();
                document.getElementById("endgame").style.display = "block";
                stopAction();
            }
        }
    },10)
}


function chooseFruit(){
    fruitEl.src = 'images/' + fruits[Math.floor(fruits.length * Math.random())] + '.png';
}

function stopAction(){
    if(score>highScore){
        highScore=score;
        db.ref().child("scores").set(highScore);
    }
    clearInterval(action);
    fruitEl.style.display = "none";
    runAnalytics();
}

function cut(){
    if(currentVector){
        replayData.push(currentVector);
    }
    score++;
    hits++;
    document.getElementById("value").innerHTML = score;
    document.getElementById("slicesound").play();
    fruitEl.style.display = "none";
    clearInterval(action);

    setTimeout(startFruits, baseDelay / difficulty);
}

function runAnalytics(){
    if(typeof tf === 'undefined' || replayData.length === 0){
        return;
    }
    const xs = tf.tensor2d(replayData);
    const ys = tf.ones([replayData.length, 1]);
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 8, activation: 'relu', inputShape: [2]}));
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
    model.compile({optimizer: 'adam', loss: 'binaryCrossentropy'});
    model.fit(xs, ys, {epochs: 5}).then(() => {
        model.predict(xs).data().then(p => {
            console.log('Replay analytics:', Array.from(p));
        });
    });
}
