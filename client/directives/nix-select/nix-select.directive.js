'use strict';
const angular = require('angular');


function nixSelect ($bi) {
  //
  function link (scope,element,attrs) {
    //
    function loadData() {
      let
          data = scope.nxData,
          where =  data.w ? data.w :  {1:'1'}
      //
      $bi
        .base(data.t)
        .find(data.v,where)
        .then(response => {
          let items = new Array();
          response
              .data
              .forEach(base =>
                  items.push({
                      value : base[data.v[0]],
                      display :  base[data.v[1]]
                  })
              );
          scope.nxOptions = items;
      });
    }

    //Cada vez que en el controlador invocado se modifique la variable
    scope.$watch('nxData', data =>{
      console.log(scope.waitForWhere);
      if(data){
        if(scope.waitForWhere){
          if(data.w){
            loadData();
          }
        }
        else{
          loadData(); // => si no espera where se carga de una vez
        }
      }

    },() => {});

  }
    return {
      template: require('./nix-select.pug'),
      restrict: 'EA',
      require : 'ngModel',
      scope : {
        waitForWhere : '@',
        ngModel : '=',
        ngChange : '&',
        label : '@',
        nxData : '=',
        required : '@',
        name : '=',
        frm : '=',
        mdNoUnderline :'@',
        placeholder : '@'
      },
      link : link
    };
}


export default angular.module('nixApp.nix-select', [])
  .directive('nixSelect', nixSelect)
  .name;
