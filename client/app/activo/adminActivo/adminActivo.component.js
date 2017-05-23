'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');

import route from './adminActivo.route';
export class adminActivoComponent {
  /*@ngInject*/
  constructor($bi, $hummer, $pop,$nxData,$dialog) {
    this.$bi = $bi;
    this.$hummer = $hummer;
    this.$pop = $pop;
    this.nxData = $nxData;
    this.$dialog = $dialog;
  }

  loadAreas () {
    //Esperamos la digestión de angular
    _.defer(() => {
      //Si se ha seleccionado cliente
      if(this.model.id_cliente.length > 0){
        //Se agrega el filtro para buscar todas las areas del cliente seleccionado
        this.nxData.area.w = { fk_id_cliente : this.model.id_cliente };
        this.allActivos();
      }
    });
  }
  loadContactos(){
    //Esperamos la digestión de angular
    _.defer(() => {
      //Si se ha seleccionado area
      if(this.model.id_area.length > 0){
        //Cargamos todos los contactos
        this.nxData.contacto.w = { fk_id_area : this.model.id_area };
        this.allActivos();
      }
    });
  }
  showDatos(ev,activo) {
    //Globaliza el activo
    this.activo = activo;
    //Abrir el dialogo y mostrar esp, soft y datos
    this.$dialog.custom(ev,() => this,require('./datos.pug'));
    //Campos para el dialogo de datos
    this.showCaracteristicas(activo);
    //
    this.showSoftware(activo);
  }

  showSoftware(activo) {
    this.$bi.licencia("full_licencia")
      .all({id_activo :  activo.id_activo})
      .then(software => this.software = software.data);
  }

  showCaracteristicas(activo) {
    //Busca todas las caracteristicas del activo en parametro
    this.$bi.car("full_caracteristica")
      .all({id_activo : activo.id_activo})
      .then(caracteristicas => {
        //se crea nueva variable scope para agregar las caracteristicas
        this.caracteristicas = new Array();
        //Recorre cada una de las caracteristicas
        caracteristicas.data.forEach(car => {
          //Agrega objeto personalizado al array
          // d = disaply, v = value
          this.caracteristicas.push({d : car._caracteristica, v: car._valor })
        });
    });
  }
  allActivos(page) {
    //Esperamos la digestión
    _.defer(() => {
      let filter = this.model;

      this.currenTotal(filter);
      this.$bi.activo('full_activo')
        .paginate(filter,page-1,50)
        .then(response => {
        //this.tickets = _.sortBy(response.data, 'N_Ticket').reverse();
        this.activos = response.data;
      });

    })
  }

  currenTotal (filter) {
    return this.$bi.activo('full_activo')
      .find(['count(id_activo) total'],filter)
      .then(response => this.totalActivos = response.data[0].total);
  }

  $onInit(){
    this.totalActivos = new Object();
    this.current = 1;
    this.allActivos(1);
  }

}

export default
  angular
  .module('nixApp.adminActivo', [uiRouter])
  .config(route)
  .component('adminActivo', {
    template: require('./adminActivo.pug'),
    controller: adminActivoComponent
  })
  .name;
