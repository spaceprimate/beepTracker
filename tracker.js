var audio = new window.AudioContext();

/*
 * config object has the following: 
 * attack, decay, frequency, type
*/
function beep(config) {
    var attack = config.attack,
        decay = config.decay,
        gain = audio.createGain(),
        osc = audio.createOscillator();

    gain.connect(audio.destination);
    gain.gain.setValueAtTime(0, audio.currentTime);
    gain.gain.linearRampToValueAtTime(1, audio.currentTime + attack / 1000);
    gain.gain.linearRampToValueAtTime(0, audio.currentTime + decay / 1000);

    osc.frequency.value = config.frequency;
    osc.type = config.type;
    osc.connect(gain);
    osc.start(0);
    setTimeout(function() {
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(audio.destination);
    }, decay);
}



function tracker (){
    this.tracks = [];
    this.beats = 15;
    this.curBeat = 0;
    this.bpm = 200;
    //this.self = this;
    this.play = () => {
        //var self = this;
        this.timer = setInterval( () => {this.playBeat();}, (60 / this.bpm * 1000) );
        //console.log("called: " + (tracker.bpm / 60 * 1000));
    },
    this.stop = () => {clearInterval(this.timer)};
    this.playBeat = function() {
        console.log("playbeat: ");
        
        this.tracks.forEach((t) => {
            if (t.beats[this.curBeat] == true){
                console.log("config is: ");
                console.log(t.config);
                beep(t.config);
            }
        });
        if (this.curBeat >= this.beats){
            this.curBeat = 0;
        }
        else { this.curBeat++;}
    };
    this.addTrack = (track) => {this.tracks.push(track);};
}



var testTrack = {
    beats: [true, false, false, true, false, false, true, false, false, false, true, false, false, true, true, true],
    config: {
        attack: 10,
        decay: 500,
        frequency: 440,
        type: "sine"
    }
}
var testTrack2 = {
    beats: [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true,],
    config: {
        attack: 10,
        decay: 300,
        frequency: 200,
        type: "square"
    }
}

var testTrack3 = {
    beats: [true, false, true, false, true, true, false, true, false, true, false, true, true, false, true, false],
    config: {
        attack: 10,
        decay: 100,
        frequency: 1000,
        type: "square"
    }
}

var testTrack4 = {
    beats: [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, ],
    config: {
        attack: 30,
        decay: 1500,
        frequency: 700,
        type: "sine"
    }
}

var testTrack4 = {
    beats: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, ],
    config: {
        attack: 30,
        decay: 1500,
        frequency: 120,
        type: "sawtooth"
    }
}
var testTrack5 = {
    beats: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, ],
    config: {
        attack: 30,
        decay: 1500,
        frequency: 100,
        type: "sawtooth"
    }
}



//Example
var test = new tracker();
test.addTrack(testTrack);
test.addTrack(testTrack2);
test.addTrack(testTrack3);
test.addTrack(testTrack4);
test.addTrack(testTrack5);





