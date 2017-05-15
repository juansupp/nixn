'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');

import routes from './addTicket.routes';

export class AddTicketComponent {
  /*@ngInject*/
  constructor($dialog,$imagenix, moment, Upload, $select, $time, $bi, $hummer, $pop, $scope, $cookieStore, $http,$nxData,$q) {
    this.$select = $select;
    this.$bi = $bi;
    this.$hummer = $hummer;
    this.$pop = $pop;
    this.$scope = $scope;
    this.$cookieStore = $cookieStore;
    this.$time = $time;
    this.$http = $http;
    this.$upload = Upload;
    this.$imagenix = $imagenix;
    this.moment = moment;
    this.$dialog = $dialog;
    this.nxData = $nxData;
    this.$q = $q;
  }


  policeActivo(){
    if(this.model.images) {
      if (this.model.images.length <= 0){
        this.$pop.show("El tamaño de las imagenes supera al permitido {MAX: 1MB per image} "); //??de lo contrario se insertan las imagenes
        return false;
      } else {
        return true
      }
    } else {
      return true;
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



  insertTicket(nTicket,fkServicio){
    let
      //Se acorta la variable
      idCreador = (this.$cookieStore.get('user')).id_usuario,
      objTicket = {
        N_Ticket : nTicket,
        estado: "F", // Estado F = pendiente por activo
        cierre : 'X', // Cierre X no se ha cerrado
        fk_id_tecnico : this.model.tecnico,
        fk_id_creador : idCreador,
        fk_id_servicio : fkServicio,
        fk_id_origen : this.model.origen
      };

    return this.$bi.ticket().insert(objTicket,true)
      .then(response => {
        return response.data[0].id_ticket;
      });
  }

  getServicio(){
    if(!this.model.servicio)
     return this.$bi.servicio().insert([this.text.servicio])
       .then(response => {  return response.data[0].id_servicio});
     else{
       let deferred = this.$q.defer();
       deferred.resolve( this.model.servicio.value )
       return deferred.promise;
     }
  }

  insertDocumentacion(fkTicket){
    let
      //Se acorta variable
      nombreCreador = (this.$cookieStore.get('user')).nombre,
      //Se define la fecha con formato especial para guardar en documentacion
      hoy = this.moment().format('YYYY[-]MM[-]D'),
      //Se define la hora con formato especial para guardar en documentacion
      ahora = this.moment().format('h:mm:ss'),
      //
      arrValDocum = [
        hoy,
        ahora,
        this.model.descripcion,
        "II",
        nombreCreador,
        fkTicket
      ];

      return this.$bi.documentacion().insert(arrValDocum)
        .then(response => {
          return response.data[0].id_documentacion;
        })
  }
  //HALF_POST = no es obligatoria su inserción
  insertImagen(fkDocumentacion){
    if(this.model.images)
      return this.$imagenix
        .save(this.model.images, fkDocumentacion);
    else {
      let deferred = this.$q.defer();
      deferred.resolve(0)
      return deferred.promise;
    }

  }

  nuevoTicket(ev,frm) {
    if(this.policeActivo()){
      this.getLastTicket().then(lastTicket => {
        //
        //Titlo del cuadro de confirmacion
          let titulo = `Ticket Nº${lastTicket}`;
          //Texto dentro del dialogo de confirmacion
          let texto = "¿Desea registrar un nuevo ticket?";
        //
        this.$dialog.confirm(ev,titulo, texto).then(()=>{
          this.getServicio().then(servicio => {
            this.insertTicket(lastTicket,servicio).then(ticket => {
              this.insertDocumentacion(ticket).then(documentacion=>{
                this.insertImagen(documentacion)
                  .then(response =>
                    this.$pop.show('Ticket Registrado satisfactoriamente')
                  )
              })
            })
          });
        })
      })
    }




  }

  $onInit() {
    //Se activa el botón de submit por defecto
    this.btnDisabled = false;
    //Objeto de activo sleccionado
    this.activoSeleccionado = new Object();
  }
}

export default angular.module('nixApp.addTicket', [uiRouter]).config(routes).component('addTicket', {
  template: require('./addTicket.pug'),
  controller: AddTicketComponent
}).name;
/*this.$upload.upload({
    url: 'api/astral/imagen',
    method: 'POST',
    //data: data, // Any data needed to be submitted along with the files
    file: this.model.images[0]
  });*/
