'use strict';
const angular = require('angular');

export default angular.module('nixApp.nix-text-area', [])
  .directive('nixTextArea', function() {
    return {
      template: require('./nix-text-area.pug'),
      restrict: 'EA',
      require : 'ngModel',
      scope : {
          ngModel : '=',
          ngChange: '&',
          label : '@',
          required : '=',
          name : '=',
          frm : '=',
      },
      link: function(scope, element, attrs) {}
    };
  })
  .name;
