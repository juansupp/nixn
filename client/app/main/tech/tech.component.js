'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './tech.routes';

export class techComponent {
  /*@ngInject*/
  constructor() {

  }
  $onInit(){

  }
}

export default angular.module('nixApp.tech', [uiRouter])
  .config(routes)
  .component('tech', {
    template: require('./tech.pug'),
    controller: techComponent
  })
  .name;
