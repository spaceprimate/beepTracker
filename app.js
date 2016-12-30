(function(){

var app = angular.module('estevezisms', [ ]);

//funky DEPENDENCY INJECTION service syntax wth angular?
app.controller('estevezController', ['$http', function($http){
	var jokes = this;
	//initialize to an empty array
	jokes.jokes = [];
	this.showPunchline = false;
	this.bgClass = "tile0";

	this.updateBg = function (){
		$('body').removeClass(this.bgClass);
		this.bgClass = "tile" + getRandomInt(0, 6);
		$('body').addClass(this.bgClass);
	};

	$http.get('jokes.json').success(function(data){
		jokes.jokes = data;
		jokes.getJoke();
	});

	this.reloadButton;

	this.reload = () => {
		window.location.reload(true);
	};

	this.currentJoke = {};
	this.jokeNum = 0;

	this.getJoke = function(){
		if (jokes.jokes.length == 0){
			this.showPunchline = false;
			this.currentJoke = {"setup": "Congratulations, you just read 100+ true facts about Emilio Estevez. What now?", "punchline": "Go to bed? Or reload the page and start over!"};
			this.updateBg();
			this.reloadButton = true;
		}
		else{
			this.showPunchline = false;
			var numJokes = jokes.jokes.length;
			var randJoke = getRandomInt(0, numJokes);
			this.currentJoke = jokes.jokes[randJoke];
			this.jokeNum = randJoke + 1;
			jokes.jokes.splice(randJoke, 1);
			this.updateBg();
			this.reloadButton = undefined;
		}
		
	};

	//init
	this.getJoke();
} ]);

	/* this is getting excessive, don't do this to end users please */
	/*
	document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;
        $('body').css("background-position", (event.screenX / 10) + "px " + (event.screenY / 10 ) + "px"  );
    }
    */
})();


// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}