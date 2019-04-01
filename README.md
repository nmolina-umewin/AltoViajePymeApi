# AltoViajePymeApi

API para la administración el FrontEnd y Backoffice.

### Índice
------------------------------

* [Descargar e instalar][instalar].
* [Correr][correr].
    + [Local][correr_development].
    + [Producción][correr_production].
* [Métodos][metodos].
    + [Backoffice][bakcoffice]
        - [Dashboard][backoffice_dashboard]
    + [Administradores][administrators]
        - [Listar todos][administrators_list]
        - [Obtener por ID][administrators_get]
        - [Alta][administrators_create]
        - [Modificación][administrators_update]
        - [Baja][administrators_delete]
        - [Login][administrators_login]
        - [Recuperar contraseña][administrators_forgot]
        - [Obtener por TOKEN][administrators_reset_token]
        - [Modificación de contraseña][administrators_reset]
    + [Empresas][companies]
        - [Listar todas][companies_list]
        - [Obtener por ID][companies_get]
        - [Alta][companies_create]
        - [Modificación][companies_update]
        - [Baja][companies_delete]
        - [Cargar AV Puntos][companies_wallets_charge]
    + [Transacciones][transactions]
        - [Pagos (Rapipago, Bitex y/o Transferencia bancaria)][transactions_payments]
            + [Listar todas las operaciones][transactions_payments_list]
            + [Obtener operación por ID][transactions_payments_get]
            + [Cambiar estado/situación de una operación][transactions_payments_update]
        - [Recargas de SUBE][transactions_recharges]
            + [Listar todas las recargas][transactions_recharges_list]
            + [Obtener recarga por ID][transactions_recharges_get]
            + [Cambiar estado/situación de una recarga][transactions_recharges_update]
    + [Ordenes de pago][recharge_payment_orders]
        - [Listar todas las ordenes][recharge_payment_orders_list]
        - [Obtener order por ID][recharge_payment_orders_get]
        - [Alta][recharge_payment_orders_create]
        - [Cambiar estado/situación de una order][recharge_payment_orders_update]
    + [Configuraciones][settings]
        - [Listar por clave][settings_list]
        - [Modificación][settings_update]

### Descarga e instalación
------------------------------
```sh
$ git clone https://github.com/xncompany/AltoViajePymeApi.git
$ cd AltoViajePymeApi
$ npm i
```

### Correr
------------------------------
Para usar otro puerto, debe configurar la variable de entorno PORT.

##### Modo *local*
```sh
$ npm run dev
```

##### Modo *producción*
```sh
$ node start
```

### Métodos
------------------------------

```
 GET    /config # Configuración del micro servicio (SOLO VISIBLE EN LOCAL/DESARROLLO)
 GET    /health # Para verificar si el servicio esta corriendo y si esta conectado con la base de datos.

 # Backoficce
 GET    /backoffice/dashboard

 # Administrators
 GET    /administrators
 POST   /administrators
 GET    /administrators/{id_administrator}
 PUT    /administrators/{id_administrator}
 DELETE /administrators/{id_administrator}
 POST   /administrators/login
 POST   /administrators/forgot
 GET    /administrators/reset/{token}
 POST   /administrators/reset
 GET    /administrators/permissions

 # Companies
 GET    /companies
 POST   /companies
 GET    /companies/{id_company}
 PUT    /companies/{id_company}
 DELETE /companies/{id_company}

 # Transactions
 ## Payments
 GET    /transactions/payments
 GET    /transactions/payments/{id_payment}
 PUT    /transactions/payments/{id_payment}
 ## Recharges
 GET    /transactions/recharges
 GET    /transactions/recharges/{id_recharge}
 PUT    /transactions/recharges/{id_recharge}

 # Payments orders
 GET    /recharges/payments/orders
 POST   /recharges/payments/orders
 GET    /recharges/payments/orders/{id_order}
 PUT    /recharges/payments/orders/{id_order}

 # Settings
 GET    /settings
 PUT    /settings/{id_setting}
```

#### Backoffice

### GET /backoffice/dashboard

Obtiene datos necesarios para armar el dashboard del backoffice.

```javascript
{
    "companies":{
        "availablePoints": 8400
    },
    "recharges":{
        "pendingPayments": 1600
    },
    "limits":{
        "guarantee": 120000
    },
    "balance": 118400
}
```

#### Administración

### GET /administrators

Obtiene la lista de los administradores.

Request
```sh
GET /administrators

# PAGINACIÓN (Necesita si o si `page` y `pageSize` para realizar la paginación)
GET /administrators?page=1&pageSize=10
```

