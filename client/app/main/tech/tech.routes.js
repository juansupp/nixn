'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('m.Tech', { // => Se cambia a admin DB
      url: '/tech',
      template: '<tech></tech>'
    });
}
