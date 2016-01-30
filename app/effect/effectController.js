(function () {
    'use strict';

    angular
        .module('app')
        .controller('EffectController', Controller);

    function Controller() {
        var vm = this;

        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        var context = new AudioContext();
        var mic=null;
        var lowpassFilter = 0;
        var delay = 0;
        //Fonction pour activer le micro
        vm.activerMicro=function()
        {
            if(vm.micro)
            {
                navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;
                navigator.getUserMedia(
                    {
                        audio: true
                    },
                    function (stream) {
                        mic = context.createMediaStreamSource(stream);
                        lowpassFilter = context.createBiquadFilter();
                        delay = context.createDelay(5.0);
                        mic.connect(lowpassFilter);
                        delay.connect(mic);
                        delay.connect(lowpassFilter);

                        lowpassFilter.connect(context.destination);
                     },
                    function (e) {
                        // error
                        console.error(e);
                    });
            }else{
                mic.disconnect();
            }
        };
        function createTelephonizer() {
            // I double up the filters to get a 4th-order filter = faster fall-off
            var lpf1 = audioContext.createBiquadFilter();
            lpf1.type = "lowpass";
            lpf1.frequency.value = 2000.0;
            var lpf2 = audioContext.createBiquadFilter();
            lpf2.type = "lowpass";
            lpf2.frequency.value = 2000.0;
            var hpf1 = audioContext.createBiquadFilter();
            hpf1.type = "highpass";
            hpf1.frequency.value = 500.0;
            var hpf2 = audioContext.createBiquadFilter();
            hpf2.type = "highpass";
            hpf2.frequency.value = 500.0;
            lpf1.connect( lpf2 );
            lpf2.connect( hpf1 );
            hpf1.connect( hpf2 );
            hpf2.connect( wetGain );
            currentEffectNode = lpf1;
            return( lpf1 );
        }

        function createDelay() {
            var delayNode = null;
            if (window.location.search.substring(1) == "webkit")
                delayNode = audioContext.createDelay();
            else
                delayNode = audioContext.createDelay();
            delayNode.delayTime.value = parseFloat( document.getElementById("dtime").value );
            dtime = delayNode;

            var gainNode = audioContext.createGain();
            gainNode.gain.value = parseFloat( document.getElementById("dregen").value );
            dregen = gainNode;

            gainNode.connect( delayNode );
            delayNode.connect( gainNode );
            delayNode.connect( wetGain );

            return delayNode;
        }

        function createReverb() {
            var convolver = audioContext.createConvolver();
            convolver.buffer = reverbBuffer; // impulseResponse( 2.5, 2.0 );  // reverbBuffer;
            convolver.connect( wetGain );
            return convolver;
        }

        var waveshaper = null;

        function createDistortion() {
            if (!waveshaper)
                waveshaper = new WaveShaper( audioContext );

            waveshaper.output.connect( wetGain );
            waveshaper.setDrive(5.0);
            return waveshaper.input;
        }

        function createGainLFO() {
            var osc = audioContext.createOscillator();
            var gain = audioContext.createGain();
            var depth = audioContext.createGain();

            osc.type = parseInt(document.getElementById("lfotype").value);
            osc.frequency.value = parseFloat( document.getElementById("lfo").value );

            gain.gain.value = 1.0; // to offset
            depth.gain.value = 1.0;
            osc.connect(depth); // scales the range of the lfo


            depth.connect(gain.gain);
            gain.connect( wetGain );
            lfo = osc;
            lfotype = osc;
            lfodepth = depth;


            osc.start(0);
            return gain;
        }

        function createFilterLFO() {
            var osc = audioContext.createOscillator();
            var gainMult = audioContext.createGain();
            var gain = audioContext.createGain();
            var filter = audioContext.createBiquadFilter();

            filter.type = "lowpass";
            filter.Q.value = parseFloat( document.getElementById("lplfoq").value );
            lplfofilter = filter;

            osc.type = osc.SINE;
            osc.frequency.value = parseFloat( document.getElementById("lplfo").value );
            osc.connect( gain );

            filter.frequency.value = 2500;  // center frequency - this is kinda arbitrary.
            gain.gain.value = 2500 * parseFloat( document.getElementById("lplfodepth").value );
            // this should make the -1 - +1 range of the osc translate to 0 - 5000Hz, if
            // depth == 1.

            gain.connect( filter.frequency );
            filter.connect( wetGain );
            lplfo = osc;
            lplfodepth = gain;

            osc.start(0);
            return filter;
        }

        function createRingmod() {
            var gain = audioContext.createGain();
            var ring = audioContext.createGain();
            var osc = audioContext.createOscillator();

            osc.type = osc.SINE;
            rmod = osc;
            osc.frequency.value = Math.pow( 2, parseFloat( document.getElementById("rmfreq").value ) );
            osc.connect(ring.gain);

            ring.gain.value = 0.0;
            gain.connect(ring);
            ring.connect(wetGain);
            osc.start(0);
            return gain;
        }

        var awg = null;

        function createChorus() {
            var delayNode = audioContext.createDelay();
            delayNode.delayTime.value = parseFloat( document.getElementById("cdelay").value );
            cdelay = delayNode;

            var inputNode = audioContext.createGain();

            var osc = audioContext.createOscillator();
            var gain = audioContext.createGain();

            gain.gain.value = parseFloat( document.getElementById("cdepth").value ); // depth of change to the delay:
            cdepth = gain;

            osc.type = osc.SINE;
            osc.frequency.value = parseFloat( document.getElementById("cspeed").value );
            cspeed = osc;

            osc.connect(gain);
            gain.connect(delayNode.delayTime);

            inputNode.connect( wetGain );
            inputNode.connect( delayNode );
            delayNode.connect( wetGain );


            osc.start(0);

            return inputNode;
        }

        function createVibrato() {
            var delayNode = audioContext.createDelay();
            delayNode.delayTime.value = parseFloat( document.getElementById("vdelay").value );
            cdelay = delayNode;

            var inputNode = audioContext.createGain();

            var osc = audioContext.createOscillator();
            var gain = audioContext.createGain();

            gain.gain.value = parseFloat( document.getElementById("vdepth").value ); // depth of change to the delay:
            cdepth = gain;

            osc.type = osc.SINE;
            osc.frequency.value = parseFloat( document.getElementById("vspeed").value );
            cspeed = osc;

            osc.connect(gain);
            gain.connect(delayNode.delayTime);
            inputNode.connect( delayNode );
            delayNode.connect( wetGain );
            osc.start(0);

            return inputNode;
        }

        function createFlange() {
            var delayNode = audioContext.createDelay();
            delayNode.delayTime.value = parseFloat( document.getElementById("fldelay").value );
            fldelay = delayNode;

            var inputNode = audioContext.createGain();
            var feedback = audioContext.createGain();
            var osc = audioContext.createOscillator();
            var gain = audioContext.createGain();
            gain.gain.value = parseFloat( document.getElementById("fldepth").value );
            fldepth = gain;

            feedback.gain.value = parseFloat( document.getElementById("flfb").value );
            flfb = feedback;

            osc.type = osc.SINE;
            osc.frequency.value = parseFloat( document.getElementById("flspeed").value );
            flspeed = osc;

            osc.connect(gain);
            gain.connect(delayNode.delayTime);

            inputNode.connect( wetGain );
            inputNode.connect( delayNode );
            delayNode.connect( wetGain );
            delayNode.connect( feedback );
            feedback.connect( inputNode );

            osc.start(0);

            return inputNode;
        }

        function createStereoChorus() {
            var splitter = audioContext.createChannelSplitter(2);
            var merger = audioContext.createChannelMerger(2);
            var inputNode = audioContext.createGain();

            inputNode.connect( splitter );
            inputNode.connect( wetGain );

            var delayLNode = audioContext.createDelay();
            var delayRNode = audioContext.createDelay();
            delayLNode.delayTime.value = parseFloat( document.getElementById("scdelay").value );
            delayRNode.delayTime.value = parseFloat( document.getElementById("scdelay").value );
            scldelay = delayLNode;
            scrdelay = delayRNode;
            splitter.connect( delayLNode, 0 );
            splitter.connect( delayRNode, 1 );

            var osc = audioContext.createOscillator();
            scldepth = audioContext.createGain();
            scrdepth = audioContext.createGain();

            scldepth.gain.value = parseFloat( document.getElementById("scdepth").value ); // depth of change to the delay:
            scrdepth.gain.value = - parseFloat( document.getElementById("scdepth").value ); // depth of change to the delay:

            osc.type = osc.TRIANGLE;
            osc.frequency.value = parseFloat( document.getElementById("scspeed").value );
            scspeed = osc;

            osc.connect(scldepth);
            osc.connect(scrdepth);

            scldepth.connect(delayLNode.delayTime);
            scrdepth.connect(delayRNode.delayTime);

            delayLNode.connect( merger, 0, 0 );
            delayRNode.connect( merger, 0, 1 );
            merger.connect( wetGain );

            osc.start(0);

            return inputNode;
        }

        /*
         Add modulation to delayed signal akin to ElectroHarmonix MemoryMan Guitar Pedal.
         Simple combination of effects with great output hear on lots of records.

         FX Chain ASCII PIC:
         v- FEEDBACK -|
         INPUT -> DELAY -> CHORUS -> OUTPUT
         */
        function createModDelay() {
            // Create input node for incoming audio
            var inputNode = audioContext.createGain();

            // SET UP DELAY NODE
            var delayNode = audioContext.createDelay();
            delayNode.delayTime.value = parseFloat( document.getElementById("mdtime").value );
            mdtime = delayNode;

            var feedbackGainNode = audioContext.createGain();
            feedbackGainNode.gain.value = parseFloat( document.getElementById("mdfeedback").value );
            mdfeedback = feedbackGainNode;


            // SET UP CHORUS NODE
            var chorus = audioContext.createDelay();
            chorus.delayTime.value = parseFloat( document.getElementById("mddelay").value );
            mddelay = chorus;

            var osc  = audioContext.createOscillator();
            var chorusRateGainNode = audioContext.createGain();
            chorusRateGainNode.gain.value = parseFloat( document.getElementById("mddepth").value ); // depth of change to the delay:
            mddepth = chorusRateGainNode;

            osc.type = osc.SINE;
            osc.frequency.value = parseFloat( document.getElementById("mdspeed").value );
            mdspeed = osc;

            osc.connect(chorusRateGainNode);
            chorusRateGainNode.connect(chorus.delayTime);

            // Connect the FX chain together
            // create circular chain for delay to "feedback" to itself
            inputNode.connect( delayNode );
            delayNode.connect( chorus );
            delayNode.connect( feedbackGainNode );
            chorus.connect(feedbackGainNode);
            feedbackGainNode.connect( delayNode );
            feedbackGainNode.connect( wetGain );


            osc.start(0);

            return inputNode;
        }

        function createStereoFlange() {
            var splitter = audioContext.createChannelSplitter(2);
            var merger = audioContext.createChannelMerger(2);
            var inputNode = audioContext.createGain();
            sfllfb = audioContext.createGain();
            sflrfb = audioContext.createGain();
            sflspeed = audioContext.createOscillator();
            sflldepth = audioContext.createGain();
            sflrdepth = audioContext.createGain();
            sflldelay = audioContext.createDelay();
            sflrdelay = audioContext.createDelay();


            sfllfb.gain.value = sflrfb.gain.value = parseFloat( document.getElementById("sflfb").value );

            inputNode.connect( splitter );
            inputNode.connect( wetGain );

            sflldelay.delayTime.value = parseFloat( document.getElementById("sfldelay").value );
            sflrdelay.delayTime.value = parseFloat( document.getElementById("sfldelay").value );

            splitter.connect( sflldelay, 0 );
            splitter.connect( sflrdelay, 1 );
            sflldelay.connect( sfllfb );
            sflrdelay.connect( sflrfb );
            sfllfb.connect( sflrdelay );
            sflrfb.connect( sflldelay );

            sflldepth.gain.value = parseFloat( document.getElementById("sfldepth").value ); // depth of change to the delay:
            sflrdepth.gain.value = - parseFloat( document.getElementById("sfldepth").value ); // depth of change to the delay:

            sflspeed.type = sflspeed.TRIANGLE;
            sflspeed.frequency.value = parseFloat( document.getElementById("sflspeed").value );

            sflspeed.connect( sflldepth );
            sflspeed.connect( sflrdepth );

            sflldepth.connect( sflldelay.delayTime );
            sflrdepth.connect( sflrdelay.delayTime );

            sflldelay.connect( merger, 0, 0 );
            sflrdelay.connect( merger, 0, 1 );
            merger.connect( wetGain );

            sflspeed.start(0);

            return inputNode;
        }

        function createPitchShifter() {
            effect = new Jungle( audioContext );
            effect.output.connect( wetGain );
            return effect.input;
        }

        function createEnvelopeFollower() {
            var waveshaper = audioContext.createWaveShaper();
            var lpf1 = audioContext.createBiquadFilter();
            lpf1.type = "lowpass";
            lpf1.frequency.value = 10.0;

            var curve = new Float32Array(65536);
            for (var i=-32768; i<32768; i++)
                curve[i+32768] = ((i>0)?i:-i)/32768;
            waveshaper.curve = curve;
            waveshaper.connect(lpf1);
            lpf1.connect(wetGain);
            return waveshaper;
        }

        function createAutowah() {
            var inputNode = audioContext.createGain();
            var waveshaper = audioContext.createWaveShaper();
            awFollower = audioContext.createBiquadFilter();
            awFollower.type = "lowpass";
            awFollower.frequency.value = 10.0;

            var curve = new Float32Array(65536);
            for (var i=-32768; i<32768; i++)
                curve[i+32768] = ((i>0)?i:-i)/32768;
            waveshaper.curve = curve;
            waveshaper.connect(awFollower);

            awDepth = audioContext.createGain();
            awDepth.gain.value = 11585;
            awFollower.connect(awDepth);

            awFilter = audioContext.createBiquadFilter();
            awFilter.type = "lowpass";
            awFilter.Q.value = 15;
            awFilter.frequency.value = 50;
            awDepth.connect(awFilter.frequency);
            awFilter.connect(wetGain);

            inputNode.connect(waveshaper);
            inputNode.connect(awFilter);
            return inputNode;
        }

        function createNoiseGate() {
            var inputNode = audioContext.createGain();
            var rectifier = audioContext.createWaveShaper();
            ngFollower = audioContext.createBiquadFilter();
            ngFollower.type = "lowpass";
            ngFollower.frequency.value = 10.0;

            var curve = new Float32Array(65536);
            for (var i=-32768; i<32768; i++)
                curve[i+32768] = ((i>0)?i:-i)/32768;
            rectifier.curve = curve;
            rectifier.connect(ngFollower);

            ngGate = audioContext.createWaveShaper();
            ngGate.curve = generateNoiseFloorCurve(parseFloat(document.getElementById("ngFloor").value));

            ngFollower.connect(ngGate);

            var gateGain = audioContext.createGain();
            gateGain.gain.value = 0.0;
            ngGate.connect( gateGain.gain );

            gateGain.connect( wetGain);

            inputNode.connect(rectifier);
            inputNode.connect(gateGain);
            return inputNode;
        }

        function generateNoiseFloorCurve( floor ) {
            // "floor" is 0...1

            var curve = new Float32Array(65536);
            var mappedFloor = floor * 32768;

            for (var i=0; i<32768; i++) {
                var value = (i<mappedFloor) ? 0 : 1;

                curve[32768-i] = -value;
                curve[32768+i] = value;
            }
            curve[0] = curve[1]; // fixing up the end.

            return curve;
        }

        function setBitCrusherDepth( bits ) {
            var length = Math.pow(2, bits);
            console.log("setting bitcrusher depth to " + bits + " bits, length = " + length );
            var curve = new Float32Array( length );

            var lengthMinusOne = length - 1;

            for (var i=0; i<length; i++)
                curve[i] = (2 * i / lengthMinusOne) - 1;

            if (bitCrusher)
                bitCrusher.curve = curve;
        }

        var btcrBufferSize = 4096;

        function createBitCrusher() {
            var bitCrusher = audioContext.createScriptProcessor(btcrBufferSize, 1, 1);
            var phaser = 0;
            var last = 0;

            bitCrusher.onaudioprocess = function(e) {
                var step = Math.pow(1/2, btcrBits);
                for (var channel=0; channel<e.inputBuffer.numberOfChannels; channel++) {
                    var input = e.inputBuffer.getChannelData(channel);
                    var output = e.outputBuffer.getChannelData(channel);
                    for (var i = 0; i < btcrBufferSize; i++) {
                        phaser += btcrNormFreq;
                        if (phaser >= 1.0) {
                            phaser -= 1.0;
                            last = step * Math.floor(input[i] / step + 0.5);
                        }
                        output[i] = last;
                    }
                }
            };
            bitCrusher.connect( wetGain );
            return bitCrusher;
        }

        btcrBits = 16,
            btcrNormFreq

        function impulseResponse( duration, decay, reverse ) {
            var sampleRate = audioContext.sampleRate;
            var length = sampleRate * duration;
            var impulse = audioContext.createBuffer(2, length, sampleRate);
            var impulseL = impulse.getChannelData(0);
            var impulseR = impulse.getChannelData(1);

            if (!decay)
                decay = 2.0;
            for (var i = 0; i < length; i++){
                var n = reverse ? length - i : i;
                impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
                impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
            }
            return impulse;
        }
        //Fonction pour activer reverb
        vm.activerReverb= function(){
            if(vm.reverb){
             }
        }
        vm.slider = {
            value: 150,
            options: {
                floor: 0,
                ceil: 200
            }
        };


    }

})();
