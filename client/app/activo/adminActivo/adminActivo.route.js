'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider.state('m.adminActivo', {
    url: '/adminActivo',
    template: '<admin-activo></admin-activo>'
  });
}
