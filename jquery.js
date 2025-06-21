var isPlaying=false;
var score =0;
var lives;
var dropSpeed=1;
var action;
var highScore=0;

var fruits = ['apple', 'banana', 'grapes', 'mango', 'orange', 'peach', 'pear', 'pineapple','tomato','watermelon'];

function getHighScore(){
    const stored = localStorage.getItem('highScore');
    if(stored !== null && !isNaN(parseInt(stored))){
        highScore = parseInt(stored);
    } else {
        highScore = 0;
    }
}

function updateHighScoreDisplay(){
    $("#hsValueMenu").text(highScore);
    $("#hsValueGameOver").text(highScore);
}

function startGame(){
    isPlaying=true;
    score=0;
    dropSpeed=1;
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
    updateHighScoreDisplay();

    $("#start").click(function(){
        if(isPlaying){
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

$("#fruit").on("mouseover touchstart", cut);

$("#container").on("mousemove touchmove", function(event){
    const x = event.pageX || event.touches?.[0]?.pageX;
    const y = event.pageY || event.touches?.[0]?.pageY;
    const fruit = $("#fruit");

    if(fruit.is(":visible")){
        const offset = fruit.offset();
        const w = fruit.width();
        const h = fruit.height();
        if(x >= offset.left && x <= offset.left + w &&
           y >= offset.top && y <= offset.top + h){
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

function startFruits(){
    chooseFruit();
    $("#fruit").css({'left' : Math.round(($("#container").width()-350)*Math.random())+200, 'top' : -50});
    $("#fruit").css({'display':'flex'});
    if(dropSpeed<=13){
        dropSpeed+=1;
    }
    action = setInterval(function(){
        $("#fruit").css('top', $("#fruit").position().top + dropSpeed);
        if($("#fruit").position().top > $("#container").height()){
            if(lives > 1 ){
                $("#fruit").css({'display':'flex'});
                chooseFruit();
                $("#fruit").css({'left' : Math.round(($("#container").width()-350)*Math.random())+200, 'top' : -50});
                lives-=1;
                addHeart();
            }else{
                isPlaying = false;
                $("#liferem").css('display','none');
                $("#fsc").text(score);
                lives-=1;
                addHeart();
                $("#endgame").show();
                stopAction();
            }
        }
    },10);
}

function chooseFruit(){
    $("#fruit").attr('src' , 'images/' + fruits[Math.round(9*Math.random())] +'.png');
}

function stopAction(){
    if(score>highScore){
        highScore=score;
        localStorage.setItem('highScore', highScore);
    }
    updateHighScoreDisplay();
    clearInterval(action);
    $("#fruit").hide();
}

function cut(){
    score++;
    $("#value").html(score);
    $("#slicesound")[0].play();
    $("#fruit").hide("explode", 500);
    $("#fruit").css({'display':'flex'});
    clearInterval(action);

    setTimeout(startFruits, 800);
}

