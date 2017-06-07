'use strict';
const angular = require('angular');
/*@ngInject*/
export function nixTableService() {

  function columnConstructor() {}
  /**
   * name  = DB NAME 
   * title  = Table column name 
   */
  this.columnConstructor = columnConstructor;
}

export default angular
  .module('nixApp.nixTableService', [])
  .service('$nts')
  .constant('STRUCT', require('./nixTable.struct'))
  .name;
