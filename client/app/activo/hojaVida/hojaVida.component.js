//Librerias a usar
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './hojaVida.routes';

export class hojaVidaComponent {
  /*@ngInject*/
  constructor($bi, $scope, $select, $pop, $dialog, $nxData, $time) {
    this.$scope = $scope;
    this.$bi = $bi;
    this.$select = $select;
    this.$pop = $pop;
    this.$dialog = $dialog;
    this.nxData = $nxData;
    this.$time = $time;
  } 

  seeSucesos(activo) {
    //Se hace reset a lista de historiales
    this.historial = [];
    //se globaliza el activo
    //this.activo = activo;
    this.$bi
      .hojaVida()
      .all({fk_id_activo: activo.id_activo})
      .then(response => {
        this.historial = this.$time.humanizar(response.data);
      })
  }

  constructActions() {
    let play = (ev, activo) => this.seeSucesos(activo);
    
    this.actionStruct = [{
      play: play,
      icon: 'history',
      toolTip: 'Ver historial de sucesos'
    }];
  }
  /**/
  $onInit() {
    //
    this.constructActions();
    //Historial del activo seleccionado
    this.historial = [];
    //filtro global para la paginación
    //ciclo 1 = los activos alistados, ciclo 0 = activos en bodega
    //estado 0 = sub_entrega en proceso, estado 1 = sub_entrega entregada
    this.filter = {ciclo: 1, estado: 0};
  }
}

export default angular
  .module('nixApp.hojaVida', [uiRouter])
  .config(routes)
  .component('hojaVida', {
    template: require('./hojaVida.pug'),
    controller: hojaVidaComponent
  }).name;