Response sin paginación
```javascript
[
    {
        "id": 1,
        "active": 1,
        "created_at": "2019-03-28T19:31:29.000Z",
        "updated_at": null,
        "deleted_at": null,
        "attributes": [{
            "id": 1,
            "value": "Luciano",
            "field": {
                "name": "name",
                "type": "text"
            }
        }, {
            "id": 2,
            "value": "Verardo",
            "field": {
                "name": "lastname",
                "type": "text"
            }
        }, {
            "id": 3,
            "value": "lverardo@xncompany.com",
            "field": {
                "name": "email",
                "type": "email"
            }
        }, {
            "id": 5,
            "value": "+5491140724049",
            "field": {
                "name": "phone",
                "type": "phone"
            }
        }],
        "rol": "admin"
    },
    { ... }
]
```

### POST /administrators

Crea un nuevo administrador.
> Nota: `code` esta pensado para realizar acciones que requieren confirmación. Por ejemplo: borrar cuenta.
> Por otra parte `token` , esta pensado para confirmaciones por email.

Request:
```javascript
{
    "name": "Luciano",
    "lastname": "Verardo",
    "phone": "+5491140724049",
    "email": "lverardo@xncompany.com",
    "password": "altoviaje",
    "rol": 2
}
```

Response:
```javascript
{
    "id": 1,
    "code": "f6b7e134-26eb-4602-a980-3a6d2e4ab3af",
    "active": 1,
    "created_at": "2019-03-28T19:31:29.000Z",
    "updated_at": null,
    "deleted_at": null,
    "attributes": [{
        "id": 1,
        "value": "Luciano",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 2,
        "value": "Verardo",
        "field": {
            "name": "lastname",
            "type": "text"
        }
    }, {
        "id": 3,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 5,
        "value": "+5491140724049",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }],
    "rol": "admin",
    "token": "abf8f9d500fef3e3ffee6ee51fb66ca2badc95a7a5ae38e067c42252abc0868f"
}
```

### GET /administrators/{id_administrator}

Obtiene el administrador solicitado (`id_administrator`).

```javascript
{
    "id": 1,
    "active": 1,
    "created_at": "2019-03-28T19:31:29.000Z",
    "updated_at": null,
    "deleted_at": null,
    "attributes": [{
        "id": 1,
        "value": "Luciano",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 2,
        "value": "Verardo",
        "field": {
            "name": "lastname",
            "type": "text"
        }
    }, {
        "id": 3,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 5,
        "value": "+5491140724049",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }],
    "rol": "admin"
}
```

### PUT /administrators/{id_administrator}

Actualiza el administrador solicitado (`id_administrator`).
> Nota: No es necesario enviar todos los atributos, solo los que sea desea actualizar.

Request:
```javascript
{
    "name": "Luciano",
    "lastname": "Verardo",
    "phone": "+5491140724049",
    "email": "lverardo@xncompany.com",
    "password": "altoviaje",
    "rol": 2
}
```

Response:
```javascript
{
    "id": 1,
    "active": 1,
    "created_at": "2019-03-28T19:31:29.000Z",
    "updated_at": "2019-03-28T19:31:29.000Z",
    "deleted_at": null,
    "attributes": [{
        "id": 1,
        "value": "Luciano",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 2,
        "value": "Verardo",
        "field": {
            "name": "lastname",
            "type": "text"
        }
    }, {
        "id": 3,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 5,
        "value": "+5491140724049",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }],
    "rol": "admin"
}
```

### DELETE /administrators/{id_administrator}

Elimina de forma lógica el administrador solicitado (`id_administrator`).
> Nota: Solo se actualizara la fecha de borrado del administrador.

Response:
```sh
Status 204 - No content
```

### POST /administrators/login

Logea un administrador.

Request:
```javascript
{
    "email": "lverardo@xncompany.com",
    "password": "altoviaje"
}
```

Response:
```javascript
{
    "id": 1,
    "active": 1,
    "created_at": "2019-03-28T19:31:29.000Z",
    "updated_at": null,
    "deleted_at": null,
    "attributes": [{
        "id": 1,
        "value": "Luciano",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 2,
        "value": "Verardo",
        "field": {
            "name": "lastname",
            "type": "text"
        }
    }, {
        "id": 3,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 5,
        "value": "+5491140724049",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }],
    "rol": "admin"
}
```

### POST /administrators/forgot

Devuelve un administrador con un nuevo `token` para poder realizar el reseteo de la contraseña.

Request:
```javascript
{
    "email": "lverardo@xncompany.com"
}
```

Response:
```javascript
{
    "id": 1,
    "active": 1,
    "created_at": "2019-03-28T19:31:29.000Z",
    "updated_at": null,
    "deleted_at": null,
    "attributes": [{
        "id": 1,
        "value": "Luciano",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 2,
        "value": "Verardo",
        "field": {
            "name": "lastname",
            "type": "text"
        }
    }, {
        "id": 3,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 5,
        "value": "+5491140724049",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }],
    "rol": "admin",
    "token": "81bc56b06de07d40415f3c2bd467e1a41a40630279a24cd2b0fec30e7e804bd0"
}
```

