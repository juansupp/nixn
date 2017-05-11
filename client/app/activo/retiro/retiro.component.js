//Librerias a usar
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './retiro.routes';

export class retiroComponent {
  /*@ngInject*/
  constructor($bi,$scope,$select,$pop,$dialog,$nxData) {
    this.$scope = $scope;
    this.$bi = $bi;
    this.$select = $select;
    this.$pop = $pop;
    this.$dialog = $dialog;
    this.nxData = $nxData;
  }

  transformChip(chip) {
    // If it is an object, it's already a known chip
    if (angular.isObject(chip)) {
      console.log(chip)
      return chip;
    }
    // Otherwise, create a new one
    return { _software: chip}
  }


  buscarActivos(){
    let value = `'%${this.buscar}%'`;
    if(this.buscar.length >= 4) {
      this.filter = {
        _marca : value,
        _modelo  :value,
        _tipo_activo :value,
        serial : value,
        inventario :value,
        seguridad : value,
      };
      console.log(this.filter)
      this.allActivos(this.filter,this.current);
    }
  }

  currenTotal (filter) {
    //Se consulta sub retiro para traer las sub retiros ligadas
    this.$bi.activo('full_sub_retiro')
      .find(['count(id_activo) total'],filter)
      .then(response => this.totalActivos = response.data[0].total);
  }

  allActivos(filter,page) {
    this.currenTotal(filter);
    this.$bi.activo('full_sub_retiro')
      .paginate(filter,page-1,10)
      .then(response =>  this.activosAlistados = response.data);
  }

  insertOrden(){
    return this.$bi.retiro().insert({n_retiro : this.model.nOrden })
      .then(response => response = response.data[0])
  }

  attachretiro(idSubretiro,idretiro){
    let valObj = {
      fk_id_retiro : idretiro,
      estado : 1 // ahora esta afuera de bodega
    }, whereObj = {
      id_sub_retiro : idSubretiro
    };
    return this.$bi.subretiro().update(valObj,whereObj)
  }

  attachContacto(idActivo,idContacto){
    let valObj = {
      ciclo : 2, //- segundo ciclo del activo, está afuera
      fk_id_contacto : idContacto
    }, whereObj = {
      id_activo : idActivo
    };
    return this.$bi.activo().update(valObj,whereObj)
  }
  //!!!!Nucleo nix
  retiror (ev) {
    //Primero se inserta la orden
    this.insertOrden().then(orden => {
      console.log(orden)
      //Luego se recorre cada una de las sub_retiros (activo)
      this.activosretiro.forEach(activo => {
        //Se liga la sub_retiro con retiro null a la recien ingresada
        this.attachretiro(activo.id_sub_retiro,orden); //async
        //Se liga el contacto seleccionado con el activo seleccionado
        this.attachContacto(activo.id_activo,activo.contacto); //async
      });
      this.$pop.show('retiro registrada satisfactoriamente');
    });
  }

  loadContactos(){
    //Esperamos la digestión de angular
    _.defer(() => {
      //Si se ha seleccionado cliente
      if(this.model.cliente.length > 0)
        //Cargamos todos los contactos
        this.$bi.contacto('full_contacto')
          .all({fk_id_cliente : this.model.cliente})
          .then(response => this.contactos = response.data)
    });

  }
  /* devuelve true si ha campo invalido*/
  police(){
    //Recorremos cada uno de los activos
    this.activosretiro.forEach(activo => {
      //if(activo.contacto)
    });
  }

  pasarOrden(activo,rollBack=false){
    //Se agrega el activo seleccionado a la lista de retiro
    //Si no hay rollback
    if(!rollBack) this.activosretiro.push(activo);
    //se elimina el activo seleccionado de la lista de activos alistados
    //Si hay rollback
    else _.remove(this.activosretiro, {id_activo: activo.id_activo});
  }
  /**/
  $onInit(){
    //lista de areas de el cliente seleccionado
    this.areas = new Array();
    //lista de contactos segun el cliente que se eliga
    this.contactos = new Array();
    //lista de activos en tabla de alistados
    this.activosAlistados = new Array();
    //lista de ativos en la tabla de retiro
    this.activosretiro = new Array();
    //filtro global para la paginación
    //ciclo 1 = los activos alistados
    //estado 0 = sub_retiro en proceso
    this.filter = new Object({ciclo : 1, estado:0});
    //Busca principalmente todos los activos con ciclo 1
    this.allActivos(this.filter,1);
    //void
    this.buscar = "";
    //Objecto disabled para inputs
    this.disabled = new Object({validado : false});
    //Pagina actual = 1
    this.current = 1;
    //Busqueda de los contactos del cliente seleccionado
  }
}

export default angular.module('nixApp.retiro', [uiRouter])
.config(routes).component('retiro', {
  template: require('./retiro.pug'),
  controller: retiroComponent
}).name;
