'use strict';

const angular = require('angular');

function nixTitle() {
  return {
    restrict: 'EA',
    scope: {
      title: '@',
      text: '@'
    }
  }
}

export default angular
  .module('nixApp.nixTitle', [])
  .directive('nixTitle', nixTitle)
  .name;
