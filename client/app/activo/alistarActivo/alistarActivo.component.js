'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
import routes from './alistarActivo.routes';

export class AlistarActivoComponent {
  /*@ngInject*/
  constructor($bi,$scope,$select) {
    this.$scope = $scope;
    this.$bi = $bi;
    this.$select = $select;

  }

  transformChip(chip) {
    // If it is an object, it's already a known chip
    if (angular.isObject(chip)) {
      console.log(chip)
      return chip;
    }
    // Otherwise, create a new one
    return { _software: chip}
  }

  softwareSearch (query) {
      return this.$select.searchFull(query, this.softwareList, '_software');
  };

  buscarActivos(){
    let value = `'%${this.buscar}%'`;
    if(this.buscar.length >= 4) {
      this.filter = {
        _marca : value,
        _modelo  :value,
        _tipo_activo :value,
        serial : value,
        inventario :value,
        seguridad : value,
      };
      console.log(this.filter)
      this.allActivos(this.filter,this.current);
    }
  }

  verificar(activo){

    //
    this.disabled.validado = true;
    this.texto.activoRevisado = 'Pasar a entrega'
  }


  currenTotal (filter) {

    this.$bi.activo('full_activo')
      .find(['count(id_activo) total'],filter)
      .then(response => this.totalActivos = response.data[0].total);
  }

  allActivos(filter,page) {
    this.currenTotal(filter);
    this.$bi.activo('full_activo')
      .paginate(filter,page-1,1)
      .then(response => this.activosBodega = response.data);
  }

  alistar () {

  }

  $onInit(){
    this.softwareSelect = new Array();
    this.filter = new Object({fk_id_contacto : '1'});
    this.allActivos(this.filter,1);
    this.buscar = "";
    this.texto = new Object({
      activoRevisado : 'Verifica el activo para continuar'
    })
    this.disabled = new Object({validado : false});
    this.current = 1;
    this.softwareList = new Array();

    this.$bi
      .software()
      .all()
      .then(response => this.softwareList = response.data)
  }
}

export default angular.module('nixApp.alistarActivo', [uiRouter])
  .config(routes)
  .component('alistarActivo', {
    template: require('./alistarActivo.pug'),
    controller: AlistarActivoComponent
  })
  .name;
