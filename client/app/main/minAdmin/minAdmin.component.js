'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './minAdmin.routes';

export class minAdminComponent {
  /*@ngInject*/
  constructor() {}
  $onInit(){}
}

export default angular.module('nixApp.minAdmin', [uiRouter])
  .config(routes)
  .component('minAdmin', {
    template: require('./minAdmin.pug'),
    controller: minAdminComponent
  })
  .name;
