'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('m.MinAdmin', { // => Se cambia a admin DB
      url: '/MinAdmin',
      template: '<min-admin></min-admin>'
    });
}
