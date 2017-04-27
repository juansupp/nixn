'use strict';
const angular = require('angular');
/*@ngInject*/
export function bifrostService($http, $hummer) {
  let
    url = '/api/astral',
    entity = '',
    methods = {
      find: find,
      insert: insert,
      all: all,
      update : update,
      paginate : paginate
    };
  /*ACTIONS*/
  function update (valObj,whereObj){
    let
      where = whereObj ? $hummer.objectToSentence(whereObj) : '1=1',
      val = $hummer.objectToSentence(valObj,','),
      dataObject = {
        where: where,
        val: val,
        entity: entity
      };
    return $http.put(url + '/', dataObject);
  }
  function find(valArray, whereObj) {
      let
        where = whereObj ? $hummer.objectToSentence(whereObj) : '1=1',
        val = $hummer.arrayToSentence(valArray),
        dataObject = {
          where: where,
          val: val,
          entity: entity
        };
      return $http.post(url + '/find', dataObject);
  }

  function paginate(whereObj,page,numPage,valArray = '*'){
    let
      where = whereObj ? $hummer.objectToSentence(whereObj) : '1=1',
      val = valArray ===  '*' ? valArray : $hummer.arrayToSentence(valArray),
      dataObject = {
        where: where,
        val: val,
        entity: entity,
        page : page,
        numb : numPage
      };
    return $http.post(url + '/pagination',dataObject)
  }

  function all(whereArray) {
      let
        where = whereArray ? $hummer.objectToSentence(whereArray) : '1=1';
      return $http.post(url + '/find', {
        where: where,
        entity: entity
      });
  }

  function insert(val,custom) {

    //Si es una inserción personalizada
    if(custom){
      //divide el objeto ingresado en valores y llaves
      let result  = $hummer.sliceObjectToArrays(val);
      //Construcción de cutom
      custom = `(${result.keys.toString()})`;
      //Construcción de _val
      val = result.values;
    }

    let
      _val = $hummer.returnQuotes(val);
    return $http.post(url, {
      val: _val,
      custom : custom,
      entity: entity
    });
  }
  /*PRIVATE FUNCTIONS */



  /*PUBLIC FUNCTIONS */
  function base (_entity) {
    entity = _entity;
    return methods;
  }

  function especificacion (_entity ='especificacion'){
    entity = _entity;
    return methods;
  }
  function usuario(_entity = 'usuario') {
    entity = _entity
    return methods;
  }

  function cliente(_entity = 'cliente') {
    entity = _entity;
    return methods;
  }

  function activo(_entity='activo') {
    entity = _entity
    return methods;
  }

  function area(_entity ='area') {
    entity = _entity;
    return methods;
  }

  function ticket(_entity = 'ticket'){
    entity = _entity
    return methods;
  }

  function documentacion(_entity = 'documentacion'){
    entity = _entity;
    return methods;
  }

  function imagen (_entity='imagen'){
    entity = _entity;
    return methods;
  }

  function respuesta (_entity = 'respuesta') {
    entity = _entity;
    return methods;
  }

  function pregunta (_entity='pregunta'){
    entity =_entity;
    return methods;
  }
  function encuesta (_entity='encuesta') {
    entity = _entity;
    return methods;
  }
  function tipoActivo(_entity='tipo_activo'){
    entity = _entity;
    return methods;
  }
  function car(_entity='caracteristica'){
    entity = _entity;
    return methods;
  }
  function carValor(_entity='caracteristica_valor'){
    entity = _entity;
    return methods;
  }
  function carActivo(_entity='caracteristica_activo'){
    entity =_entity;
    return methods;
  }

  function modelo(_entity='modelo') {
    entity = _entity
    return methods;
  }

  function marca(_entity='marca'){
    entity =_entity;
    return methods;
  }

  function servicio(_entity = 'servicio'){
    entity = _entity;
    return methods;
  }

  this.base =  base;
  this.carActivo = carActivo;
  this.carValor = carValor;
  this.car = car;
  this.tipoActivo = tipoActivo
  this.encuesta = encuesta;
  this.respuesta = respuesta;
  this.pregunta = pregunta;
  this.imagen = imagen;
  this.documentacion = documentacion;
  this.ticket = ticket;
  this.area = area;
  this.usuario = usuario;
  this.cliente = cliente;
  this.activo = activo;
  this.marca = marca;
  this.modelo = modelo;
  this.servicio = servicio;
}

export default angular.module('nixApp.bifrost', [])
  .service('$bi', bifrostService)
  .name;
