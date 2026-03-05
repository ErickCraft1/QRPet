# QRPet

Generador de códigos QR para mascotas. Permite a los dueños crear un QR con la información de su mascota y datos de contacto. Si la mascota se pierde, cualquier persona puede escanear el código QR para ver los datos y contactar al dueño por WhatsApp, compartiendo su ubicación en tiempo real.

## Características

- Registro de mascotas con nombre, raza, edad y foto
- Generación de código QR único por mascota
- Página pública por mascota accesible al escanear el QR
- Botón de contacto por WhatsApp con geolocalización
- Validación de datos con Zod
- Descarga del QR como imagen PNG

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Validación:** Zod
- **Upload de archivos:** Multer
- **Base de datos:** JSON local (`pets.json`)
- **QR:** qrcode.js (CDN, frontend)
- **Package Manager:** pnpm

## Estructura del proyecto

```
QRPet/
├── App/
│   ├── public/
│   │   └── img/
│   ├── uploads/              # Imágenes subidas de mascotas
│   └── src/
│       ├── app.js            # Configuración de Express
│       ├── server.js         # Punto de entrada
│       ├── controllers/
│       │   └── qr.controller.js
│       ├── models/
│       │   └── local/
│       │       ├── qr.model.js
│       │       └── pets.json # Base de datos local
│       ├── routes/
│       │   └── qr.routes.js
│       ├── schemas/
│       │   └── pet.schema.js # Validación con Zod
│       ├── utils/
│       │   └── multer.js     # Configuración de Multer
│       └── views/
│           ├── index.html
│           ├── qrHandler.js
│           └── styles.css
└── package.json
```

## Instalación

```bash
pnpm install
```

## Uso

```bash
# Desarrollo (con watch mode)
pnpm dev

# Producción
pnpm start
```

El servidor se inicia en `http://localhost:3000`.

## API

| Método | Ruta           | Descripción                         |
| ------ | -------------- | ----------------------------------- |
| GET    | `/`            | Página principal con formulario     |
| POST   | `/api/qr`      | Crear mascota (multipart/form-data) |
| GET    | `/mascota/:id` | Página pública de la mascota        |
| GET    | `/api/debug`   | Ver todos los registros (debug)     |

### POST `/api/qr`

Campos del formulario (`multipart/form-data`):

| Campo          | Tipo                  | Requerido |
| -------------- | --------------------- | --------- |
| `petName`      | string                | Sí        |
| `petBreed`     | string                | Sí        |
| `petAge`       | number                | Sí        |
| `ownerName`    | string                | Sí        |
| `ownerContact` | string (7-15 dígitos) | Sí        |
| `petImage`     | file (imagen)         | No        |

Respuesta:

```json
{
  "id": "uuid",
  "petName": "Max",
  "petBreed": "Labrador",
  "petAge": 3,
  "ownerContact": "51987654321",
  "ownerName": "Erick",
  "petImage": "/uploads/uuid.jpeg"
}
```

## Flujo

1. El dueño completa el formulario con los datos de su mascota
2. Se genera un UUID y se guarda en `pets.json`
3. Se genera un código QR con la URL `/mascota/:id`
4. El dueño descarga e imprime el QR para el collar
5. Quien encuentre a la mascota escanea el QR
6. Ve la información de la mascota y puede contactar al dueño por WhatsApp con su ubicación

## Licencia

ISC
