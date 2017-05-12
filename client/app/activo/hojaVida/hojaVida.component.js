//Librerias a usar
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './hojaVida.routes';

export class hojaVidaComponent {
  /*@ngInject*/
  constructor($bi,$scope,$select,$pop,$dialog,$nxData) {
    this.$scope = $scope;
    this.$bi = $bi;
    this.$select = $select;
    this.$pop = $pop;
    this.$dialog = $dialog;
    this.nxData = $nxData;
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
      this.allActivos(this.filter,this.current);
    }
  }

  currenTotal (filter) {
    //Se consulta sub hojaVida para traer las sub hojaVidas ligadas
    this.$bi.activo('full_sub_entrega')
      .find(['count(id_activo) total'],filter)
      .then(response => this.totalActivos = response.data[0].total);
  }

  allActivos(filter,page) {
    this.currenTotal(filter);
    this.$bi.activo('full_sub_entrega')
      .paginate(filter,page-1,10)
      .then(response =>  this.activosAlistados = response.data);
  }

  insertOrden(){
    return this.$bi.hojaVida().insert({n_hojaVida : this.model.nOrden })
      .then(response => response = response.data[0])
  }

  attachhojaVida(idSubhojaVida,idhojaVida){
    let valObj = {
      fk_id_hojaVida : idhojaVida,
      estado : 1 // ahora esta afuera de bodega
    }, whereObj = {
      id_sub_entrega : idSubhojaVida
    };
    return this.$bi.subhojaVida().update(valObj,whereObj)
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

  retirar(ev) {
    //Primero se inserta la orden
    this.insertOrden().then(orden => {
      console.log(orden)
      //Luego se recorre cada una de las sub_entregas (activo)
      this.activoshojaVida.forEach(activo => {
        //Se liga la sub_entrega con hojaVida null a la recien ingresada
        this.attachhojaVida(activo.id_sub_entrega,orden); //async
        //Se liga el contacto seleccionado con el activo seleccionado
        this.attachContacto(activo.id_activo,activo.contacto); //async
      });
      this.$pop.show('hojaVida registrada satisfactoriamente');
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

  pasarOrden(activo,rollBack=false){
    //Se agrega el activo seleccionado a la lista de hojaVida
    //Si no hay rollback
    if(!rollBack){
      this.activoshojaVida.push(activo);
      activo.disabled = true;
    }
    //se elimina el activo seleccionado de la lista de activos alistados
    //Si hay rollback
    else {
      _.remove(this.activoshojaVida, {id_activo: activo.id_activo});
      activo.disabled = false;
    }
  }
  /**/
  $onInit(){
    //lista de areas de el cliente seleccionado
    this.areas = new Array();
    //lista de contactos segun el cliente que se eliga
    this.contactos = new Array();
    //lista de activos en tabla de alistados
    this.activosAlistados = new Array();
    //lista de ativos en la tabla de hojaVida
    this.activoshojaVida = new Array();
    //filtro global para la paginación
    //ciclo 1 = los activos alistados, ciclo 0 = activos en bodega
    //estado 0 = sub_entrega en proceso, estado 1 = sub_entrega entregada
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

export default angular.module('nixApp.hojaVida', [uiRouter])
.config(routes).component('hojaVida', {
  template: require('./hojaVida.pug'),
  controller: hojaVidaComponent
}).name;
