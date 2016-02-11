(function () {
    'use strict';

    angular
        .module('guitareffect.pedaleffect')
        .controller('PedalEffectController', Controller);


    function Controller(
        ProjectService,
        FlashService,
        UserService,
        $stateParams,
        PedalEffectService,
        PEDAL_EFFECT_CONSTANT,
        $localStorage
    ) {


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
        var context,
            mic,
            soundSource,
            soundBuffer,
            url = 'app-content/music/music.mp3';

        var vm = this;


        vm.selectedModel = null;
        vm.user = null;
        vm.toggle = true;
        vm.chartViewModel = null;
        vm.projectList = null;
        vm.comment = null;
        vm.data = angular.copy(PEDAL_EFFECT_CONSTANT.initListFilter);
        vm.keyDown = keyDown;
        vm.keyUp = keyUp;
        vm.addNewNode = addNewNode;
        vm.addNewInputConnector = addNewInputConnector;
        vm.addNewOutputConnector = addNewOutputConnector;
        vm.deleteSelected = deleteSelected;
        vm.startSound = startSound;
        vm.stopSound = stopSound;
        vm.saveProject = saveProject;
        vm.updateProject = updateProject;
        vm.addNewProjectChartViewModel = addNewProjectChartViewModel;
        vm.addComment = addComment;
        vm.activateMicro = activateMicro;
        vm.deactivateMicro = deactivateMicro;




        initController();
        function initController() {

            initSelectProjectModel();

            initChartViewModel();
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });

        }


        function initSelectProjectModel(){
            ProjectService.GetProjectList()
                .then(function (projectList) {
                    vm.projectList = projectList;
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function initChartViewModel(){
            if ($stateParams.partyID) {
                ProjectService.GetById($stateParams.partyID)
                    .then(function (project) {
                        vm.chartViewModel = new flowchart.ChartViewModel(project);
                        nextNodeID = angular.copy(project.nodes.sort(function (x, y) {
                            return x.id < y.id;
                        })[0].id);
                        nextNodeID++;
                        $localStorage.data= vm.chartViewModel.data;

                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            } else {
                //vm.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
                vm.chartViewModel = new flowchart.ChartViewModel($localStorage.data);

            }
        }

        function initAudioContext(){
            if (typeof AudioContext !== "undefined") {
                context = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
                context = new webkitAudioContext();
            } else {
                throw new Error('AudioContext not supported. :(');
            }
        }

        function saveProject() {

            vm.chartViewModel.data.author = vm.user.username;
            vm.chartViewModel.data.authorId = vm.user._id;
            delete(vm.chartViewModel.data._id);


            ProjectService.Create(vm.chartViewModel.data)
                .then(function (project) {

                    vm.chartViewModel.data._id = project;
                    FlashService.Success('Project created');

                })
                .catch(function (error) {
                    FlashService.Error(error);
                });

        }

        function updateProject() {
            ProjectService.Update(vm.chartViewModel.data)
                .then(function () {
                    FlashService.Success('Project updated');

                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }


        // Step 2: Load our Sound using XHR
        function startSound() {
            initAudioContext();
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

                //volumeNode.connect(distortion);
                PedalEffectService.getTheSourceNodes(0, soundSource, vm.chartViewModel,context).connect(context.destination);


                // Finally
                playSound(soundSource);
            });

        }


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
        }



        function addNewProjectChartViewModel(id) {

            vm.data.repeatSelect = null;

            ProjectService.GetById(id)
                .then(function (project) {
                    var newModel = {
                        name: project.title,
                        id: nextNodeID++,
                        x: 0,
                        y: 0,
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
                    };
                    vm.chartViewModel.addNode(newModel);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });

        }

        //
        // Add an input connector to selected nodes.
        //
        function addNewInputConnector() {

            var selectedNodes = vm.chartViewModel.getSelectedNodes();
            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.addInputConnector({
                    //name: connectorName,
                    name: ' '
                });
            }
        }

        //
        // Add an output connector to selected nodes.
        //
        function addNewOutputConnector() {

            var selectedNodes = vm.chartViewModel.getSelectedNodes();
            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.addOutputConnector({
                    //name: connectorName,
                    name: ' '
                });
            }
        }

        //
        // Delete selected nodes and connections.
        //
        function deleteSelected() {

            vm.chartViewModel.deleteSelected();
        }

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
        }


        function addComment(){

            var userComment = {
                user : vm.user.username,
                text: vm.comment
            }
            vm.chartViewModel.data.comment.splice(0, 0, userComment);
            console.log('Add comment function');

                ProjectService.AddComment(vm.chartViewModel.data)
                    .then(function () {
                        FlashService.Success('Projet commente');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            console.log(vm.chartViewModel.data);
        }

        //Fonction pour activer le micro
        function activateMicro() {
            initAudioContext();
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                ||  navigator.mozGetUserMedia ||  navigator.msGetUserMedia;
            navigator.getUserMedia ({ audio: true },
                function (stream) {
                    mic = context.createMediaStreamSource(stream);
                    PedalEffectService.getTheSourceNodes(0, mic, vm.chartViewModel,context).connect(context.destination);
                },
                function (e) {
                    // error
                    console.error(e)});

        };

        function deactivateMicro(){
            mic.disconnect();
        }
    }

})();