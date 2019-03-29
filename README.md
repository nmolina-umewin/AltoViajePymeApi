# AltoViajePymeApi

API para la administración el FrontEnd y Backoffice.

### Índice
------------------------------

* [Descargar e instalar][instalar].
* [Correr][correr].
    + [Local][correr_development].
    + [Producción][correr_production].
* [Métodos][metodos].
    + [Administradores][administrators_list]
        - [Listar todos][administrators_list]
        - [Obtener por ID][administrators_get]
        - [Alta][administrators_create]
        - [Modificación][administrators_update]
        - [Baja][administrators_delete]
        - [Login][administrators_login]
        - [Recuperar contraseña][administrators_forgot]
        - [Obtener por TOKEN][administrators_reset_token]
        - [Modificación de contraseña][administrators_reset]
    + [Empresas][companies_list]
        - [Listar todas][companies_list]
        - [Obtener por ID][companies_get]
        - [Alta][companies_create]
        - [Modificación][companies_update]
        - [Baja][companies_delete]
        - [Cargar AV Puntos][companies_wallets_charge]
    + [Configuraciones][settings_list]
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

 # Settings
 GET    /settings
 PUT    /settings/{id_setting}
```

### GET /administrators

Obtiene la lista de los administradores.

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

### GET /companies

Obtiene la lista de las empresas.

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

### GET /settings

Obtiene la lista de las configuraciones por clave.
> Nota: Se utiliza `description` en lugar de `value`, ya que `value` es una palabra reservada de MySql.

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
[administrators_list]: #get-administrators
[administrators_get]: #get-administratorsid_administrator
[administrators_create]: #post-administrators
[administrators_update]: #put-administratorsid_administrator
[administrators_delete]: #delete-administratorsid_administrator
[administrators_login]: #post-administratorslogin
[administrators_forgot]: #post-administratorsforgot
[administrators_reset_token]: #get-administratorsresettoken
[administrators_reset]: #post-administratorsreset
[companies_list]: #get-companies
[companies_get]: #get-companiesid_company
[companies_create]: #post-companies
[companies_update]: #put-companiesid_company
[companies_delete]: #delete-companiesid_company
[companies_wallets_charge]: #post-companiesid_companywallets
[settings_list]: #get-settings
[settings_update]: #put-settingsid_setting
