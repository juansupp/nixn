'use strict';
const angular = require('angular');

function nixText(){
    function link (scope,attrs) {
        if(!scope.type) scope.type = 'text';
    }
   return {
        template: require('./nixText.pug'),
        restrict: 'EA',
        require : 'ngModel',
        scope : {
            ngModel : '=',
            ngChange: '&',
            label : '@',
            required : '=',
            name : '=',
            frm : '=',
            type : '@',
            ngDisabled : '='
        },
        link : link
    };
}



export default angular.module('nixApp.nixText', [])
  .directive('nixText', nixText)
  .name;
