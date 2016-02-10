(function () {
    'use strict';

    angular
        .module('app')
        .controller('PedalEffectController', Controller);


    function Controller(ProjectService, FlashService,$stateParams,PedalEffectService,PEDAL_EFFECT_CONSTANT) {


        //
        // Code for the delete key.
        //
        var deleteKeyCode = 46;

        //
        // Code for control key.
        //
        var ctrlKeyCode = 17;

        //
        // Set to true when the ctrl key is down.
        //
        var ctrlDown = false;

        //
        // Code for A key.
        //
        var aKeyCode = 65;

        //
        // Code for esc key.
        //
        var escKeyCode = 27;

        //
        // Selects the next node id.
        //
        var nextNodeID = 10;



        //
        // Setup the data-model for the chart.
        //
        var chartDataModel = angular.copy(PEDAL_EFFECT_CONSTANT.chartDataModel);
        var context,
            soundSource,
            soundBuffer,
            url = 'app-content/music/music.mp3';


        var vm = this;


        vm.selectedModel=null;
        vm.toggle = true;
        vm.keyDown = keyDown;
        vm.keyUp = keyUp;
        vm.addNewNode = addNewNode;
        vm.addNewInputConnector = addNewInputConnector;
        vm.addNewOutputConnector = addNewOutputConnector;
        vm.deleteSelected = deleteSelected;
        vm.chartViewModel = null;
        vm.startSound = startSound;
        vm.stopSound = stopSound;
        vm.playSoundWithEffect= playSoundWithEffect;
        vm.saveProject = saveProject;
        vm.updateProject = updateProject;
        vm.addNewProjectChartViewModel =  addNewProjectChartViewModel;
        vm.projectList = null;


        function saveProject(){

            var projectName = prompt("Enter a project name:", "Title");
            if (!projectName) {
                return;
            }
            vm.chartViewModel.data.title = projectName;
            delete(vm.chartViewModel.data._id);


            ProjectService.Create(vm.chartViewModel.data)
                .then(function (project) {

                    vm.chartViewModel.data._id=project;
                    console.log(vm.chartViewModel.data);
                    FlashService.Success('Project created');

                })
                .catch(function (error) {
                    FlashService.Error(error);
                });

        }
        function updateProject(){
            ProjectService.Update(vm.chartViewModel.data)
                .then(function () {
                    FlashService.Success('Project updated');

                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        initController();
        // Step 1 - Initialise the Audio Context
        // There can be only one!
        function initController() {

            ProjectService.GetProjectList()
                .then(function (projectList) {
                    vm.projectList = projectList;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });

            if($stateParams.partyID) {
                ProjectService.GetById($stateParams.partyID)
                    .then(function (project) {
                        vm.chartViewModel = new flowchart.ChartViewModel(project);
                        nextNodeID = angular.copy(project.nodes.sort(function(x, y) {
                            return x.id < y.id;
                        })[0].id);
                        nextNodeID++;
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }else {
                vm.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
            }

            if (typeof AudioContext !== "undefined") {
                context = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
                context = new webkitAudioContext();
            } else {
                throw new Error('AudioContext not supported. :(');
            }
        }

        vm.data = angular.copy(PEDAL_EFFECT_CONSTANT.initListFilter);
        vm.data.availableOptions.forEach(function(option) {
           option.node.id = nextNodeID++;
        });


        //
        // Event handler for key-down on the flowchart.
        //
        function keyDown(evt) {
            if (evt.keyCode === ctrlKeyCode) {

                ctrlDown = true;
                evt.stopPropagation();
                evt.preventDefault();
            }
        }

        //
        // Event handler for key-up on the flowchart.
        //
        function keyUp(evt) {

            if (evt.keyCode === deleteKeyCode) {
                //
                // Delete key.
                //
                vm.chartViewModel.deleteSelected();
            }

            if (evt.keyCode == aKeyCode && ctrlDown) {
                //
                // Ctrl + A
                //
                vm.chartViewModel.selectAll();
            }

            if (evt.keyCode == escKeyCode) {
                // Escape.
                vm.chartViewModel.deselectAll();
            }

            if (evt.keyCode === ctrlKeyCode) {
                ctrlDown = false;

                evt.stopPropagation();
                evt.preventDefault();
            }
        };

        //
        // Add a new node to the chart.
        //
        function addNewNode(id) {
            var option = (!id) ? null : vm.data.availableOptions.filter(function (option) {
                return (option.id === id);
            })[0];


            var newNodeDataModel = angular.copy(option.node);
            newNodeDataModel.id = nextNodeID++;

            vm.data.repeatSelect = null;
            vm.chartViewModel.addNode(newNodeDataModel);
        };

        function addNewProjectChartViewModel(id){

            vm.data.repeatSelect = null;

            ProjectService.GetById(id)
                .then(function(project){
                    console.log(project);
                    var newModel = {
                        name : project.title,
                        id: nextNodeID++,
                        x:0,
                        y:0,
                        inputConnectors: [
                            {
                                name: " "
                            }
                        ],
                        outputConnectors: [
                            {
                                name: " "
                            }
                        ],
                        dataProject: project
                    }
                    vm.chartViewModel.addNode(newModel);
                })
                .catch(function(error){
                    FlashService.Error(error);
                });

        }

        //
        // Add an input connector to selected nodes.
        //
        function addNewInputConnector() {
            /*
             var connectorName = prompt("Enter a connector name:", "New connector");
             if (!connectorName) {
             return;
             }
             */
            var selectedNodes = vm.chartViewModel.getSelectedNodes();
            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.addInputConnector({
                    //name: connectorName,
                    name: ' ',
                });
            }
        };

        //
        // Add an output connector to selected nodes.
        //
        function addNewOutputConnector() {
            /*
             var connectorName = prompt("Enter a connector name:", "New connector");
             if (!connectorName) {
             return;
             }
             */

            var selectedNodes = vm.chartViewModel.getSelectedNodes();
            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.addOutputConnector({
                    //name: connectorName,
                    name: ' ',
                });
            }
        };

        //
        // Delete selected nodes and connections.
        //
        function deleteSelected() {

            vm.chartViewModel.deleteSelected();
        };


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
                //var distortion = context.createWaveShaper();
                //distortion.curve = makeDistortionCurve(400);
                //distortion.oversample = '4x';

                //Set the volume
                volumeNode.gain.value = 0.5;

                // Wiring
                soundSource.connect(volumeNode);
                //volumeNode.connect(distortion);
                playSoundWithEffect(volumeNode).connect(context.destination);
                /*
                vm.chartViewModel.connections.sort(function(x, y) {
                    return x.data.source.id < y.data.source.id;


                    //return (destNode == 1) ? source
                    //    : vm.chartViewModel.nodes.filter(function(node) {
                    //    return (node.data.id == destNode);
                    //}).map(function(node) {
                    //    return getTheSourceNodes(node.data.id, addEffect(node.data.name, source));
                    //}).reduce(function(prev, next) {
                    //    return prev.concat(next);
                    //}, []).reduce(function(){});

                }).map(function(x) {
                    return [x.data.source.id, x.data.dest.id, x.data.name];
                })*/
                //addDistortion(volumeNode).connect(context.destination);
                //filterNode.connect(distortion);
                //distortion.connect(context.destination);

                // Finally
                playSound(soundSource);
            });

        }

        function playSoundWithEffect(source){

            var r = getTheSourceNodes(0,source,vm.chartViewModel);

            return r;
          //vm.chartViewModel.connections.length  console.log(vm.chartViewModel.connections[0].destnodeID.toString());
            //console.log(vm.chartViewModel.connections[i].dest.nodeID));

        }
        function getTheDestNodes(destNode,source,model){
            return (destNode == 1) ? source
            : model.nodes.filter(function(node) {
                return (node.data.id == destNode);
            }).map(function(node) {
                return getTheSourceNodes(node.data.id, addEffect(node.data, source),model);
            }).reduce(function(prev, next) {
                return prev.concat(next);
            }, []).reduce(function(){});

            //var i=0;
            //if(destNode !== 1){
            //    for (i = 0; i < vm.chartViewModel.nodes.length; i++) {
            //        //console.log(vm.chartViewModel.nodes[i].data.id);
            //        if (vm.chartViewModel.nodes[i].data.id == destNode) {
            //            var effectAdded= addEffect(vm.chartViewModel.nodes[i].data.name,source);
            //            return getTheSourceNodes(vm.chartViewModel.nodes[i].data.id,effectAdded);
            //        }
            //    }
            //}else{
            //
            //    console.log("Return source");
            //    return source;
            //}

        }
        function getTheSourceNodes(sourceNode,source,model){

            //var i=0;
            //for(i=0; i < vm.chartViewModel.connections.length; i++){
            //    if(vm.chartViewModel.connections[i].data.source.nodeID == sourceNode){
            //        var y= getTheDestNodes(vm.chartViewModel.connections[i].data.dest.nodeID,source);
            //        console.log(y);
            //        return y;
            //    };
            //}
            return model.connections.filter(function(connection) {
                return (connection.data.source.nodeID == sourceNode);
            }).map(function(connection) {
                return getTheDestNodes(connection.data.dest.nodeID,source,model);
            }).reduce(function(){});
        }

        function getTheDestNodesProject(destNode,source,model){
            return (destNode == 1) ? source
                : model.nodes.filter(function(node) {
                return (node.id == destNode);
            }).map(function(node) {
                return getTheSourceNodesProject(node.id, addEffect(node, source),model);
            }).reduce(function(prev, next) {
                return prev.concat(next);
            }, []).reduce(function(){});

        }
        function getTheSourceNodesProject(sourceNode,source,model){

            return model.connections.filter(function(connection) {
                return (connection.source.nodeID == sourceNode);
            }).map(function(connection) {
                return getTheDestNodesProject(connection.dest.nodeID,source,model);
            }).reduce(function(){});
        }

        function addEffect(node,source){
            switch (node.name){
                case 'Distortion':
                    console.log('I am adding distortion effect');
                    return addDistortion(source,node.parameters);
                    break;
                case 'Filter':
                    console.log('I am adding Filter');
                    return addFilterNode(source,node.parameters);
                    break;
                case 'Delay':
                    console.log('I am adding Delay');
                    return addDelay(source,node.parameters);
                    break;
                case 'Gain LFO':
                    console.log('I am adding Gain LFO');
                    return addGainLFO(source,node.parameters);
                    break;
                case 'Chorus':
                    console.log('I am adding Chorus');
                    //return addChorus(source,node.parameters);
                    return PedalEffectService.addChorus(source,node.parameters,context);
                    break;
                default :
                    console.log('Default, do nothing');
                    console.log(vm.chartViewModel.connections[0].data);
                    console.log(node.dataProject.connections[0]);
                    return getTheSourceNodesProject(0,source,node.dataProject);

            }
        }



        /*
        *Fonction pour ajouter les effets
        *
         */

        function addFilterNode(source,parameters){
            var filterNode = context.createBiquadFilter();
            // Specify this is a lowpass filter
            filterNode.type = 'lowpass';
            // Quieten sounds over 220Hz
            filterNode.frequency.value = parameters[0].value;
            source.connect(filterNode);
            return filterNode;

        };

        function addDistortion(source,parameters){
            var distortion = context.createWaveShaper();
            var amount = parameters[0].value;
            var n = parameters[1].value;
            distortion.curve = makeDistortionCurve(amount,n);
            distortion.oversample = '4x';
            source.connect(distortion);
            return distortion;
        }

        function makeDistortionCurve(amount,n) {
            var k = typeof amount === 'number' ? amount : 50,
                n_samples= typeof n ==='number' ? n : 44100,
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

        //Function delay
        function addDelay(source,parameters){
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
        function addGainLFO(source, parameters){

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

        //Function chorus
        function addChorus(source,parameters){
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