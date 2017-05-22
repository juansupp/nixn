'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './creator.routes';

export class creatorComponent {
  /*@ngInject*/
  constructor() {

  }
  $onInit(){

  }
}

export default angular.module('nixApp.creator', [uiRouter])
  .config(routes)
  .component('creator', {
    template: require('./creator.pug'),
    controller: creatorComponent
  })
  .name;
