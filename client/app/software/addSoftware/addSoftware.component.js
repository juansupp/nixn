'use strict';

const angular = require('angular');
const uiRouter = require('angular-ui-router');

import route from './addSoftware.route';

export class AddSoftware {
  /*@ngInject*/
  constructor($bi, $pop) {
    this.$bi = $bi;
    this.$pop = $pop;
  }

  _addSoftware() {
    this.$bi
      .software()
      .insert(this.model)
      .then(() => this.$pop.show('Software agregado satisfactoriamente'));
  }

  $onInit() {
    this.model = {};
  }

}

export default angular
  .module('nixApp.addSoftware', [uiRouter])
  .config(route)
  .component('addSoftware', {
    template: require('./addSoftware.pug'),
    controller: AddSoftware
  })
  .name;
