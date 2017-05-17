'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
import routes from './alistarActivo.routes';

export class AlistarActivoComponent {
  /*@ngInject*/
  constructor($bi,$scope,$select,$pop,$dialog,$cookieStore) {
    this.$scope = $scope;
    this.$bi = $bi;
    this.$select = $select;
    this.$pop = $pop;
    this.$dialog = $dialog;
    this.$cookieStore = $cookieStore;
  }

  transformChip(chip) {
    // If it is an object, it's already a known chip
    if (angular.isObject(chip)) {
      return chip;
    }
    // Otherwise, create a new one
    return { _software: chip}
  }

  softwareSearch (query) {
      return this.$select.searchFull(query, this.softwareList, '_software');
  };

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
    this.$bi.activo('full_activo')
      .find(['count(id_activo) total'],filter)
      .then(response => this.totalActivos = response.data[0].total);
  }

  allActivos(filter,page) {
    this.currenTotal(filter);
    this.$bi.activo('full_activo')
      .paginate(filter,page-1,1)
      .then(response => this.activosBodega = response.data);
  }

  updateActivo(){
    let objUpdate = new Object({ciclo : "1"});
    // Comparación entre models y originales para ver que modificaciones se hacen
    //Si el inventario cambió, se actualiza
    if(this.original.activo.inventario !==  this.model.inventario);
      objUpdate["inventario"] = this.model.inventario;
    //Si la placa de seguridad cambió , se actualiza
    if(this.original.activo.seguridad !==  this.model.seguridad);
      objUpdate["seguridad"] = this.model.seguridad;

    return this.$bi.activo().update(objUpdate,{id_activo : this.activo.id_activo});
  }

  updateCaracteristicas () {
    //al no tener model las caracteristicas se usa this.caracteristicas
    // SE recorre con for para poder tomar el index en ambas variables array
    for (var i = 0; i < this.caracteristicas.length; i++) {
      //En caso que sea diferente la caracteristica sleccionada a la original
      if(this.caracteristicas[i].selected !== this.original.car[i].selected)
        //Se actualiza erl valor de la caracteristica
        this.$bi
          .carActivo()
          .update(
            {fk_id_caracteristica_valor : this.caracteristicas[i].selected},
            { fk_id_activo : this.activo.id_activo });
    }
  }

  getLastTicket() {
    return this.$bi
      .ticket('lastTicket')
      .find(['N_Ticket'])
      .then(response => {
        return response.data.length > 0 ? response.data[0].N_Ticket + 1: '0001'
      });
  }

  insertTicketAlistamiento(){

    this.getLastTicket().then(nTicket => {

      let objTicket = {
        N_Ticket : nTicket,
        estado : "N", // Estado N= ALISTAMIENTO
        cierre : 'X', // Cierre X no se ha cerrado
        fk_id_tecnico : this.$cookieStore.get('user').id_usuario,
        fk_id_creador : this.$cookieStore.get('user').id_usuario,
        fk_id_servicio : '1', // servicio 1 = alistamiento
        fk_id_origen : '3',
        fk_id_activo : this.activo.id_activo // origen 3 = Interno
      };
      this.$bi.ticket().insert(objTicket,true)
        .then(response => {

          let
            //Se acorta variable
            nombreCreador = (this.$cookieStore.get('user')).nombre,
            //
            fkTicket = response.data[0].id_ticket,
            //
            objDocum = {
              texto : this.model.descripcion,
              tipo : "II",
              persona : nombreCreador,
              fk_id_ticket : fkTicket
            };
            //
            this.$bi.documentacion().insert(objDocum,true)
        })
    });
  }

  alistar (ev) {
    //Se acorta variable (object)
    let activo = this.activo;
    this.$dialog
      .confirm(ev,'Confirmación','¿Estás seguro que deseas pasar a entrega este equipo?')
      .then(() => {
        //Pasa de ciclo 0  a 1 === EN LISTA DE ENTREGA
        this.updateActivo();
        //
        this.updateCaracteristicas();
        //
        this.insertTicketAlistamiento();
        //
        this.$bi.subEntrega()
          .insert({fk_id_activo : activo.id_activo},true)
          .then(subEntrega => {
            //Si hubo inserción de software
            if(this.softwareSelect.length > 0) {
              //Recorre cada una de los software's en el chip
              this.softwareSelect.forEach(software => {
                //acorte de memoria (ADM)
                let idSubEntrega = subEntrega.data[0].id_sub_entrega;
                //Se inserta la licencia con el software y sub_entrega ligado
                this.$bi.licencia()
                  .insert({
                    fk_id_sub_entrega : idSubEntrega,
                    fk_id_software : software.id_software},true);
              });
            } else {
              this.$pop.show('Activo listo para entrega');
            }
          });
      });
  }
  /**/
  loadCaracteristicas(idTipo) {
    return this.$bi
      .car()
      .all({fk_id_tipo_activo : idTipo});
  }

  loadCaracteristicaActivo(idActivo){
      return this.$bi
        .carActivo('full_caracteristica')
        .all({id_activo : idActivo });
  }

  loadCaracteristicaValores(idCar) {
    return this.$bi
      .carValor()
      .all({fk_id_caracteristica : idCar});
  }

  showCaracteristicas(activo) {
    //Se muestran las caracteristicas
    this.showCar = false;
    //Se resetean las caracteristicas
    this.caracteristicas = new Array();
    //Cargamos las caracteristicas del tipo de activo seleccionado
    this.loadCaracteristicas(activo.id_tipo_activo)
      .then(response => {
        //En caso que hayan caracteristicas
        if(response.data.length > 0) {
          //Se muestra el campo de las caracteristicas
          this.showCar = true;
          //Variables de acorte proximo
          let
            caracteristicas  = new Array(),
            valores = new Array();
          //Acorte de variable
          caracteristicas = response.data;
          //
          this.loadCaracteristicaActivo(activo.id_activo)
            .then(responseA => {
              let caractertisticaActivo = responseA.data;
              //Por cada caracteristica del tipo  de activo
              caracteristicas.forEach(c => {
                // c = caracteristica actual
                //Se cargan los valores de la caracteristica
                this.loadCaracteristicaValores(c.id_caracteristica)
                  .then(responseV => {
                    //Se acorta variable  (array)
                    valores = responseV.data;
                    /*CARGA EL VALOR QUE LE CORRESPONDE */
                    caractertisticaActivo.forEach(carActivo => {
                      if(carActivo.id_caracteristica === c.id_caracteristica){
                        //Se crea variable temporal obj para agregar al array
                        let obj = {
                          selected : carActivo.id_caracteristica_valor, // => hace referencia al ngModel
                          values : valores, //=> Se guardan los valores de la caracteristica
                          _caracteristica : c._caracteristica // Referencia para el placeholder
                        }
                        //Finalmente se agregan la caracteristica
                        this.caracteristicas.push(obj)
                        //Se hace copia de caracteristicas para verificar si hay modificaciones o no
                        this.original.car.push({selected : carActivo.id_caracteristica_valor})
                      }
                    });
                  });
              });
            });
        }
      });
  }

  showPlacas(activo){
    //Se asigna al model las placas del activo seleccionado
    this.model = {
      inventario : activo.inventario,
      seguridad : activo.seguridad
    }
  }

  verificar(activo){
    //Se hace copia original del activo
    this.original.activo = activo;
    //Se hace global el activo seleccionado
    this.activo = activo;
    //Muestra las placas en los inputs para poder ser modificadas
    this.showPlacas(activo);
    //Muestra las caracteristicas en los inputs para poder ser modificadas
    this.showCaracteristicas(activo);
  }
  /**/
  $onInit(){
    //Se guardarán los objectos originales para caracteristicas y placas
    //de esta forma se sabrá si es necesario actualizar estas o no
    this.original = new Object({car : []});
    //Se guardan todos los software's seleccionados en el chip
    this.softwareSelect = new Array();
    //filtro para la busqueda, por defecto el ciclo 0 = activos en bodega
    this.filter = new Object({ciclo : '0'});
    //Hace busqueda de todos los activos
    this.allActivos(this.filter,1);
    //Inicio de variable para trabajar en pug
    this.buscar = "";
    //Objetos desabilitados
    this.disabled = new Object({validado : false});
    //Pagina actual de la paginación
    this.current = 1;
    //Se inicia la lista de software en la base de datos
    this.softwareList = new Array();
    //Se buscan todos los software en la base de datos
    this.$bi
      .software()
      .all()
      .then(response => this.softwareList = response.data)
  }
}

export default angular.module('nixApp.alistarActivo', [uiRouter])
  .config(routes)
  .component('alistarActivo', {
    template: require('./alistarActivo.pug'),
    controller: AlistarActivoComponent
  })
  .name;