### GET /administrators/reset/{token}

Devuelve el administrador correspondiente al `token`, solo si el mismo no caduco.

```javascript
{
    "id": 1,
    "active": 1,
    "created_at": "2019-03-28T19:31:29.000Z",
    "updated_at": null,
    "deleted_at": null,
    "attributes": [{
        "id": 1,
        "value": "Luciano",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 2,
        "value": "Verardo",
        "field": {
            "name": "lastname",
            "type": "text"
        }
    }, {
        "id": 3,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 5,
        "value": "+5491140724049",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }],
    "rol": "admin"
}
```

### POST /administrators/reset

Actualiza la contraseña del administrador (`id_administrator`).

Request:
```javascript
{
    "id_administrator": 1,
    "password": "altoviaje"
}
```

Response:
```javascript
{
    "id": 1,
    "active": 1,
    "created_at": "2019-03-28T19:31:29.000Z",
    "updated_at": "2019-03-28T19:31:29.000Z",
    "deleted_at": null,
    "attributes": [{
        "id": 1,
        "value": "Luciano",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 2,
        "value": "Verardo",
        "field": {
            "name": "lastname",
            "type": "text"
        }
    }, {
        "id": 3,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 5,
        "value": "+5491140724049",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }],
    "rol": "admin"
}
```

### GET /administrators/permissions

Obtiene la lista de los permisos de administradores.

```javascript
[
    {
        "id": 1,
        "description": "super_admin"
    }, {
        "id": 2,
        "description": "admin"
    }, {
        "id": 3,
        "description": "assistant"
    },
    { ... }
]
```

#### Empresas

### GET /companies

Obtiene la lista de las empresas.

Request
```sh
GET /companies

# PAGINACIÓN (Necesita si o si `page` y `pageSize` para realizar la paginación)
GET /companies?page=1&pageSize=10
```

Response sin paginación
```javascript
[
    {
        "id": 1,
        "active": 1,
        "created_at": "2019-03-29T03:11:21.000Z",
        "updated_at": null,
        "deleted_at": null,
        "attributes": [{
            "id": 3,
            "value": "XN ARGENTINA  SA",
            "field": {
                "name": "name",
                "type": "text"
            }
        }, {
            "id": 4,
            "value": "30710095864",
            "field": {
                "name": "cuit",
                "type": "text"
            }
        }, {
            "id": 5,
            "value": "lverardo@xncompany.com",
            "field": {
                "name": "email",
                "type": "email"
            }
        }, {
            "id": 6,
            "value": "MIGUELETES 1231 Piso:2 Dpto:A",
            "field": {
                "name": "legal_address",
                "type": "address"
            }
        }, {
            "id": 7,
            "value": "Migueletes 1231 Piso 2 Oficina A",
            "field": {
                "name": "address",
                "type": "address"
            }
        }, {
            "id": 8,
            "value": "+541148494466",
            "field": {
                "name": "phone",
                "type": "phone"
            }
        }, {
            "id": 9,
            "value": "+541148494474",
            "field": {
                "name": "alternative_phone",
                "type": "phone"
            }
        }, {
            "id": 10,
            "value": "https://www.xncompany.com/wp-content/uploads/2017/05/cropped-logo-cuadrado-chico-1-300x300.png",
            "field": {
                "name": "image",
                "type": "image"
            }
        }],
        "usersCount": 0,
        "personsCount": 0,
        "status": {
            "id": 2,
            "description": "verified"
        },
        "wallet": {
            "id": 1,
            "points": 0,
            "created_at": "2019-03-29T03:11:21.000Z",
            "updated_at": null
        }
    },
    { ... }
]
```

### POST /companies

Crea una nueva empresa.
> Nota: `code` esta pensado para realizar acciones que requieren confirmación. Por ejemplo: borrar cuenta.

Request:
```javascript
{
    "cuit": "30710095864",
    "email": "lverardo@xncompany.com",
    "address": "Migueletes 1231 Piso 2 Oficina A",
    "phone": "+541148494466",
    "alternative_phone": "+541148494474",
    "image": "https://www.xncompany.com/wp-content/uploads/2017/05/cropped-logo-cuadrado-chico-1-300x300.png"
}
```

