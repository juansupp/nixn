'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');

import routes from './assignActivo.routes';

export class AssignActivoComponent {
  /*@ngInject*/
  constructor($dialog,$imagenix, moment, Upload, $select, $time, $bi, $hummer, $pop, $scope, $cookieStore, $http,$nxData) {
    this.$select = $select;
    this.$bi = $bi;
    this.$hummer = $hummer;
    this.$pop = $pop;
    this.$scope = $scope;
    this.$cookieStore = $cookieStore;
    this.$time = $time;
    this.$http = $http;
    this.$upload = Upload;
    this.$imagenix = $imagenix;
    this.moment = moment;
    this.$dialog = $dialog;
    this.nxData = $nxData;
  }


  confirmAssign(ticket,event) {
    return this.$dialog
      .confirm(
        event,
        'Confirmación',
        `Está seguro que desea asignar el activo con
        serial ${this.activoSeleccionado.serial} al ticket numero ${ticket.N_Ticket}`);
  }

  assignActivo(ticket,event){

    this.confirmAssign(ticket,event).then(()=>{
      this.actualizarTicket(ticket).then(()=>{
        this.$pop.show('Activo asignado a ticket satisfactoriamente');
        this.filterByRol();
      });
    })
  }

  actualizarTicket (ticket) {
    let valObj = {
      fk_id_activo : this.activoSeleccionado[0].id_activo,
      estado : 'P'
    },
    whereObj = {
      id_ticket : ticket.id_ticket
    };

    return this.$bi.ticket().update(valObj,whereObj);
  }


  filterByRol() {
    let
      usuario = this.$cookieStore.get('user'),
      filtro = new Object({1:'1'});

    if ( usuario.id_rol == 3)
      filtro = { fk_id_tecnico :  usuario.id_usuario }

    this.$bi.ticket('f_Ticket')
      .all(filtro)
      .then(response => {
        this.fTickets = response.data;
    });
  }

  $onInit() {
    this.fTickets = new Object();
    this.activoSeleccionado = new Object();
    this.filterByRol();
  }
}

export default angular.module('nixApp.assignActivo', [uiRouter]).config(routes).component('assignActivo', {
  template: require('./assignActivo.pug'),
  controller: AssignActivoComponent
}).name;
/*this.$upload.upload({
    url: 'api/astral/imagen',
    method: 'POST',
    //data: data, // Any data needed to be submitted along with the files
    file: this.model.images[0]
  });*/
