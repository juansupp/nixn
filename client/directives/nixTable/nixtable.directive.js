'use strict';

const angular = require('angular');

function nixTable($bi) {

  function link(scope) {

    function init() {
      //Pagina actual empieza en 1
      scope.current = 1;
      //Busqueda principal
      scope.search(scope.filters, 1);
      //Modelo para la tabla obligatorio
      scope.selected = [];
    }
    //
    scope.search = (filter, page) =>  {
      scope.currenTotal(filter);
      $bi.base(scope.entity)
        .paginate(filter, page - 1, 10)
        .then(response => scope.result = response.data);
    }
    //
    scope.currenTotal = filter => {
      this.$bi.usuario()
        .find([`count(id_${scope.entity}) total`], filter)
        .then(response => scope.totalTickets = response.data[0].total);
    }
    






    init();
  }

  return{
    restrict: 'EA',
    link: link,
    scope: {
      title: '@',
      struct: '=',
      filter: '=',
      entity: '@'
    }
  };
}

export default angular
  .module('nixApp.nixTable', [])
  .directive('nixTable', nixTable)
  .name;