Response:
```javascript
{
    "id": 1,
    "code": "f84ff8d0-b2b0-4718-a1b4-d3eb0cbe9e9b",
    "active": 1,
    "created_at": "2019-03-29T03:11:21.000Z",
    "updated_at": null,
    "deleted_at": null,
    "attributes": [{
        "id": 3,
        "value": "XN ARGENTINA  SA",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 4,
        "value": "30710095864",
        "field": {
            "name": "cuit",
            "type": "text"
        }
    }, {
        "id": 5,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 6,
        "value": "MIGUELETES 1231 Piso:2 Dpto:A",
        "field": {
            "name": "legal_address",
            "type": "address"
        }
    }, {
        "id": 7,
        "value": "Migueletes 1231 Piso 2 Oficina A",
        "field": {
            "name": "address",
            "type": "address"
        }
    }, {
        "id": 8,
        "value": "+541148494466",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }, {
        "id": 9,
        "value": "+541148494474",
        "field": {
            "name": "alternative_phone",
            "type": "phone"
        }
    }, {
        "id": 10,
        "value": "https://www.xncompany.com/wp-content/uploads/2017/05/cropped-logo-cuadrado-chico-1-300x300.png",
        "field": {
            "name": "image",
            "type": "image"
        }
    }],
    "usersCount": 0,
    "personsCount": 0,
    "status": {
        "id": 2,
        "description": "verified"
    },
    "wallet": {
        "id": 1,
        "points": 0,
        "created_at": "2019-03-29T03:11:21.000Z",
        "updated_at": null
    }
}
```

### GET /companies/{id_company}

Obtiene la empresa solicitada (`id_company`).

```javascript
{
    "id": 1,
    "code": "f84ff8d0-b2b0-4718-a1b4-d3eb0cbe9e9b",
    "active": 1,
    "created_at": "2019-03-29T03:11:21.000Z",
    "updated_at": null,
    "deleted_at": null,
    "attributes": [{
        "id": 3,
        "value": "XN ARGENTINA  SA",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 4,
        "value": "30710095864",
        "field": {
            "name": "cuit",
            "type": "text"
        }
    }, {
        "id": 5,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 6,
        "value": "MIGUELETES 1231 Piso:2 Dpto:A",
        "field": {
            "name": "legal_address",
            "type": "address"
        }
    }, {
        "id": 7,
        "value": "Migueletes 1231 Piso 2 Oficina A",
        "field": {
            "name": "address",
            "type": "address"
        }
    }, {
        "id": 8,
        "value": "+541148494466",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }, {
        "id": 9,
        "value": "+541148494474",
        "field": {
            "name": "alternative_phone",
            "type": "phone"
        }
    }, {
        "id": 10,
        "value": "https://www.xncompany.com/wp-content/uploads/2017/05/cropped-logo-cuadrado-chico-1-300x300.png",
        "field": {
            "name": "image",
            "type": "image"
        }
    }],
    "usersCount": 0,
    "personsCount": 0,
    "status": {
        "id": 2,
        "description": "verified"
    },
    "wallet": {
        "id": 1,
        "points": 0,
        "created_at": "2019-03-29T03:11:21.000Z",
        "updated_at": null
    }
}
```

### PUT /companies/{id_company}

Actualiza la empresa solicitada (`id_company`).
> Nota: No es necesario enviar todos los atributos, solo los que sea desea actualizar.

Request:
```javascript
{
    "cuit": "30710095864",
    "email": "lverardo@xncompany.com",
    "address": "Migueletes 1231 Piso 2 Oficina A",
    "phone": "+541148494466",
    "alternative_phone": "+541148494474",
    "image": "https://www.xncompany.com/wp-content/uploads/2017/05/cropped-logo-cuadrado-chico-1-300x300.png"
}
```

Response:
```javascript
{
    "id": 1,
    "code": "f84ff8d0-b2b0-4718-a1b4-d3eb0cbe9e9b",
    "active": 1,
    "created_at": "2019-03-29T03:11:21.000Z",
    "updated_at": null,
    "deleted_at": null,
    "attributes": [{
        "id": 3,
        "value": "XN ARGENTINA  SA",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 4,
        "value": "30710095864",
        "field": {
            "name": "cuit",
            "type": "text"
        }
    }, {
        "id": 5,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 6,
        "value": "MIGUELETES 1231 Piso:2 Dpto:A",
        "field": {
            "name": "legal_address",
            "type": "address"
        }
    }, {
        "id": 7,
        "value": "Migueletes 1231 Piso 2 Oficina A",
        "field": {
            "name": "address",
            "type": "address"
        }
    }, {
        "id": 8,
        "value": "+541148494466",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }, {
        "id": 9,
        "value": "+541148494474",
        "field": {
            "name": "alternative_phone",
            "type": "phone"
        }
    }, {
        "id": 10,
        "value": "https://www.xncompany.com/wp-content/uploads/2017/05/cropped-logo-cuadrado-chico-1-300x300.png",
        "field": {
            "name": "image",
            "type": "image"
        }
    }],
    "usersCount": 0,
    "personsCount": 0,
    "status": {
        "id": 2,
        "description": "verified"
    },
    "wallet": {
        "id": 1,
        "points": 0,
        "created_at": "2019-03-29T03:11:21.000Z",
        "updated_at": null
    }
}
```

