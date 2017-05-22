'use strict';

const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './addCliente.routes';

export class AddClienteComponent {
  /*@ngInject*/
  constructor($select, $bi, $hummer, $pop, $state) {
    this.$bi = $bi;
    this.$select = $select;
    this.$hummer = $hummer;
    this.$pop = $pop;
    this.$state = $state;
  }

  end(){
    this.$pop.show('Cliente registrado satisfactoriamente');
    this.model = new Object();
    this.btnDisabled = false;  
  }

  nuevoCliente() {
    this.btnDisabled = true;
    this.insertCliente().then(cliente => {
      this.insertArea(cliente).then(area => {
        this.insertContacto(area).then(() => {

        });
      })

    });

  }


  insertCliente() {
    let arrVal = [
      this.model.cliente,
      this.model.sede,
      this.model.direccion,
      this.model.telefono
    ];
    return this.$bi.cliente()
      .insert(arrVal)
      .then(inserted =>   inserted.data[0].id_cliente);
  }
  insertArea (cliente) {
    return this.$bi.area()
      .insert([this.model.area,cliente])
      .then(inserted =>  inserted.data[0].id_area);
  }
  insertContacto(area){
    return this.$bi.contacto()
      .insert([this.model.contacto,this.model.correo,area])
  }



  $onInit(){
    this.btnDisabled = false;

  }
}

export default angular.module('nixApp.addCliente', [uiRouter])
  .config(routes)
  .component('addCliente', {
    template: require('./addCliente.pug'),
    controller: AddClienteComponent
  })
  .name
