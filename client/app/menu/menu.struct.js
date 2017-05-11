'use strict'

exports = module.exports = [{
  title: 'Ticket',
  items: [{
    icon: 'add',
    state: 'm.addTicket',
    title: 'Agregar'
  }, {
    icon: 'content_paste',
    state: 'm.adminTicket',
    title: 'Administrar'
  },{
    icon: 'content_paste',
    state: 'm.assignActivo',
    title: 'Asignar activo'
  },/*, {
    icon: 'bookmark_border',
    state: 'm.requestTicket',
    title: 'Solicitar'
  }*/]
}, {
  title: 'Clientes',
  items: [{
    icon: 'add',
    state: 'm.addCliente',
    title: 'Agregar'
  },{
    icon: 'supervisor_account',
    state: 'm.adminCliente',
    title: 'Administrar'
  }]
}, {
  title: 'Usuarios',
  items: [{
    icon: 'add',
    state: 'm.addUsuario',
    title: 'Agregar'
  },{
    icon: 'supervisor_account',
    state: 'm.adminUsuario',
    title: 'Administrar'
  }]
}, {
  title: 'Inventario',
  items: [{
    icon: 'add',
    state: 'm.addActivo',
    title: 'Agregar'
  },{
    icon: 'move_to_inbox',
    state: 'm.alistarActivo',
    title: 'Alistar activo'
  },{
    icon: 'settings_applications',
    state: 'm.configActivo',
    title: 'Configurar tipos de activos'
  },{
    icon: 'assignment',
    state: 'm.entrega',
    title: 'Orden de entrega'
  },{
    icon: 'description',
    state: 'm.hojaActivo',
    title: 'Hoja de vida'
  }]
}]
