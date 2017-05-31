'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('m.addSoftware', {
      url: '/addSoftware',
      template: '<add-software></add-software>'
    });
}
