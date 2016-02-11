(function() {
    'use strict';
    angular.module('guitareffect.pedaleffect')
        .factory('PedalEffectService', service);

    function service() {
        var service = {
            addChorus: addChorus,
            addDelay: addDelay,
            addGainLFO:addGainLFO,
            addLowPassFilterNode: addLowPassFilterNode,
            addDistortion: addDistortion,
            getTheSourceNodes: getTheSourceNodes
        };

        return service;

        function addChorus(source,parameters,context){
            var timeNode, timeGain, frequence;

            timeNode = parameters[0].value; //Compris entre 0 et 1
            timeGain = parameters[1].value; //compris entre 0 et 1
            frequence = parameters[2].value; //compris entre 0 et 100

            var delayNodeChorus = context.createDelay();
            delayNodeChorus.delayTime.value = timeNode;

            var oscillatorChorus = context.createOscillator();
            var gainChorus = context.createGain();

            gainChorus.gain.value= timeGain;

            oscillatorChorus.type="sine";
            oscillatorChorus.frequency.value=frequence;

            oscillatorChorus.connect(gainChorus);
            gainChorus.connect(delayNodeChorus.delayTime);

            source.connect(gainChorus);
            source.connect(delayNodeChorus);

            oscillatorChorus.start(0);

            return delayNodeChorus;
        }

        //Function delay
        function addDelay(source,parameters,context){
            var  delay,feedback, time, frequence;

            time = parameters[0].value;
            frequence = parameters[1].value;

            delay = context.createDelay();
            delay.delayTime.value = time;

            feedback= context.createGain();
            feedback.gain.value = frequence;

            delay.connect(feedback);
            feedback.connect(delay);

            source.connect(delay);
            //delay.connect(context.destination);
            return delay;
        }
        //Function effect  GainLFO
        function addGainLFO(source, parameters,context){

            var frequence = parameters[0].value;
            var osc = context.createOscillator();
            var gain = context.createGain();
            var depth = context.createGain();

            osc.type = "sine";
            osc.frequency.value = frequence;

            gain.gain.value = 1.0; // valeur fixer à l'avance
            depth.gain.value = 1.0;// valeur fixer à l'avance

            osc.connect(depth);
            depth.connect(gain.gain);

            source.connect(gain);

            osc.start(0);
            return gain;

        }


        function addLowPassFilterNode(source, parameters,context) {
            var filterNode = context.createBiquadFilter();
            // Specify this is a lowpass filter
            filterNode.type = 'lowpass';
            // Quieten sounds over 220Hz
            filterNode.frequency.value = parameters[0].value;
            source.connect(filterNode);
            return filterNode;

        };
        function addHighPassFilterNode(source, parameters,context) {
            var filterNode = context.createBiquadFilter();
            filterNode.type = 'highpass';
            filterNode.frequency.value = parameters[0].value;
            source.connect(filterNode);
            return filterNode;

        };

        function addDistortion(source, parameters,context) {
            var distortion = context.createWaveShaper();
            var amount = parameters[0].value;
            var n = parameters[1].value;
            distortion.curve = makeDistortionCurve(amount, n);
            distortion.oversample = '4x';
            source.connect(distortion);
            return distortion;
        }

        function makeDistortionCurve(amount, n) {
            var k = typeof amount === 'number' ? amount : 50,
                n_samples = typeof n === 'number' ? n : 44100,
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

        function addLowShelfFilter(source,parameter,context){
            var biquadFilter = context.createBiquadFilter();
            biquadFilter.type = "lowshelf";
            biquadFilter.frequency.value = parameter[0].value;
            biquadFilter.gain.value = parameter[1].value;

            source.connect(biquadFilter);
            return biquadFilter;
        }

        function addPeakingFilter(source,parameter,context){
            var biquadFilter = context.createBiquadFilter();
            biquadFilter.type = "peaking";
            biquadFilter.frequency.value = parameter[0].value;
            biquadFilter.Q.value = parameter[1].value;
            biquadFilter.gain.value = parameter[2].value;
            source.connect(biquadFilter);
            return biquadFilter;

        }


        function getTheDestNodes(destNode, source, model,context) {
            return (destNode == 1) ? source
                : model.nodes.filter(function (node) {
                return (node.data.id == destNode);
            }).map(function (node) {
                return getTheSourceNodes(node.data.id, addEffect(node.data, source,context), model,context);
            }).reduce(function (prev, next) {
                return prev.concat(next);
            }, []).reduce(function () {
            });

        }

        function getTheSourceNodes(sourceNode, source, model,context) {

            return model.connections.filter(function (connection) {
                return (connection.data.source.nodeID == sourceNode);
            }).map(function (connection) {
                return getTheDestNodes(connection.data.dest.nodeID, source, model,context);
            }).reduce(function () {
            });
        }

        function getTheDestNodesProject(destNode, source, model,context) {
            return (destNode == 1) ? source
                : model.nodes.filter(function (node) {
                return (node.id == destNode);
            }).map(function (node) {
                return getTheSourceNodesProject(node.id, addEffect(node, source,context), model,context);
            }).reduce(function (prev, next) {
                return prev.concat(next);
            }, []).reduce(function () {
            });

        }

        function getTheSourceNodesProject(sourceNode, source, model,context) {

            return model.connections.filter(function (connection) {
                return (connection.source.nodeID == sourceNode);
            }).map(function (connection) {
                return getTheDestNodesProject(connection.dest.nodeID, source, model,context);
            }).reduce(function () {
            });
        }


        function addVolumeGain(source, parameters,context){
            var volumeNode = context.createGain();
            volumeNode.gain.value = parameters[0].value;
            source.connect(volumeNode);
            return volumeNode;
        }

        function addEffect(node, source,context) {
            switch (node.name) {
                case 'Distortion':
                    console.log('I am adding distortion effect');
                    return addDistortion(source, node.parameters,context);
                case 'Low-pass filter':
                    console.log('I am adding Low pass filter');
                    return addLowPassFilterNode(source, node.parameters,context);
                case 'Delay':
                    console.log('I am adding Delay');
                    return addDelay(source, node.parameters,context);
                case 'Gain LFO':
                    console.log('I am adding Gain LFO');
                    return addGainLFO(source, node.parameters,context);
                case 'Volume/Gain':
                    console.log('I am adding Volume/Gain');
                    return addVolumeGain(source, node.parameters,context);
                case 'Chorus':
                    console.log('I am adding Chorus');
                    return addChorus(source, node.parameters, context);
                case 'Low-shelf filter':
                    console.log('I am adding Low-shelf filter');
                    return addLowShelfFilter(source, node.parameters, context);
                case 'Peaking filter':
                    console.log('I am adding Peaking filter');
                    return addPeakingFilter(source, node.parameters, context);
                case 'High-pass filter':
                    console.log('I am adding High-pass filter');
                    return addHighPassFilterNode(source, node.parameters, context);

                default :
                    return getTheSourceNodesProject(0, source, node.dataProject,context);
            }
        }


}
})();