var isPlaying=false;
var score =0;
var lives;
var dropSpeed=1;
var action;
var highScore=0;

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
            GameManager.createFruit();
        }
    });
    
    $("#restart").click(function(){
        location.reload();
    });
});

$("#fruit").mouseover(GameManager.sliceFruit);

function addHeart(){
    $("#life").empty();
    for (var i = 0; i < lives; i++) {
        $("#life").append(`<img src="images/heart.png" class="heart">`);
    }
}



function stopAction(){
    if(score>highScore){
        highScore=score;
        db.ref().child("scores").set(highScore);
    }
    clearInterval(action);
    $("#fruit").hide();
}


