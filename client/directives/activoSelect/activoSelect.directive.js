'use strict';
const angular = require('angular');
const _ = require('lodash');

function activoSelect($nxData, $bi) {

  function link(scope, element, attrs) {

    //Funciones privadas
    function init() {
      scope.nxData = $nxData;
      scope.current = 1;
      scope.buscar = '';
      scope.allActivos(scope.current);
      console.log(scope.actionStruct);
    }

    function currentTotal() {
      //Hace consulta de la cantidad de activos que hay por filtro
      $bi.base(scope.entity)
        .find([`count(id_${scope.entity}) total`], scope.filters)
        .then(response => scope.totalActivos = response.data[0].total);
    }

    //Funciones publicas
    scope.buscarActivos = () => {
      //Valor para filtrar
      let value = `'%${scope.buscar}%'`;
      //Filtre cuando sea mayor a 4 digitos la busqueda
      if((scope.buscar).length >= 4) {
        scope.filters = {};
        let filter = {
          _marca: value,
          _modelo: value,
          _tipo_activo: value,
          serial: value,
          inventario: value,
          seguridad: value
        };
        scope.filters = filter;
        scope.allActivos(scope.current);
      }
    };
    //
    scope.allActivos = page => {
      //Total activos para paginar
      currentTotal(scope.filters);
      //Hace una busqueda paginada de entidad libre bifrost.base con filtros dispuestos
      $bi.base(scope.entity)
        .paginate(scope.filters, page - 1, 10)
        .then(response => scope.activos = response.data);
    }
    //Observador de scope filters para ir filtrando
    scope.$watch('filters', data => {
      // => en caso que no sea vacio
      if(data) scope.allActivos(scope.current);
    },() => {});
    //
    init();
  }


  return {
    template: require('./activoSelect.pug'),
    restrict: 'EA',
    link: link,
    scope: {
      actionStruct: '=',
      entity: '@',
      filters: '='
    }
  };
}

export default angular.module('nixApp.activoSelect', [])
  .directive('activoSelect', activoSelect)
  .name;
