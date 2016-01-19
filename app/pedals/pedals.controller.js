/**
 * Created by frouyer on 18/01/16.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('Pedals.IndexController', Controller);

    function Controller($scope, $rootScope) {
        var scope = $scope;
        scope.effets = [{titre:'selectionner un effet'},{titre:'Ajout de lecteur'}];

        scope.composants =[];
        var id=1;

        //

        scope.change = function()
        {
            if ( $(".ajoutEffets option:selected").text()==='Ajout de lecteur')
            {
                scope.composants.push({'h6':'Lecteur audio','src':'IMAGES/img.png','id':'module'+id,'sup':'IMAGES/sup.png'});
                scope.$apply();

                var atr= $('#module'+id).attr("id");

                var endpointOptions = { isSource:true, isTarget:true };

                jsPlumb.draggable($('#'+atr))

                jsPlumb.addEndpoint($('#'+atr), { anchors:["Right"] },endpointOptions).addClass("right");

                jsPlumb.addEndpoint($('#'+atr), {anchors:["Left"]},endpointOptions,{cssClass:["plumb"]}).addClass("lobo");

                id =id+1;

                scope.effets = [{titre:'selectionner un effet'},{titre:'Ajout de lecteur'}];
            }
            jsPlumb.addEndpoint($('#output'), {anchors:["Left"]},{ isSource:true, isTarget:true });
        };
        //jsPlumb.addEndpoint($('#sortie'), {anchors:["Left"]});
        //Fonction suppresion
        scope.delete =function(index)
        {
            scope.composants.splice(index, 1);
        }
    }


})();

