'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './bodega.routes';

export class bodegaComponent {
  /*@ngInject*/
  constructor() {

  }
  $onInit(){

  }
}

export default angular.module('nixApp.bodega', [uiRouter])
  .config(routes)
  .component('bodega', {
    template: require('./bodega.pug'),
    controller: bodegaComponent
  })
  .name;
