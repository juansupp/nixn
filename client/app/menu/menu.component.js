'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');

import routes from './menu.routes';

export class MenuComponent {
  /*@ngInject*/
  constructor(STRUCT, $cookieStore, $state, $dialog) {
    this.structMenu = STRUCT;
    this.$cookieStore = $cookieStore;
    this.$state = $state;
    this.$dialog = $dialog;
  }

  allowItems(){
    let rol = this.$cookieStore.get('user');
    //console.log(this.structMenu);
    this.structMenu.forEach(menu => {
      menu.items.forEach(item =>  {
        //console.log(item.allow,rol.id_rol)
        if( item.allow.includes(rol.id_rol) ) item.show = true;
        else item.show = false;
      })
    });
  }

  closeSession(event) {
    let title = '¿Deseas cerrar sesión?',
      text = 'Se perderá el cache y las preferencias hasta la proxima sesión';

    this.$dialog.confirm(event, title, text)
      .then(() => {
        this.$cookieStore.remove('user');
        this.$state.go('login');
      });
  }

  serf(destiny){
    this.$state.go(destiny);
  }

  $onInit() {
    this.allowItems();
    if (!this.$cookieStore.get('user')) this.$state.go('login');
  }
}

export default angular.module('nixApp.menu', [uiRouter])
  .config(routes)
  .component('mimenu', {
    template: require('./menu.pug'),
    controller: MenuComponent
  })
  .constant('STRUCT', require('./menu.struct'))
  .name;
