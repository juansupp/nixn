//Librerias a usar
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './entrega.routes';

export class entregaComponent {
  /*@ngInject*/
  constructor($bi,$scope,$select,$pop,$dialog,$nxData) {
    this.$scope = $scope;
    this.$bi = $bi;
    this.$select = $select;
    this.$pop = $pop;
    this.$dialog = $dialog;
    this.nxData = $nxData;
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

  currenTotal (filter) {
    this.$bi.activo('full_activo')
      .find(['count(id_activo) total'],filter)
      .then(response => this.totalActivos = response.data[0].total);
  }

  allActivos(filter,page) {
    this.currenTotal(filter);
    this.$bi.activo('full_activo')
      .paginate(filter,page-1,1)
      .then(response =>  this.activosAlistados = response.data);
  }

  entregar (ev) {

  }


  pasarOrden(activo){
    this.activo = activo;

  }
  /**/
  $onInit(){
    this.activosEntrega = new Array();
    this.filter = new Object({ciclo : '1'});
    this.allActivos(this.filter,1);
    this.buscar = "";
    this.texto = new Object({
      activoRevisado : 'Verifica el activo para continuar'
    });
    this.disabled = new Object({validado : false});
    this.current = 1;
  }
}

export default angular.module('nixApp.entrega', [uiRouter])
.config(routes).component('entrega', {
  template: require('./entrega.pug'),
  controller: entregaComponent
}).name;
