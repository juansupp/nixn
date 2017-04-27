'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('m.assignActivo', {
      url: '/assignActivo',
      template: '<assign-activo></assign-activo>'
    });
}
