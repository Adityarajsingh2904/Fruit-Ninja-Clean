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
        }
        else{
            isPlaying=true;
            score=0;
            $("#value").html(score);
            $("#menubar").hide();
            $("#liferem").css('display','flex');
            $("#container").css({'display':'flex'});
            lives=3;
            addHeart();
            startFruits();
        }
    });
    
    $("#restart").click(function(){
        location.reload();
    });
});

$("#fruit").mouseover(cut);

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
}

function cut(){
    score++;
    hits++;
    $("#value").html(score);
    $("#slicesound")[0].play();
    $("#fruit").hide("explode", 500); 
    $("#fruit").css({'display':'flex'});
    clearInterval(action);
    
    setTimeout(startFruits, baseDelay / difficulty);
}
