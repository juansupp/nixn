'use strict'
const angular = require('angular');
/*@ngInject*/

export function dialogService($mdDialog) {

  function confirm(ev, title, text) {
    let confirm =
      $mdDialog.confirm()
      .title(title)
      .textContent(text)
      .ariaLabel('Dialogo')
      .targetEvent(ev)
      .ok('Aceptar')
      .cancel('Cancelar');

    return $mdDialog.show(confirm);
  }

  function custom (ev,controller,template) {
    console.dir(controller);
    let customObj = {
      controller: controller,
      controllerAs : '$ctrl',
      template: template,
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }
    return $mdDialog.show(customObj);
  }

  function hide(param=''){
    $mdDialog.hide(param);
  }

  this.hide = hide;
  this.custom = custom;
  this.confirm = confirm;
}

export default
angular.module('nixApp.dialog', [])
  .service('$dialog', dialogService)
  .name;
