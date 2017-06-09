'use strict';

const angular = require('angular');
const _ = require('lodash');

function nixCliente($nxData) {
	//
  function link(scope) {
		init();
		//
    function loadAreas() {
      _.defer(() => {
				scope.modelCliente = scope.model.cliente;
        scope.nxData.area.w = {fk_id_cliente: scope.model.cliente};
      });
    }
		//
    function loadContactos() {
			_.defer(() => {
				if(scope.full) {
					scope.nxData.contacto.w = { 
						fk_id_area: scope.model.area
					};
				}
				//
				scope.modelArea = scope.model.area;
			});
		}
		//
		function selectContacto() {
			_.defer(() => scope.modelContacto = scope.model.contacto);
		}
		//
		function init() {
			scope.modelCliente = '';
			scope.modelArea = '';
			scope.modelContacto = '';
		}
		//
		scope.selectContacto = selectContacto;
		scope.nxData = $nxData;
		scope.loadAreas = loadAreas;
		scope.loadContactos = loadContactos;
	}
	//
	return {
		restrict: 'EA',
		template: require('./nixCliente.pug'),
		link: link,
		scope: {
			nxFrm: '=',
			full: '@',
			modelCliente: '=?',
			modelArea: '=?',
			modelContacto: '=?'
		}
	};
}

export default 
    angular.module('nixApp.nixCliente', [])
    .directive('nixCliente', nixCliente)
    .name;
