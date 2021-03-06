'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');

import route from './adminUsuario.route';
export class adminUsuarioComponent {
  /*@ngInject*/
  constructor($bi,$hummer,$pop) {
    this.$bi = $bi;
    this.$hummer = $hummer;
    this.$pop = $pop;
  }

  allUsers(filter,page) {
    this.currenTotal(filter);
    this.$bi.usuario()
      .paginate(filter,page-1,2)
      .then(response => this.usuarios = response.data);
  }

  currenTotal (filter) {
    this.$bi.usuario()
      .find(['count(id_usuario) total'],filter)
      .then(response => this.totalTickets = response.data[0].total);
  }


  /*updateUsuario(frm) {
    //Se convierte el formulario a modelo para poder extraer los valores
    let model = this.$hummer.castFormToModel(frm);
    if(model.contrasena === model._contrasena){
      let
      valObj = {
        apellido : model.apellido,
        nombre : model.nombre,
        correo : model.correo,
        telefono : model.telefono,
        rol : model.rol,
        contrasena : model.contrasena
      },
      whereObj = {
        id_usuario : this.selected.id_usuario
      };

      this.$bi.usuario().update(valObj,whereObj)
        .then(()=>this.$pop.show('Usuario actualizado satisfactoriamente'));
    }else {
      this.$pop.show('Las credenciales son incorrectas');
    }


  }*/

  $onInit(){
    this.current = 1;

    this.allUsers({"1":"1"},1);
    // ARRAY  => OBJECTS !!
    this.selected = new Array();
    
  }
}

export default
  angular
  .module('nixApp.adminUsuario', [])
  .config(route)
  .component('adminUsuario', {
    template: require('./adminUsuario.pug'),
    controller: adminUsuarioComponent
  })
  .name;
