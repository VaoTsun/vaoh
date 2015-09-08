var anim = (function() {
    var i = 0;
    var step = 3;
    var up = true;
    var timer = null;

    var next = function() {
        if (up) {
            i += step;
        }
        else {
            i -= step;
        }
        if (i < 200) {
            i = 200;
            up = true;
        }
        if (i > 255) {
            i = 255;
            up = false;
        }
        update(i);
    };

    var update = function(i) {
        $("body").css("background-color", 'rgb(' + i + ',' + 200+i + ',' + i + ')');
        $("circle").css("opacity", (i*4)/100);
    };

    var go = function() {
        next();
        timer = window.setTimeout(anim.go, 30);
    };

    var stop = function() {
        if (timer) {
            window.clearTimeout(timer);
            timer = null;
        }
    };

    var addClickHandler = function() {
        $("body").click(function() {
            console.log(timer);
            if (!timer){
                timer = window.setTimeout(anim.go, 30);
            }
            else {
                window.clearTimeout(timer);
                timer = false;
                update(0);
            }

        });
    };



    return {
        go: go,
        stop: stop,
        addClickHandler: addClickHandler
    };
}());

anim.addClickHandler();
//anim.go();