'use strict';

const angular = require('angular');
const uiRouter = require('angular-ui-router');

import route from './addSoftware.route';

export class AddSoftware {
  /*@ngInject*/
  constructor($bi, $pop, $hummer, $dialog) {
    this.$bi = $bi;
    this.$pop = $pop;
    this.$hummer = $hummer;
    this.$dialog = $dialog;
  }
  //0= add, 1= update
  softwareAction(ev) {
    !this.action ? this._addSoftware(ev) : this._updateSoftware(ev);
  }
  //
  end() {
    let accion = !this.aciton ? 'Registrado' : 'Actualizado';
    this.$pop.show(`Software ${accion} satisfactoriamente`);
  }
  //
  confirm(ev) {
    let title = 'Confirmación';
    let text = '¿Seguro que desea registrar el software?';
    return this.$dialog.confirm(ev, title, text);
  }
  //
  _addSoftware(ev) {
    this.confirm(ev).then(() => {
      this.$bi
      .software()
      .insert([this.model._software, this.model._descripcion])
      .then(() => this.end());
    });
  }
  //
  _updateSoftware(ev) {
    this.confirm(ev).then(() => {
      this.$bi
      .software()
      .update(this.model)
      .then(() => this.end());
      this.action = 0;
    });
  }
  //Pasa el elemento seleccionado de la tabla al formulario
  _editSoftware(software) {
    //Es necesario normalizar las columnas para que devuelva una fila legible
    this.model = this.$hummer.normalizeColumna(software);
    //Cambia la accion a 1 = update
    this.action = 1;
  }
  //
  _constructTable() {
    let play = (ev, software) => this._editSoftware(software);
    //
    let _actions = [{
      play: play,
      icon: 'edit',
      toolTip: 'Editar'
    }];
    //
    let _col = [{
      name: '_software',
      title: 'Software',
    }];
    //
    let _filter = {};
    //
    this.tableStruct = {
      col: _col,
      actions: _actions,
      filter: _filter
    };
  }

  $onInit() {
    this._constructTable();
    this.model = {};
    //Por defecto la accion es 0 = agregar
    this.action = 0;
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
