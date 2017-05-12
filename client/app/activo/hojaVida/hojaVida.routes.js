'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('m.hojaVida', {
      url: '/hojaVida',
      template: '<hoja-vida></hoja-vida>'
    });
}
