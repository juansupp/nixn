'use strict'
const angular = require('angular');
const uiRouter = require('angular-ui-router');

import route from './adminCliente.route';

export class AdminClienteComponent {
  /*@ngInject*/

  constructor(moment, $select, $bi, $hummer, $pop, $scope, $cookieStore, $time) {
    this.$select = $select;
    this.$bi = $bi;
    this.$hummer = $hummer;
    this.$pop = $pop;
    this.$scope = $scope;
    this.$cookieStore = $cookieStore;
    this.$time = $time;
    this.moment = moment;
  }


  allClientes(filter,page) {
    this.currenTotal(filter);
    this.$bi.cliente('full_out_contacto')
      .paginate(filter,page-1,2)
      .then(response => this.clientes = response.data);
  }

  currenTotal (filter) {
    this.$bi.cliente('full_out_contacto')
      .find(['count(id_contacto) total'],filter)
      .then(response => this.totalTickets = response.data[0].total);
  }




  $onInit(){
    this.current = 1;

    this.allClientes({"1":"1"},1);
    // ARRAY  => OBJECTS !!
    this.selected = new Array();

    }
}

export default angular
  .module('nixApp.adminCliente', [uiRouter])
  .config(route)
  .component('adminCliente', {
    template: require('./adminCliente.pug'),
    controller: AdminClienteComponent
  }).name
