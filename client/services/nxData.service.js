'use strict';
const angular = require('angular');
/*@ngInject*/
/*NXDATA = SERVICIO  PARA GUARDAR LOS TEMPLATES DE CADA SELECT O AUTO*/

export function nxDataService() {
	function constructNxData (table, value, display,where=false) {
		let data = {
			t: table,
			v : [value,display]
		}

		if(where) data['w'] = where
		return data;
	}
	this.constructNxData = constructNxData;
	this.rol = constructNxData('rol','id_rol','_rol');
	this.modelo = constructNxData('modelo','id_modelo','_modelo');
	this.marca = constructNxData('marca','id_marca','_marca');
	this.tipoActivo = constructNxData('tipo_activo','id_tipo_activo','_tipo_activo');
	this.servicio = constructNxData('servicio','id_servicio','_servicio');
	this.tecnico = constructNxData('full_usuario','id_usuario','_usuario',{_rol: 'Tech' });
	this.origen = constructNxData('origen','id_origen','_origen');
	this.cliente = constructNxData('full_cliente','id_cliente','_cliente');
	this.contacto = constructNxData('contacto','id_contacto','_contacto');
	this.area = constructNxData('area','id_area','_area');
	//this.tipoActivo = constructNxData('tipo_activo','id_tipo_activo','_tipo_activo');
}


export default angular.module('nixApp.nxData',[])
		.service('$nxData',nxDataService)
		.name;
