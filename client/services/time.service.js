'use strict';
const angular = require('angular');

/*@ngInject*/
export function timeService(moment) {

  function date (_date,format='YYYY[-]MM[-]D',dayMore=0){
    return moment(_date).add(dayMore,'day').format(format);
  }
  function time(_time,format='HH:mm:ss') {
    return moment.utc(_time).format(format);
  }
  function humanizar(loopData, _fecha = 'fecha', _hora = 'hora') {
    //
    loopData.forEach(item => {
      //
      let fecha = item[_fecha];
      //
      let hora = item[_hora];

      item[_fecha] = date(fecha, 'LL', 1);
      item[_hora] = time(hora);
    });

    return loopData;
  }


  this.humanizar = humanizar;
  this.date = date;
  this.time = time;
}

export default angular.module('nixApp.time', [])
  .service('$time', timeService)
  .name;
