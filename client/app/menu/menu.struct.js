'use strict'

exports = module.exports = [{
  title: 'Ticket',
  items: [{
    allow : [1,2,5],
    icon: 'add',
    state: 'm.addTicket',
    title: 'Agregar'
  }, {
    allow : [1,2,3,4,5],
    icon: 'content_paste',
    state: 'm.adminTicket',
    title: 'Administrar'
  },{
    allow : [1,2,3],
    icon: 'content_paste',
    state: 'm.assignActivo',
    title: 'Asignar activo'
  }]
}, {
  title: 'Clientes',
  items: [{
    allow : [1,2,5],
    icon: 'add',
    state: 'm.addCliente',
    title: 'Agregar'
  },{
    allow : [1,2,5],
    icon: 'supervisor_account',
    state: 'm.adminCliente',
    title: 'Administrar'
  }]
}, {
  title: 'Usuarios',
  items: [{
    allow : [1,2,5],
    icon: 'add',
    state: 'm.addUsuario',
    title: 'Agregar'
  },{
    allow : [1,2,5],
    icon: 'supervisor_account',
    state: 'm.adminUsuario',
    title: 'Administrar'
  }]
}, {
  title: 'Inventario',
  items: [{
    allow : [1,2,5],
    icon: 'add',
    state: 'm.addActivo',
    title: 'Agregar'
  },{
    allow : [1,2,3,4,5],
    icon: 'add',
    state: 'm.adminActivo',
    title: 'Inventario general'
  },{
    allow : [1,4],
    icon: 'move_to_inbox',
    state: 'm.alistarActivo',
    title: 'Alistar activo'
  },{
    allow : [1,5],
    icon: 'settings_applications',
    state: 'm.configActivo',
    title: 'Configurar tipos de activos'
  },{
    allow : [1,2],
    icon: 'assignment',
    state: 'm.entrega',
    title: 'Orden de entrega'
  },{
    allow : [1,2],
    icon: 'assignment',
    state: 'm.retiro',
    title: 'Orden de retiro'
  }/*,{
    icon: 'description',
    state: 'm.hojaVida',
    title: 'Hoja de vida'
  }*/]
}]
