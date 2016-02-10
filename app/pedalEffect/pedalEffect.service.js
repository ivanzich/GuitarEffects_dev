(function() {
    'use strict';
    angular.module('app')
        .factory('PedalEffectService', service);

    function service() {
        var service = {
            addChorus: addChorus
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
    }
})();