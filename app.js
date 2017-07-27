

var app = angular.module('beeps', ['rzModule']);

//funky DEPENDENCY INJECTION service syntax wth angular?
app.controller('beepController',  function($scope, $interval, $timeout){


	//var mySlider = $("input.slider").slider();
	





/* ------------------------------------------------------------------------------------------------------------------------------------ */




var audio = new window.AudioContext();

/*
 * config object has the following: 
 * attack, decay, frequency, type
*/


/**
 * 
 * @param {*} config - settings for this track
 * @param {*} freq - frequency adjustment for this beat
 */
function beep(config, freq) {
    var attack = config.attack,
        decay = config.decay,
        gain = audio.createGain(),
        osc = audio.createOscillator(),
        maxGain = config.amplitude;

    gain.connect(audio.destination);
    gain.gain.setValueAtTime(0, audio.currentTime);
    gain.gain.linearRampToValueAtTime(maxGain, audio.currentTime + attack / 1000);
    gain.gain.linearRampToValueAtTime(0, audio.currentTime + decay / 1000);


    console.log("config: " + config.frequency + ", freq: " + freq);
    osc.frequency.value = config.frequency + freq;
    osc.type = config.type;
    osc.connect(gain);
    osc.start(0);

    if (config.modType != 'none'){
        var gain2 = audio.createGain();
        gain2.gain.value = 100;
        gain2.connect(osc.frequency);
        var osc2 = audio.createOscillator();
        osc2.type = config.modType;
        osc2.frequency.value = config.modFrequency;
        osc2.connect(gain2);
        osc2.start(0);

    }

    
    


    setTimeout(function() {
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(audio.destination);
        if (config.modType != 'none'){
            osc2.stop(0);
            gain2.disconnect(osc.frequency);
        }
    }, decay);
}





function tracker (){
    this.tracks = [];
    this.beats = 15;
    this.curBeat = 0;
    this.bpm = 110;
    this.isPlaying = false;
    //this.self = this;
    this.play = () => {
    	this.isPlaying = true;
        //var self = this;
        this.timer = $interval( () => {this.playBeat();}, (60 / this.bpm * 250) );
        //console.log("called: " + (tracker.bpm / 60 * 1000));
    },
    //this.stop = () => {clearInterval(this.timer)};
    this.stop = () => {$interval.cancel(this.timer); this.isPlaying = false;};

    this.playBeat = function() {
       // console.log("playbeat: ");
       console.log(this.curBeat);
        
        this.tracks.forEach((t) => {
            if (t.beats[this.curBeat].active == true){
                //console.log("config is: ");
                //console.log(t.config);
                console.log("true");
                beep(t.config, t.beats[this.curBeat].frequency);
            }
            else {
                console.log("false");
            }
        });
        if (this.curBeat >= this.beats){
            this.curBeat = 0;
        }
        else { this.curBeat++;}
    };
    this.addTrack = (track) => {this.tracks.push(track); $timeout( () =>{updateBeatWidth()}, 20);};
}

tracker.prototype.getBlankTrack = () => {
    var blankTrack = {
        beats: tracker.prototype.getBlankBeats(16),
        config: {
            attack: 10,
            decay: 500,
            frequency: 440,
            type: "sine",
            amplitude: .75,
            modType: "none",
            modFrequency: 1
        }
    };
    return blankTrack;
};

//define beats here I guess?
tracker.prototype.getBlankBeats = (numBeats) => {
    var beats = [];
    for (var i = 0; i < numBeats; i++) {
        // beats.push({
        //     active: false,
        //     frequency: 0
        // });

        beats.push( new beat() );
    };
    return beats;
};

tracker.prototype.importSong = () => {
    //this should be implemented
    //import a preformatted this.tracks
};


function beat(){
    this.active = false;
    this.frequency = 0;
}
beat.prototype.updateFreq = function(f) {
    console.log("frequency before: " + this.frequency);
    console.log("this is: ");
    console.log(this);
    this.frequency = f;
    console.log("mullato butts? f is: " + f);
    console.log("did freq update? is: " + this.frequency);
};

console.log("reassure me again!");








/* ------------------------------------------------------------------------------------------------------------------------------------ */










	
	//this.curBeat = this.tracker.curBeat;
	//this.tracker.play();

	//var scope = this;
	this.curBeat = 0;


	//$interval(() => {console.log("test panges");}, 500);
	//scope.counter = 0;

	this.tracker = new tracker();
	this.tracker.addTrack(this.tracker.getBlankTrack());
	this.tracker.addTrack(this.tracker.getBlankTrack());
	this.tracker.addTrack(this.tracker.getBlankTrack());

	/*
	$scope.$watch('this.tracker.tracks', function(newValue, oldValue) {
	  this.curBeat = this.curBeat + 1;
	  console.log("blarlksjdf");
	});
	*/

	//expect(scope.counter).toEqual(0);
	//this.$watch('tracker', function(newValue, oldValue) {
	  //scope.curBeat = scope.curBeat + 1;
	//});





	this.test = () => {console.log(this.tracker.tracks);};

	this.freqOptions = {
		minLimit: 0,
		maxLimit: 1000,
		step: 1,
		floor: 0,
		ceil: 1000
	};
	this.gainOptions =  {
	    floor: 0,
	    ceil: 1,
	    step: 0.01,
	    precision: 10
	  };

	this.attackOptions = {
		minLimit: 0,
		maxLimit: 2000,
		step: 10,
		floor: 0
	,	ceil: 2000
	};

	this.decayOptions = {
		minLimit: 0,
		maxLimit: 3000,
		step: 10,
		floor: 0,
		ceil: 3000
	};

    this.modFreqOptions = {
        step: 0.1,
        floor: 0,
        ceil: 200,
        precision: 1
    };

	this.bpmOptions = {
		minLimit: 0,
		maxLimit: 300,
		step: 1,
		floor: 0,
		ceil: 300
	};

	$scope.minSlider = {
	    value: 10
	  };








//end beepController
} );





function updateBeatWidth(){
	var beatWidth = $('.beat').width();
	$( "body .beat" ).css('height', beatWidth);
	console.log("called update beat");
}




$( document ).ready(function() {
	//make beat's height the same as width: 
	updateBeatWidth();

	//and on resize
	$( window ).resize(function() {
		updateBeatWidth();
	});
});




