(function() {
    'use strict';
    angular.module('guitareffect.pedalEffect')
        .constant('PEDAL_EFFECT_CONSTANT', {
            initListFilter: {
                repeatSelect: null,
                availableOptions: [
                    {
                        id: '0', name: 'Distortion',
                        node: {
                            name: 'Distortion',
                            //id: nextNodeID++,
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
                            parameters: [
                                {
                                    name: 'Amount',
                                    value: 400,
                                    options: {
                                        floor: 0,
                                        ceil: 1000
                                    }
                                },
                                {
                                    name: 'n_sample',
                                    value: 44100,
                                    options: {
                                        floor: 0,
                                        ceil: 100000,
                                        step: 10,
                                        precision: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: '5', name: 'Filter',
                        node: {
                            name: 'Filter',
                            //id: nextNodeID++,
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
                            parameters: [
                                {
                                    name: 'Frequency',
                                    value: 200,
                                    options: {
                                        floor: 0,
                                        ceil: 1000000,
                                        step: 100,
                                        precision: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: '25', name: 'Delay',
                        node: {
                            name: 'Delay',
                            //id: nextNodeID++,
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
                                },
                                {
                                    name: " "
                                }
                            ],
                            parameters: [
                                {
                                    name: 'Time',
                                    value: 5,
                                    options: {
                                        floor: 0,
                                        ceil: 100
                                    }
                                },
                                {
                                    name: 'Frequency',
                                    value: 400,
                                    options: {
                                        floor: 0,
                                        ceil: 1000000,
                                        step: 100,
                                        precision: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: '3', name: 'Chorus',
                        node: {
                            name: 'Chorus',
                            //id: nextNodeID++,
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
                                },
                                {
                                    name: " "
                                }
                            ],
                            parameters: [
                                {
                                    name: 'Time Node',
                                    value: 0.5,
                                    options: {
                                        floor: 0,
                                        ceil: 1,
                                        step: 0.1,
                                        precision: 1
                                    }
                                },
                                {
                                    name: 'Time Gain',
                                    value: 0.5,
                                    options: {
                                        floor: 0,
                                        ceil: 1,
                                        step: 0.1,
                                        precision: 1
                                    }
                                }
                                ,
                                {
                                    name: 'Frequency',
                                    value: 20,
                                    options: {
                                        floor: 0,
                                        ceil: 100
                                    }
                                }
                            ]
                        }
                    },
                    {
                        id: '4', name: 'Gain LFO',
                        node: {
                            name: 'Gain LFO',
                            //id: nextNodeID++,
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
                                },
                                {
                                    name: " "
                                }
                            ],
                            parameters: [
                                {
                                    name: 'Frequency',
                                    value: 20,
                                    options: {
                                        floor: 0,
                                        ceil: 100
                                    }
                                }
                            ]
                        }
                    }
                ]

            },
            chartDataModel: {
                title: "write your project name",
                nodes: [
                    {
                        name: "Input",
                        id: 0,
                        x: 0,
                        y: 0,
                        width: 150,
                        inputConnectors: [],
                        outputConnectors: [
                            {
                                name: " ",
                            },

                        ],
                    },
                    {
                        name: "Output",
                        id: 1,
                        x: 200,
                        y: 200,
                        width: 150,
                        inputConnectors: [
                            {
                                name: " ",
                            },
                        ],
                        outputConnectors: [],
                    },

                ],

                connections: []
            }
        });


})();