var isPlaying=false;
var score =0;
var lives;
var dropSpeed=1;
var action;
var highScore=0;
var hits = 0;
var totalSlices = 0;
var difficulty = 1;
var baseSpeed = 1;
var baseDelay = 800;

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
    isPlaying=true;
    score=0;
    dropSpeed=1;
    replayData = [];
    lastPos = null;
    currentVector = null;
    $("#value").html(score);
    $("#menubar").hide();
    $("#endgame").hide();
    $("#liferem").css("display","flex");
    $("#container").css({"display":"flex"});
    lives=3;
    addHeart();
    startFruits();
}

$(function(){    
    getHighScore();

    $("#highScore").click(function(){
        showHighScore();
    });
    $("#highScore1").click(function(){
        showHighScore();
    });

    $("#start").click(function(){
        if(isPlaying==true){
            location.reload();
        } else {
            startGame();
        }
    });
    
    $("#restartGame").click(function(){
        startGame();
    });

    $("#restart").click(function(){
        location.reload();
    });

    $("#toggleDark").click(function(){
        $("body").toggleClass("dark");
    });
});

// support both mouse and touch interactions for slicing the fruit
$("#fruit").on("mouseover touchstart", cut);

// Detect pointer or touch movement across the container and slice the fruit
$("#container").on("mousemove touchmove", function(event) {
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
    const fruit = $("#fruit");

    if (fruit.is(":visible")) {
        const offset = fruit.offset();
        const w = fruit.width();
        const h = fruit.height();

        if (x >= offset.left && x <= offset.left + w &&
            y >= offset.top && y <= offset.top + h) {
            cut();
        }
    }
});

function addHeart(){
    $("#life").empty();
    for(i=0;i<lives;i++){
        $("#life").append(`<img src="images/heart.png" class="heart">`);
    }
}

function spawnNextFruit(){
    totalSlices++;
    if(totalSlices > 0 && hits / totalSlices > 0.9){
        difficulty += 0.1;
    }
    dropSpeed = baseSpeed * difficulty;
    chooseFruit();
    $("#fruit").css({"left" : Math.round(($("#container").width()-350)*Math.random())+200, "top" : -50});
    $("#fruit").css({"display":"flex"});
}
function startFruits(){
    spawnNextFruit();
    action = setInterval(function(){
        $("#fruit").css("top", $("#fruit").position().top + dropSpeed);
        if($("#fruit").position().top > $("#container").height()){
            if(lives > 1 ){
                spawnNextFruit();
                lives-=1;
                addHeart();
            }else{
                isPlaying = false;
                $("#liferem").css("display","none");
                $("#fsc").text(score);
                lives-=1;
                addHeart();
                $("#endgame").show();
                stopAction();
            }
        }
    },10)
}


function chooseFruit(){
    $("#fruit").attr('src' , 'images/' + fruits[Math.round(9*Math.random())] +'.png');
}

function stopAction(){
    if(score>highScore){
        highScore=score;
        db.ref().child("scores").set(highScore);
    }
    clearInterval(action);
    $("#fruit").hide();
    runAnalytics();
}

function cut(){
    if(currentVector){
        replayData.push(currentVector);
    }
    score++;
    hits++;
    $("#value").html(score);
    $("#slicesound")[0].play();
    $("#fruit").hide("explode", 500); 
    $("#fruit").css({'display':'flex'});
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
