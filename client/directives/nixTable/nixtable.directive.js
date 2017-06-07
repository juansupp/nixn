'use strict';

const angular = require('angular');

function nixTable($bi) {
  //
  function link(scope) {
    //
    function init() {
      //Pagina actual empieza en 1
      scope.current = 1;
      //Busqueda principal
      scope.search(scope.filter, 1);
      //Modelo para la tabla obligatorio
      scope.selected = [];
    }
    // return true = visible, false = hidden
    function evalueExist(col) {
      //Por defecto el retorno es false (No existe a columna)
      let response = false;
      //
      for(let i = 0; i < scope.col.length; i++) {
        //
        if(col === scope.col[i].name) {
          //Al estar dentro de la lista de hidden se retorna false
          response = true;
          //Rompe el ciclo una vez encontrado el hidden
          break;
        }
      }
      return response;
    }
    //Convierte cada valor de la fila en objeto(aún màs complejo) para renderizar
    function humanizarColumnas(list) {
      let listHuman = [];
      //Se recorre cada una de las filas de la consulta
      list.forEach(item => {
        //
        let columnHuman = [];
        //se recorre cada una de las columnas de la fila
        for(let key in item) {
          //variable temporal obj para guardar los nuevos datos
          let obj = {
            //El valor de la columna
            value: item[key],
            //El nombre de la columna (DB)
            key: key,
            //Si es visible o no
            visible: evalueExist(key)
          };
          columnHuman.push(obj);
          //Se humaniza el objeto
        }
        listHuman.push(columnHuman);
      });
      return listHuman;
    }
    //
    scope.search = (filter, page) => {
      if(!filter.length > 0) filter = {1: 1};
      scope.currenTotal(filter);
      $bi.base(scope.entity)
        .paginate(filter, page - 1, 10)
        .then(response => {
          //console.log(response);
          console.log(response.data);
          scope.result = humanizarColumnas(response.data);
        });
    };
    //
    scope.currenTotal = filter => {
      $bi.base(scope.entity)
        .find([`count(id_${scope.entity}) total`], filter)
        .then(response => scope.totalResults = response.data[0].total);
    };

    init();
  }

  return {
    template: require('./nixTable.pug'),
    restrict: 'EA',
    link: link,
    scope: {
      col: '=',
      filter: '=',
      actions: '=',
      entity: '@'
    }
  };
}

export default angular
  .module('nixApp.nixTable', [])
  .directive('nixTable', nixTable)
  .name;
