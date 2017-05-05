'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
import routes from './alistarActivo.routes';

export class AlistarActivoComponent {
  /*@ngInject*/
  constructor($bi,$scope,$select,$pop,$dialog) {
    this.$scope = $scope;
    this.$bi = $bi;
    this.$select = $select;
    this.$pop = $pop;
    this.$dialog = $dialog;
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

  alistar (ev) {
    //Se acorta variable (object)
    let activo = this.activo;
    this.$dialog
      .confirm(ev,'Confirmación','¿Estás seguro que deseas pasar a entrega este equipo?')
      .then(() => {
        //Pasa de ciclo 0  a 1 === EN LISTA DE ENTREGA
        this.$bi.activo().update({ciclo : "1"},{id_activo : activo.id_activo});
        this.$bi.subEntrega()
          .insert({fk_id_activo : activo.id_activo},true)
          .then(subEntrega => {
            //Si hubo inserción de software
            if(this.softwareSelect.length > 0) {
              let idSubEntrega = subEntrega.data[0].id_sub_entrega;
                //Licencia si se ingresaron softwares.
              this.$bi.licencia()
                .insert({fk_id_sub_entrega : idSubEntrega})
                .then(licencia => {
                  this.$pop.show('Activo listo para entrega');
                });
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
                      }
                    });
                  });
              });
            });
        }
      });
  }

  showPlacas(activo){
    console.log(activo)
    this.model = {
      inventario : activo.inventario,
      seguridad : activo.seguridad
    }

  }

  verificar(activo){
    this.activo = activo;
    this.showPlacas(activo);
    this.showCaracteristicas(activo);
  }
  /**/
  $onInit(){
    this.softwareSelect = new Array();
    this.filter = new Object({ciclo : '0'});
    this.allActivos(this.filter,1);
    this.buscar = "";
    this.texto = new Object({
      activoRevisado : 'Verifica el activo para continuar'
    })
    this.disabled = new Object({validado : false});
    this.current = 1;
    this.softwareList = new Array();

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
