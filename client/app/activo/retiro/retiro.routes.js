'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('m.retiro', {
      url: '/retiro',
      template: '<retiro></retiro>'
    });
}