### DELETE /companies/{id_company}

Elimina de forma lógica al empresa solicitada (`id_company`).
> Nota: Solo se actualizara la fecha de borrado de la empresa.

Response:
```sh
Status 204 - No content
```

### POST /companies/{id_company}/wallets

Agrega puntos en la billetera de la empresa solicitada (`id_company`). Ademas, genera una trasacción de backoffice para mantener un registro de los movimientos realizados.

Request:
```javascript
{
    "id_administrator": 1,
    "points": 1000
}
```

Response:
```javascript
{
    "id": 1,
    "active": 1,
    "created_at": "2019-03-29T03:11:21.000Z",
    "updated_at": "2019-03-29T03:11:21.000Z",
    "deleted_at": null,
    "attributes": [{
        "id": 3,
        "value": "XN ARGENTINA  SA",
        "field": {
            "name": "name",
            "type": "text"
        }
    }, {
        "id": 4,
        "value": "30710095864",
        "field": {
            "name": "cuit",
            "type": "text"
        }
    }, {
        "id": 5,
        "value": "lverardo@xncompany.com",
        "field": {
            "name": "email",
            "type": "email"
        }
    }, {
        "id": 6,
        "value": "MIGUELETES 1231 Piso:2 Dpto:A",
        "field": {
            "name": "legal_address",
            "type": "address"
        }
    }, {
        "id": 7,
        "value": "Migueletes 1231 Piso 2 Oficina A",
        "field": {
            "name": "address",
            "type": "address"
        }
    }, {
        "id": 8,
        "value": "+541148494466",
        "field": {
            "name": "phone",
            "type": "phone"
        }
    }, {
        "id": 9,
        "value": "+541148494474",
        "field": {
            "name": "alternative_phone",
            "type": "phone"
        }
    }, {
        "id": 10,
        "value": "https://www.xncompany.com/wp-content/uploads/2017/05/cropped-logo-cuadrado-chico-1-300x300.png",
        "field": {
            "name": "image",
            "type": "image"
        }
    }],
    "usersCount": 0,
    "personsCount": 0,
    "status": {
        "id": 2,
        "description": "verified"
    },
    "wallet": {
        "id": 1,
        "points": 1000,
        "created_at": "2019-03-29T03:11:21.000Z",
        "updated_at": "2019-03-29T03:11:21.000Z"
    }
}
```

#### Transacciones

##### Transacciones de pagos

### GET /transactions/payments

Obtiene la lista de las transacciones de pagos.

Request
```sh
GET /transactions/payments

# FILTROS
# Por operador (1 = rapipago, 2 = bitex, 3 = transferencia bancaria)
GET /transactions/payments?o=3
# Con empresa. Indica que el json de respuesta debe contener el objeto empresa
GET /transactions/payments?c=true

# PAGINACIÓN (Necesita si o si `page` y `pageSize` para realizar la paginación)
GET /transactions/payments?page=1&pageSize=10
```

Response sin filtros y sin paginación
```javascript
[
    {
        "id": 1,
        "amount": 1000,
        "description": "{\"cbu\":\"2850590940090418135201\",\"alias\":\"Alto Viaje\",\"email\":\"points@altoviaje.com\"}",
        "created_at": "2019-04-01T17:19:35.000Z",
        "updated_at": null,
        "status": {
            "id": 1,
            "description": "pending"
        },
        "operator": {
            "id": 3,
            "description": "wire_transfer",
            "active": 1,
            "priority": 2,
            "created_at": "2019-04-01T17:19:10.000Z",
            "updated_at": null
        },
        "user": { ... },
        "company": { ... }
    },
    { ... }
]
```

### GET /transactions/payments/{id_payment}

Obtiene la transacción de pago solicitada (`id_payment`).

```javascript
{
    "id": 1,
    "amount": 1000,
    "description": "{\"cbu\":\"2850590940090418135201\",\"alias\":\"Alto Viaje\",\"email\":\"points@altoviaje.com\"}",
    "created_at": "2019-04-01T17:19:35.000Z",
    "updated_at": null,
    "status": {
        "id": 1,
        "description": "pending"
    },
    "operator": {
        "id": 3,
        "description": "wire_transfer",
        "active": 1,
        "priority": 2,
        "created_at": "2019-04-01T17:19:10.000Z",
        "updated_at": null
    },,
    "user": { ... },
    "company": { ... }
}
```

### PUT /transactions/payments/{id_payment}

