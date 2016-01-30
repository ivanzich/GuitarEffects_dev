(function () {
    'use strict';

    angular
        .module('app')
        .controller('MusicPlayerController', Controller);


    function Controller() {

        var context,
            soundSource,
            soundBuffer,
            url = 'app-content/music/music.mp3';

        var vm = this;

        vm.priceSlider = 10;

        vm.startSound = startSound;
        vm.stopSound = stopSound;
        vm.startMicro = startMicro;

        initController();

        // Step 1 - Initialise the Audio Context
        // There can be only one!
        function initController() {
            if (typeof AudioContext !== "undefined") {
                context = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
                context = new webkitAudioContext();
            } else {
                throw new Error('AudioContext not supported. :(');
            }
        }

        // Step 2: Load our Sound using XHR
        function startSound() {
            // Note: this loads asynchronously
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";

            // Our asynchronous callback
            request.onload = function () {
                var audioData = request.response;
                audioGraph(audioData);
            };

            request.send();
        }

        // Finally: tell the source when to start
        function playSound() {
            // play the source now
            soundSource.start(context.currentTime);
        }

        function stopSound() {
            // stop the source now
            soundSource.stop(context.currentTime);
        }

        // This is the code we are interested in
        function audioGraph(audioData) {
            // create a sound source
            soundSource = context.createBufferSource();

            // The Audio Context handles creating source buffers from raw binary
            context.decodeAudioData(audioData, function (soundBuffer) {
                // Add the buffered data to our object
                soundSource.buffer = soundBuffer;

                var volumeNode = context.createGain();
                var distortion = context.createWaveShaper();
                distortion.curve = makeDistortionCurve(400);
                distortion.oversample = '4x';

                //Set the volume
                volumeNode.gain.value = 0.1;

                // Wiring
                soundSource.connect(volumeNode);
                volumeNode.connect(context.destination);

                var filterNode = context.createBiquadFilter();

                // Specify this is a lowpass filter
                filterNode.type = 'lowpass';

                // Quieten sounds over 220Hz
                filterNode.frequency.value = 220;

                soundSource.connect(volumeNode);
                volumeNode.connect(filterNode);
                filterNode.connect(distortion);
                distortion.connect(context.destination);

                // Finally
                playSound(soundSource);
            });

        }

        function applyEffect(soundSource,effetArray,destination){
            soundSource.connect(effetArray[0]);
            var i;
            for(i=0;  i+1< effetArray.length;i++){
                effetArray[i].connect(effetArray[i+1]);
            }
            effetArray[i+1].connect(destination);
        }
        

        function makeDistortionCurve(amount) {
            var k = typeof amount === 'number' ? amount : 50,
                n_samples = 44100,
                curve = new Float32Array(n_samples),
                deg = Math.PI / 180,
                i = 0,
                x;
            for (; i < n_samples; ++i) {
                x = i * 2 / n_samples - 1;
                curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
            }
            return curve;
        }

        function startMicro()
        {

            navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
            navigator.getUserMedia(
              {
                  audio: true
              },
              function (e) {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                context = new AudioContext();

                // creates an audio node from the microphone incoming stream
                var mediaStream = context.createMediaStreamSource(e);

                mediaStream.connect(context.destination);
                mediaStream.start();

                // success
              },
              function (e) {
                // error
                console.error(e);
              });
        }
    }


})();
