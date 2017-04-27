'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './alistarActivo.routes';

export class AlistarActivoComponent {
  /*@ngInject*/
  constructor($bi) {
    this.$bi = $bi;
  }

  alistar () {

  }

  $onInit(){
    this.model = new Object();
    this.$bi.activo("full_activo").all({id_contacto : '1'})
      .then(response => {
        console.log(response)
        this.activosBodega = response.data;

      })
  }
}

export default angular.module('nixApp.alistarActivo', [uiRouter])
  .config(routes)
  .component('alistarActivo', {
    template: require('./alistarActivo.pug'),
    controller: AlistarActivoComponent
  })
  .name;