Actualiza el estado de la transacción de pago solicitada (`id_payment`).

Request:
```javascript
{
    "id_administrator": 1,

    // 1 = PENDING,
    // 2 = REJECTED,
    // 3 = APPROVED,
    // 4 = EXPIRED
    "id_recharge_transaction_status": 3
}
```

Response:
```javascript
{
    "id": 1,
    "amount": 1000,
    "description": "{\"cbu\":\"2850590940090418135201\",\"alias\":\"Alto Viaje\",\"email\":\"points@altoviaje.com\",\"changes\":[{\"id_payment_transaction_status_from\":1,\"id_payment_transaction_status_to\":3,\"id_administrator\":1,\"updated_at\":\"2019-04-01T17:40:10.465Z\"}]}",
    "created_at": "2019-04-01T17:19:35.000Z",
    "updated_at": null,
    "status": {
        "id": 3,
        "description": "approved"
    },
    "operator": {
        "id": 3,
        "description": "wire_transfer",
        "active": 1,
        "priority": 2,
        "created_at": "2019-04-01T17:19:10.000Z",
        "updated_at": null
    },
    "user": { ... },
    "company": { ... }
}
```

##### Transacciones de recargas

### GET /transactions/recharges

Obtiene la lista de las transacciones de racargas.

Request
```sh
GET /transactions/recharges

# FILTROS
# Con empresa. Indica que el json de respuesta debe contener el objeto empresa
GET /transactions/recharges?c=true

# PAGINACIÓN (Necesita si o si `page` y `pageSize` para realizar la paginación)
GET /transactions/recharges?page=1&pageSize=10
```

Response sin filtros y sin paginación
```javascript
[
    {
        "id": 1,
        "description": "{\"persons\":[{\"id_person\":4,\"id_transaction\":370144,\"id_transaction_internal\":8,\"id_transaction_external\":37010,\"number\":\"6061267340141116\",\"amount\":550,\"status\":\"ok\",\"created_at\":\"2019-03-17T23:32:28.000Z\",\"recharge\":true,\"reverse\":false,\"id_recharge_transaction_status\":2},{\"id_person\":3,\"id_transaction\":0,\"id_transaction_internal\":10,\"id_transaction_external\":37012,\"number\":\"7584003387152044\",\"amount\":550,\"status\":\"invalid_card\",\"created_at\":\"2019-03-17T23:34:08.000Z\",\"recharge\":false,\"reverse\":false,\"id_recharge_transaction_status\":3},{\"id_person\":2,\"id_transaction\":0,\"id_transaction_internal\":11,\"id_transaction_external\":37013,\"number\":\"6061267187152044\",\"amount\":550,\"status\":\"card_in_black_list\",\"created_at\":\"2019-03-17T23:34:40.000Z\",\"recharge\":false,\"reverse\":false,\"id_recharge_transaction_status\":3},{\"id_person\":1,\"id_transaction\":370145,\"id_transaction_internal\":9,\"id_transaction_external\":37011,\"number\":\"6061267195495203\",\"amount\":550,\"status\":\"ok\",\"created_at\":\"2019-03-17T23:33:10.000Z\",\"recharge\":true,\"reverse\":false,\"id_recharge_transaction_status\":2}],\"results\":{\"incomplete\":0,\"done\":2,\"fail\":2}}",
        "points": 1100,
        "created_at": "2019-03-29T21:22:41.000Z",
        "persons": [
            { ... },
            { ... },
            { ... },
            { ... }
        ],
        "status": {
            "id": 1,
            "description": "incomplete"
        },
        "situation": {
            "id": 1,
            "description": "need_paid"
        },
        "user": { ... },
        "company": { ... }
    },
    { ... }
]
```

### GET /transactions/recharges/{id_recharge}

Obtiene la transacción de recarga solicitada (`id_recharge`).

