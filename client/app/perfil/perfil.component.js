'use strict';

const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './perfil.routes';

export class perfilComponent {
  /*@ngInject*/
  constructor($select, $bi, $hummer, $pop, $state,$nxData,$cookieStore) {
    this.$bi = $bi;
    this.$select = $select;
    this.$hummer = $hummer;
    this.$pop = $pop;
    this.$state = $state;
    this.$cookieStore = $cookieStore;
    this.nxData = $nxData;
  }

  end(){
    this.$pop.show('Cliente registrado satisfactoriamente');
    this.model = new Object();
    this.btnDisabled = false;
  }

  nuevoCliente() {
    this.btnDisabled = true;
    this.updateUser().then(() => this.end());
  }


  updateUser() {
    if((this.model.pass === this.model._pass) && this.model.pass !== '') {
      let updateObj = {
        apellido : this.model.apellido,
        nombre : this.model.nombre,
        telefono : this.model.telefono,
        correo : this.model.correo,
        //fk_id_rol : this.model.fk_id_rol,
        pass : this.model.pass
      }, whereObj = {
        id_usuario : this.$cookieStore.get('user').id_usuario
      };

      return this.$bi.usuario()
        .update(updateObj,whereObj)
        .then(() => {
          this.$pop.show('Usuario actualizado satisfactoriamente');
          this.model = new Object();
        });
    } else {
      this.$pop.show('Credenciales incorrectas');
    }
  }

  myUser(){
    return this.$bi.usuario('full_usuario')
      .all({id_usuario : this.$cookieStore.get('user').id_usuario})
      .then(response => {
        this.model = response.data[0]
        this.model._pass = this.model.pass;
      })
  }

  $onInit(){
    this.btnDisabled = false;

    this.myUser();

  }
}

export default angular.module('nixApp.perfil', [uiRouter])
  .config(routes)
  .component('perfil', {
    template: require('./perfil.pug'),
    controller: perfilComponent
  })
  .name
