var app = angular.module('beeps', ['rzModule']);

//funky DEPENDENCY INJECTION service syntax wth angular?
app.controller('beepController',  function($scope, $interval, $timeout){



var audio = new window.AudioContext();

/** 
 * makes a beep sound
 * 
 * config object has the following: 
 * attack, decay, frequency, type
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
    //this.beats = 15; // move to track
    //this.curBeat = 0; // move to track
    this.bpm = 110;
    this.isPlaying = false;
    //this.self = this;
    this.play = () => {
    	this.isPlaying = true;
        //var self = this;
        this.playBeat();
        // this.timer = $interval( () => {this.playBeat();}, (60 / this.bpm * 250) );
        //console.log("called: " + (tracker.bpm / 60 * 1000));
    },
    //this.stop = () => {clearInterval(this.timer)};
    this.stop = () => {
        $interval.cancel(this.timer);
        this.isPlaying = false;
        this.tracks.forEach( (t) => {
            t.curBeat = 0;
        });
    };

    this.tempTracks;

    this.saveTracks = () => {
        // this.tempTracker = Object.assign({}, this.tracker);
        // let newObj = JSON.parse(JSON.stringify(obj));
        this.tempTracks = JSON.parse(JSON.stringify(this.tracks));
        
    };

    this.loadTracks = () => {
        this.tracks = [];
        //this.tracks = JSON.parse(JSON.stringify(this.tempTracks));
        console.log(this.tempTracks);
    };

    this.clearTracks = () => {
        this.tracks = [];
    }

    


    //loops through tracks to play, then increment, each track's current beat
    this.playBeat = function() {
        if (this.isPlaying){
            this.tracks.forEach((t) => {
                console.log("beat");
                console.log(t);
                if (t.curBeat == t.beats.length){
                    t.curBeat = 1;
                }
                else {
                    t.curBeat++;
                }
                var i = t.curBeat - 1;
                if (t.beats[i].active == true){

                    beep(t.config, t.beats[i].frequency);
                }

                
            });

        
            this.timer = $timeout( () => {this.playBeat();}, (60 / this.bpm * 250) );
        }
        
        
    };

    //add a new track to tracks array
    this.addTrack = (track) => {
        this.tracks.push(track); 
        $timeout( () =>{updateBeatWidth()}, 20);
    };

    // this.getBlankTrack = () => {
        
    // }

    

    this.removeTrack = (index) => {
        this.tracks.splice(index, 1);
    };


}

/*  ============================================================================================================================================
    ============================================================================================================================================
    TRACK CONSTRUCTOR
    ============================================================================================================================================
    ============================================================================================================================================
*/
function track(numBeats){
    this.config = {
        attack: 10,
        decay: 500,
        frequency: 440,
        type: "sine",
        amplitude: .75,
        modType: "none",
        modFrequency: 1
    };
    this.beats = [];
    for (var i = 0; i < numBeats; i++) {
        this.beats.push( new beat() );
    };
    this.curBeat = 0;
    this.numBeats = numBeats;
}
track.prototype.updateNumBeats = function(){
    if(this.numBeats >= this.beats.length + 1){
        for (i = this.beats.length+1; i <= this.numBeats; i++){
            this.beats.push( new beat() );
        }
    }
    else{
        this.beats = this.beats.slice(0, this.numBeats);
    }
};

/*  ============================================================================================================================================
    ============================================================================================================================================
    BEAT CONSTRUCTOR
    ============================================================================================================================================
    ============================================================================================================================================
*/
function beat(){
    this.active = false;
    this.frequency = 0;
}
beat.prototype.updateFreq = function(f) {
    if (this.frequency == f){
        this.active = !this.active;
    }
    else{
        this.frequency = f;
        this.active = true;
    }
    
};

var mouseDown = false;
document.body.onmousedown = function() { 
  mouseDown = true;
}
document.body.onmouseup = function() {
  mouseDown = false;
}

beat.prototype.mouseOver = function(f) {
    if(mouseDown){
        this.frequency = f;
        this.active = true;
    }
    
};

this.numBeatArr = [];
for (var i = 1; i <= 64; i++){
    this.numBeatArr[i-1] = i;
}
console.log(this.numBeatArr);


/*  ============================================================================================================================================
    ============================================================================================================================================
    INIT
    ============================================================================================================================================
    ============================================================================================================================================
*/
	this.curBeat = 0;
	this.tracker = new tracker();

    this.tracker.addTrack( new track(4) );
    this.tracker.addTrack( new track(12) );
    this.tracker.addTrack( new track(17) );
    this.tracker.addTrack( new track(31) );
    this.tracker.addTrack( new track(22) );

    this.getBlankTrack = () => {
        return new track(16);
    };




    //set all the slider options
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

    this.tempTracker = {};



//end beepController
} );




// code to update beat's css width (required for mobile to have perfectly circular, css generated beats, which is apparently important)
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