```javascript
{
    "id": 1,
    "description": "{\"persons\":[{\"id_person\":4,\"id_transaction\":370144,\"id_transaction_internal\":8,\"id_transaction_external\":37010,\"number\":\"6061267340141116\",\"amount\":550,\"status\":\"ok\",\"created_at\":\"2019-03-17T23:32:28.000Z\",\"recharge\":true,\"reverse\":false,\"id_recharge_transaction_status\":2},{\"id_person\":3,\"id_transaction\":0,\"id_transaction_internal\":10,\"id_transaction_external\":37012,\"number\":\"7584003387152044\",\"amount\":550,\"status\":\"invalid_card\",\"created_at\":\"2019-03-17T23:34:08.000Z\",\"recharge\":false,\"reverse\":false,\"id_recharge_transaction_status\":3},{\"id_person\":2,\"id_transaction\":0,\"id_transaction_internal\":11,\"id_transaction_external\":37013,\"number\":\"6061267187152044\",\"amount\":550,\"status\":\"card_in_black_list\",\"created_at\":\"2019-03-17T23:34:40.000Z\",\"recharge\":false,\"reverse\":false,\"id_recharge_transaction_status\":3},{\"id_person\":1,\"id_transaction\":370145,\"id_transaction_internal\":9,\"id_transaction_external\":37011,\"number\":\"6061267195495203\",\"amount\":550,\"status\":\"ok\",\"created_at\":\"2019-03-17T23:33:10.000Z\",\"recharge\":true,\"reverse\":false,\"id_recharge_transaction_status\":2}],\"results\":{\"incomplete\":0,\"done\":2,\"fail\":2}}",
    "points": 1100,
    "created_at": "2019-03-29T21:22:41.000Z",
    "persons": [
        { ... },
        { ... },
        { ... },
        { ... }
    ],
    "status": {
        "id": 1,
        "description": "incomplete"
    },
    "situation": {
        "id": 1,
        "description": "need_paid"
    },
    "user": { ... },
    "company": { ... }
}
```

### PUT /transactions/recharges/{id_recharge}

Actualiza la situación de la transacción de recarga solicitada (`id_recharge`).

Request:
```javascript
{
    "id_administrator": 1,

    // 1 = NEED_PAID,
    // 2 = IN_PROGRESS,
    // 3 = PAID_OUT
    "id_recharge_transaction_situation": 2
}
```

Response:
```javascript
{
    "id": 1,
    "description": "{\"persons\":[{\"id_person\":4,\"id_transaction\":370144,\"id_transaction_internal\":8,\"id_transaction_external\":37010,\"number\":\"6061267340141116\",\"amount\":550,\"status\":\"ok\",\"created_at\":\"2019-03-17T23:32:28.000Z\",\"recharge\":true,\"reverse\":false,\"id_recharge_transaction_status\":2},{\"id_person\":3,\"id_transaction\":0,\"id_transaction_internal\":10,\"id_transaction_external\":37012,\"number\":\"7584003387152044\",\"amount\":550,\"status\":\"invalid_card\",\"created_at\":\"2019-03-17T23:34:08.000Z\",\"recharge\":false,\"reverse\":false,\"id_recharge_transaction_status\":3},{\"id_person\":2,\"id_transaction\":0,\"id_transaction_internal\":11,\"id_transaction_external\":37013,\"number\":\"6061267187152044\",\"amount\":550,\"status\":\"card_in_black_list\",\"created_at\":\"2019-03-17T23:34:40.000Z\",\"recharge\":false,\"reverse\":false,\"id_recharge_transaction_status\":3},{\"id_person\":1,\"id_transaction\":370145,\"id_transaction_internal\":9,\"id_transaction_external\":37011,\"number\":\"6061267195495203\",\"amount\":550,\"status\":\"ok\",\"created_at\":\"2019-03-17T23:33:10.000Z\",\"recharge\":true,\"reverse\":false,\"id_recharge_transaction_status\":2}],\"results\":{\"incomplete\":0,\"done\":2,\"fail\":2},\"changes\":[{\"id_recharge_transaction_situation_from\":1,\"id_recharge_transaction_situation_to\":3,\"id_administrator\":1,\"updated_at\":\"2019-04-01T17:40:10.465Z\"}]}",
    "points": 1100,
    "created_at": "2019-03-29T21:22:41.000Z",
    "persons": [
        { ... },
        { ... },
        { ... },
        { ... }
    ],
    "status": {
        "id": 1,
        "description": "incomplete"
    },
    "situation": {
        "id": 3,
        "description": "paid_out"
    },
    "user": { ... },
    "company": { ... }
}
```

#### Ordenes de pago

### GET /recharges/payments/orders

```javascript
[
    {
        "id": 1,
        "amount": 2700,
        "description": "{\"changes\":[{\"id_administrator\":1,\"created_at\":\"2019-04-01T20:12:21.981Z\"}]}",
        "created_at": "2019-04-01T20:12:21.000Z",
        "status": {
            "id": 1,
            "description": "pending"
        },
        "transactions": [
            { ... },
            { ... },
            { ... },
            { ... }
        ]
    }
]
```

### POST /recharges/payments/orders

Request
```javascript
{
    "id_administrator": 1,
    "ids": [1, 2, 3, 4]
}
```

Response
```javascript
{
    "id": 1,
    "amount": 2700,
    "description": "{\"changes\":[{\"id_administrator\":1,\"created_at\":\"2019-04-01T20:12:21.981Z\"}]}",
    "created_at": "2019-04-01T20:12:21.000Z",
    "status": {
        "id": 1,
        "description": "pending"
    },
    "transactions": [
        { ... },
        { ... },
        { ... },
        { ... }
    ]
}
```

