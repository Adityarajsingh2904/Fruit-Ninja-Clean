var GameManager = (function () {
    function chooseFruit() {
        $("#fruit").attr('src', 'images/' + fruits[Math.floor(Math.random() * fruits.length)] + '.png');
    }

    function createFruit() {
        chooseFruit();
        $("#fruit").css({
            'left': Math.round(($("#container").width() - 350) * Math.random()) + 200,
            'top': -50
        });
        $("#fruit").css({ 'display': 'flex' });
        if (dropSpeed <= 13) {
            dropSpeed += 1;
        }
        action = setInterval(function () {
            $("#fruit").css('top', $("#fruit").position().top + dropSpeed);
            if ($("#fruit").position().top > $("#container").height()) {
                if (lives > 1) {
                    $("#fruit").css({ 'display': 'flex' });
                    chooseFruit();
                    $("#fruit").css({
                        'left': Math.round(($("#container").width() - 350) * Math.random()) + 200,
                        'top': -50
                    });
                    lives -= 1;
                    addHeart();
                } else {
                    playing = false;
                    $("#liferem").css('display', 'none');
                    $("#fsc").text(score);
                    lives -= 1;
                    addHeart();
                    $("#endgame").show();
                    stopAction();
                }
            }
        }, 10);
    }

    function updateScore() {
        $("#value").html(score);
    }

    function sliceFruit() {
        score++;
        updateScore();
        $("#slicesound")[0].play();
        $("#fruit").hide("explode", 500);
        $("#fruit").css({ 'display': 'flex' });
        clearInterval(action);
        setTimeout(createFruit, 800);
    }

    return {
        createFruit: createFruit,
        sliceFruit: sliceFruit,
        updateScore: updateScore
    };
})();
