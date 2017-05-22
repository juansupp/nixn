'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('m.Bodega', { // => Se cambia a admin DB
      url: '/bodega',
      template: '<bodega></bodega>'
    });
}
