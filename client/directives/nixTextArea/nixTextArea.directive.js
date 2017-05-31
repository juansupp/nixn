'use strict';
const angular = require('angular');

export default angular.module('nixApp.nixTextArea', [])
  .directive('nixTextArea', function() {
    return {
      template: require('./nixTextArea.pug'),
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        ngModel: '=',
        ngChange: '&',
        label: '@',
        required: '=',
        name: '=',
        frm: '=',
      },
      link: function(scope, element, attrs) {}
    };
  })
  .name;
