//Librerias a usar
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './entrega.routes';

export class entregaComponent {
  /*@ngInject*/
  constructor($bi,$scope,$select,$pop,$dialog,$nxData,$q) {
    this.$scope = $scope;
    this.$bi = $bi;
    this.$select = $select;
    this.$pop = $pop;
    this.$dialog = $dialog;
    this.nxData = $nxData;
    this.$q = $q;
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
    //Se consulta sub entrega para traer las sub entregas ligadas
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
    return this.$bi.entrega().insert({n_entrega : this.model.nOrden })
      .then(response => response = response.data[0])
  }

  attachEntrega(idSubEntrega,idEntrega){
    let valObj = {
      fk_id_entrega : idEntrega,
      estado : 1 // ahora esta afuera de bodega
    }, whereObj = {
      id_sub_entrega : idSubEntrega
    };
    return this.$bi.subEntrega().update(valObj,whereObj)
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
  entregar (ev) {
    this.police();
    //Primero se inserta la orden
    this.insertOrden().then(orden => {
      //Luego se recorre cada una de las sub_entregas (activo)
      this.activosEntrega.forEach(activo => {
        //Se liga la sub_entrega con entrega null a la recien ingresada
        this.attachEntrega(activo.id_sub_entrega,orden); //async
        //Se liga el contacto seleccionado con el activo seleccionado
        this.attachContacto(activo.id_activo,activo.contacto); //async
      });
      this.$pop.show('Entrega registrada satisfactoriamente');
    });
  }

  showAttach(ev,activo) {
    //Globaliza el activo para usarlo en contactos
    this.activo = activo;
    let
      ac = activo,
      dialogAttach =
        this.$dialog.custom(ev,() => this, require('./attachContacto.pug'));

    dialogAttach.then(attach => {

      activo["contacto"] = attach[0];
      activo["notas"] = attach[1];
      this.$pop.show('Usuario adjuntando satisfactoriamente');
    });
  }

  getContacto(){
    if(!this.attach.idContacto) {
      return this.$bi.contacto()
         .insert([this.attach.contacto,this.attach.correo,this.model.area])
         .then(response => response.data[0].id_contacto);
    } else {
       let deferred = this.$q.defer();
       deferred.resolve( this.attach.idContacto)
       return deferred.promise;
     }
  }

  adjuntarContacto() {
    //Inserta o devuelve el contacto seleccionado
    this.getContacto().then(idContacto => {
      //Pasamos el contacto por parametro callback a showAttach
      this.$dialog.hide([idContacto,this.attach.notas])
    })
  }


  loadAreas () {
    //Esperamos la digestión de angular
    _.defer(() => {
      //Si se ha seleccionado cliente
      if(this.model.cliente.length > 0)
        //Se agrega el filtro para buscar todas las areas del cliente seleccionado
        this.nxData.area.w = { fk_id_cliente : this.model.cliente };

    });
  }
  loadContactos(){
    //Esperamos la digestión de angular
    _.defer(() => {
      //Si se ha seleccionado area
      if(this.model.area.length > 0)
        //Cargamos todos los contactos
        this.nxData.contacto.w = { fk_id_area : this.model.area };
    });
  }
  /* devuelve true si ha campo invalido*/
  police(){
    //variable agente// por defecto no hay nada invalido
    let agent = false;
    //Recorremos cada uno de los activos
    this.activosEntrega.forEach(activo => {
      // SI no hay contacto adjunto al activo el agente lo retornará
      if(!activo.contacto) agent  = true;
    });
    return agent;
  }

  undoActivo(ev,activo){
    //Confirmación
    this.$dialog
      .confirm(ev,'Confirmación','¿Seguro que desea pasar a alistamiento este equipo nuevamente? ')
      .then(response => {
        //Actualiza el activo y lo pasa al ciclo 0 en bodega
        this.$bi.activo().update({ciclo : '0' },{id_activo : activo.id_activo})
        //Elimina la sub entrega creada
        this.$bi.subEntrega().delete({fk_id_activo:  activo.id_activo});
        //Elimina el ticket creado en el alistamiento
        this.$bi.ticket().delete({fk_id_activo : activo.id_activo, estado : 'N'})
    });
  }

  showDatos (ev,activo) {
    //Globaliza el activo
    this.activo = activo;
    //Abrir el dialogo y mostrar esp, soft y datos
    this.$dialog.custom(ev,() => this,require('./datos.pug'));
    //Campos para el dialogo de datos
    this.showCaracteristicas(activo);
    //
    this.showSoftware(activo);
  }

  showSoftware(activo) {
    this.$bi.licencia("full_licencia")
      .all({id_activo :  activo.id_activo})
      .then(software => this.software = software.data);
  }

  showCaracteristicas(activo) {
    //Busca todas las caracteristicas del activo en parametro
    this.$bi.car("full_caracteristica")
      .all({id_activo : activo.id_activo})
      .then(caracteristicas => {
        //se crea nueva variable scope para agregar las caracteristicas
        this.caracteristicas = new Array();
        //Recorre cada una de las caracteristicas
        caracteristicas.data.forEach(car => {
          //Agrega objeto personalizado al array
          // d = disaply, v = value
          this.caracteristicas.push({d : car._caracteristica, v: car._valor })
        });
    });
  }

  pasarOrden(activo,rollBack=false){
    //Se agrega el activo seleccionado a la lista de entrega
    //Si no hay rollback
    if(!rollBack) {
      this.activosEntrega.push(activo);
      activo.disabled = true;
    }
    //se elimina el activo seleccionado de la lista de activos alistados
    //Si hay rollback
    else {
      _.remove(this.activosEntrega, {id_activo: activo.id_activo});
      activo.disabled = false;
    }
  }
  /**/
  $onInit(){
    //filtros personalizados para cliente y area
    this.clientFilter = new Array();
    //lista de areas de el cliente seleccionado
    this.areas = new Array();
    //lista de contactos segun el cliente que se eliga
    this.contactos = new Array();
    //lista de activos en tabla de alistados
    this.activosAlistados = new Array();
    //lista de ativos en la tabla de entrega
    this.activosEntrega = new Array();
    //filtro global para la paginación
    //ciclo 1 = los activos alistados
    //estado 0 = sub_entrega en proceso
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

export default angular.module('nixApp.entrega', [uiRouter])
.config(routes).component('entrega', {
  template: require('./entrega.pug'),
  controller: entregaComponent
}).name;
