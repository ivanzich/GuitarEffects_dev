(function () {
    'use strict';

    angular
        .module('app')
        .controller('JsPlumpController', Controller);

    function Controller() {


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
        var chartDataModel = {

            nodes: [
                {
                    name: "Example Node 1",
                    id: 0,
                    x: 0,
                    y: 0,
                    width: 350,
                    inputConnectors: [
                        {
                            name: "A",
                        },
                        {
                            name: "B",
                        },
                        {
                            name: "C",
                        },
                    ],
                    outputConnectors: [
                        {
                            name: "A",
                        },
                        {
                            name: "B",
                        },
                        {
                            name: "C",
                        },
                    ],
                },

                {
                    name: "Example Node 2",
                    id: 1,
                    x: 400,
                    y: 200,
                    inputConnectors: [
                        {
                            name: "A",
                        },
                        {
                            name: "B",
                        },
                        {
                            name: "C",
                        },
                    ],
                    outputConnectors: [
                        {
                            name: "A",
                        },
                        {
                            name: "B",
                        },
                        {
                            name: "C",
                        },
                    ],
                },

            ],

            connections: [
                {
                    name:'Connection 1',
                    source: {
                        nodeID: 0,
                        connectorIndex: 1,
                    },

                    dest: {
                        nodeID: 1,
                        connectorIndex: 2,
                    },
                },
                {
                    name:'Connection 2',
                    source: {
                        nodeID: 0,
                        connectorIndex: 0,
                    },

                    dest: {
                        nodeID: 1,
                        connectorIndex: 0,
                    },
                },

            ]
        };


        var vm = this;
        vm.keyDown = keyDown;
        vm.keyUp = keyUp;
        vm.addNewNode = addNewNode;
        vm.addNewInputConnector = addNewInputConnector;
        vm.addNewOutputConnector= addNewOutputConnector;
        vm.deleteSelected = deleteSelected;
        vm.chartViewModel = new flowchart.ChartViewModel(chartDataModel);

        //
        // Event handler for key-down on the flowchart.
        //
        function keyDown(evt){
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
        function addNewNode() {

            var nodeName = prompt("Enter a node name:", "New node");
            if (!nodeName) {
                return;
            }

            //
            // Template for a new node.
            //
            var newNodeDataModel = {
                name: nodeName,
                id: nextNodeID++,
                x: 0,
                y: 0,
                inputConnectors: [
                    {
                        name: "X"
                    },
                    {
                        name: "Y"
                    },
                    {
                        name: "Z"
                    }
                ],
                outputConnectors: [
                    {
                        name: "1"
                    },
                    {
                        name: "2"
                    },
                    {
                        name: "3"
                    }
                ],
            };

            vm.chartViewModel.addNode(newNodeDataModel);
        };

        //
        // Add an input connector to selected nodes.
        //
        function addNewInputConnector() {
            var connectorName = prompt("Enter a connector name:", "New connector");
            if (!connectorName) {
                return;
            }

            var selectedNodes = vm.chartViewModel.getSelectedNodes();
            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.addInputConnector({
                    name: connectorName,
                });
            }
        };

        //
        // Add an output connector to selected nodes.
        //
        function addNewOutputConnector() {
            var connectorName = prompt("Enter a connector name:", "New connector");
            if (!connectorName) {
                return;
            }

            var selectedNodes = vm.chartViewModel.getSelectedNodes();
            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.addOutputConnector({
                    name: connectorName,
                });
            }
        };

        //
        // Delete selected nodes and connections.
        //
        function deleteSelected() {

            vm.chartViewModel.deleteSelected();
        };

    }

})();