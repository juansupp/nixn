'use strict';

const angular = require('angular');
const _ = require('lodash');

function nixCliente($nxData) {
	//
  function link(scope) {
		//
    function loadAreas() {
			console.log('LoadAreas');
      _.defer(() => {
        if(scope.modelCliente) scope.modelCliente = scope.model.cliente;
        scope.nxData.area.w = {fk_id_cliente: scope.model.cliente};
      });
    }
		//
    function loadContactos() {
			console.log('LoadContacto');
			_.defer(() => {
				if(scope.full) {
					scope.nxData.contacto.w = { 
						fk_id_area: scope.model.area
					};
				}
				//
				if(scope.modelArea) scope.modelArea = scope.model.area;
			});
		}
		//
		function selectContacto() {
			_.defer(() => {
				console.log(scope.modelContacto)
				if(scope.modelContacto) {
					
					scope.modelContacto = scope.model.contacto; 
				}
			});
		}
		//
		scope.selectContacto = selectContacto;
		scope.nxData = $nxData;
		scope.loadAreas = loadAreas;
		scope.loadContactos = loadContactos;
	}



	return {
		restrict: 'EA',
		template: require('./nixCliente.pug'),
		link: link,
		scope: {
			nxFrm: '=',
			full: '@',
			modelCliente: '=',
			modelArea: '=',
			modelContacto: '='
		}
	};
}

export default 
    angular.module('nixApp.nixCliente', [])
    .directive('nixCliente', nixCliente)
    .name;
