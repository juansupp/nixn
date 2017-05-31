'use strict';

const angular = require('angular');
const _ = require('lodash');

function nixCliente($nxData) {

	function link(scope) {

		function loadAreas() {
      _.defer(() => {
        scope.nxData.area.w = { 
          fk_id_cliente: scope.model.cliente
        };
      });
    }

		function loadContactos() {
			if(scope.full) {
				console.log(scope.full);
				_.defer(() => {
					scope.nxData.contacto.w = { 
						fk_id_area: scope.model.area
					};
				});
			}
		}

		scope.nxData = $nxData;
		scope.loadAreas = loadAreas;
		scope.loadContactos = loadContactos;
	}


	return {
		restrict: 'EA',
		template: require('./nixCliente.pug'),
		link: link,
		scope: {
			ngModel: '=',
			nxFrm: '=',
			full: '@'
		}
	};
}

export default 
    angular.module('nixApp.nixCliente', [])
    .directive('nixCliente', nixCliente)
    .name;
