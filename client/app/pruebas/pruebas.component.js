'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './pruebas.routes';

export class PruebasComponent {
  /*@ngInject*/
  constructor($bi,$nxData) {
    this.message = 'Hello';
    this.some = '';
    this.sme = '';
    this.$bi = $bi;
    this.nxData = $nxData;
  }

  $onInit() {
    /* 
    */


    //function normalizeColumna(listObj) {
    let listObj = [{
      key: 'id_software',
      value: 16
    }, {
      key: '_software',
      value: 16
    }];
    let row = {};
    listObj.forEach(item => row[item.key] = item.value);
    console.log(row)
    //}

    /*
    */

    this.col = [{
      name: '_contacto',
      title: 'Contacto',
    }, {
      name: 'correo',
      title: 'Correo'
    }];
    //
    let play = (ev, activo) => console.log(ev, activo);
    //
    this.actions = [{
      play: play,
      icon: 'history',
      toolTip: 'Ver historial de sucesos'
    }, {
      play: play,
      icon: 'face',
      toolTip: 'Ver historial de sucesos'
    }];
    //
    this.filter = {
      id_contacto: "1" 
    };
    //
    this.model = new Object();
    this.pru = new Object();

    this.nxFrm = {
      cliente: this.pru.cliente,
      area: this.pru.area
    };

    this.items = {
      uno: 'uno',
      dos: 'dos',
      tres: 'tres'
    };

  }
}

export default angular.module('nixApp.pruebas', [uiRouter])
  .config(routes)
  .component('pruebas', {
    template: require('./pruebas.pug'),
    controller: PruebasComponent
  })
  .name;
