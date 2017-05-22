'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('m.Creator', { // => Se cambia a admin DB
      url: '/creator',
      template: '<creator></creator>'
    });
}