### GET /recharges/payments/orders/{id_order}

```javascript
{
    "id": 1,
    "amount": 2700,
    "description": "{\"changes\":[{\"id_administrator\":1,\"created_at\":\"2019-04-01T20:12:21.981Z\"}]}",
    "created_at": "2019-04-01T20:12:21.000Z",
    "status": {
        "id": 1,
        "description": "pending"
    },
    "transactions": [
        { ... },
        { ... },
        { ... },
        { ... }
    ]
}
```

### PUT /recharges/payments/orders/{id_order}

Request
```javascript
{
    "id_administrator": 1,

    // 1 = PENDING,
    // 2 = PAID_OUT,
    // 3 = CANCELED
    "id_recharge_payment_order_status": 2
}
```

Response
```javascript
{
    "id": 1,
    "amount": 2700,
    "description": "{\"changes\":[{\"id_administrator\":1,\"created_at\":\"2019-04-01T20:12:21.981Z\"},{\"id_recharge_payment_order_status_from\":1,\"id_recharge_payment_order_status_to\":2,\"id_administrator\":1,\"updated_at\":\"2019-04-01T20:30:43.362Z\"}]}",
    "created_at": "2019-04-01T20:12:21.000Z",
    "status": {
        "id": 2,
        "description": "paid_out"
    },
    "transactions": [
        { ... },
        { ... },
        { ... },
        { ... }
    ]
}
```

#### Configuraciones

### GET /settings

Obtiene la lista de las configuraciones por clave.
> Nota: Se utiliza `description` en lugar de `value`, ya que `value` es una palabra reservada de MySql.

Request
```sh
GET /settings

# FILTROS
# Por clave
GET /settings?k=recharge
```

Response con filtro de clave
```javascript
// #########################################
// GET /settings?k=recharge
// #########################################
[
    {
        "id": 1,
        "setting_key": "recharges.sube.amounts.min",
        "description": "0"
    },
    {
        "id": 2,
        "setting_key": "recharges.sube.amounts.max",
        "description": "800"
    },
    {
        "id": 3,
        "setting_key": "recharges.sube.amounts.step",
        "description": "50"
    },
    {
        "id": 4,
        "setting_key": "recharges.sube.amounts.excepts",
        "description": "[350]"
    }
]
```

### PUT /settings/{id_setting}

Actualiza la configuración solicitada (`id_setting`).
> Nota: Se utiliza `description` en lugar de `value`, ya que `value` es una palabra reservada de MySql.

Request:
```javascript
{
  "value": "1"
}
```

Response:
```javascript
{
    "id": 1,
    "setting_key": "recharges.sube.amounts.min",
    "description": "1"
}
```

<!-- deep links -->
[instalar]: #descarga-e-instalación
[correr]: #correr
[correr_development]: #modo-local
[correr_production]: #modo-producción
[metodos]: #métodos
[backoffice]: #backoffice
[backoffice_dashboard]: #get-backofficedashboard
[administrators]: #administración
[administrators_list]: #get-administrators
[administrators_get]: #get-administratorsid_administrator
[administrators_create]: #post-administrators
[administrators_update]: #put-administratorsid_administrator
[administrators_delete]: #delete-administratorsid_administrator
[administrators_login]: #post-administratorslogin
[administrators_forgot]: #post-administratorsforgot
[administrators_reset_token]: #get-administratorsresettoken
[administrators_reset]: #post-administratorsreset
[companies]: #empresas
[companies_list]: #get-companies
[companies_get]: #get-companiesid_company
[companies_create]: #post-companies
[companies_update]: #put-companiesid_company
[companies_delete]: #delete-companiesid_company
[companies_wallets_charge]: #post-companiesid_companywallets
[transactions]: #transacciones
[transactions_payments]: #transacciones-de-pagos
[transactions_payments_list]: #get-transactionspayments
[transactions_payments_get]: #get-transactionspaymentsid_payment
[transactions_payments_update]: #put-transactionspaymentsid_payment
[transactions_recharges]: #transacciones-de-recargas
[transactions_recharges_list]: #get-transactionsrecharges
[transactions_recharges_get]: #get-transactionsrechargesid_recharge
[transactions_recharges_update]: #put-transactionsrechargesid_recharge
[recharge_payment_orders]: #ordenes-de-pago
[recharge_payment_orders_list]: #get-rechargespaymentsorders
[recharge_payment_orders_create]: #post-rechargespaymentsorders
[recharge_payment_orders_get]: #get-rechargespaymentsordersid_order
[recharge_payment_orders_update]: #put-rechargespaymentsordersid_order
[settings]: #configuraciones
[settings_list]: #get-settings
[settings_update]: #put-settingsid_setting
