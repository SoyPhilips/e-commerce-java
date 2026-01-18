# 🚀 NovaMarket - E-commerce Full Stack

NovaMarket es una plataforma de comercio electrónico moderna y robusta, construida con una arquitectura profesional que separa el **Backend (Spring Boot)** del **Frontend (Angular)**. Ofrece una experiencia de usuario fluida, gestión de inventario en tiempo real y un panel administrativo completo.

---

## 🛠️ Tecnologías Principales

| Backend (API) | Frontend (Cliente) |
| :--- | :--- |
| **Java 17** & **Spring Boot 3** | **Angular 18+** |
| **Spring Data JPA** & Hibernate | **Signals** (Gestión de estado) |
| **Maven** (Gestión de dependencias) | **Angular Material** & **Lucide Icons** |
| Base de Datos H2 (En memoria) | **SCSS** & Animations |

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:
- **Java JDK 17** o superior.
- **Node.js** (v18.x o superior) y **npm**.
- **Maven 3.x**.
- Un navegador web moderno (Chrome, Firefox, Edge).

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

### 1. Clonar el Proyecto
```bash
git clone https://github.com/SoyPhilips/e-commerce-java.git
cd e-commerce-java
```

### 2. Iniciar el Backend (Servidor)
El backend maneja la lógica de negocio y la base de datos.
1. Abre una terminal en la raíz del proyecto.
2. Ejecuta el comando para compilar e iniciar:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
3. **Verificación:** Abre [http://localhost:8080/api/productos](http://localhost:8080/api/productos) en tu navegador. Deberías ver un JSON con los productos.

### 3. Iniciar el Frontend (Interfaz)
El frontend es lo que el usuario final ve e interactúa.
1. Abre una **nueva terminal** y navega a la carpeta frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Inicia la aplicación de desarrollo:
   ```bash
   npm start
   ```
4. **¡Listo!** Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

---

## 🔐 Acceso de Administrador

Para probar las funciones de gestión de productos:
- **URL:** [http://localhost:4200/login](http://localhost:4200/login)
- **Email:** `admin@novamarket.com`
- **Contraseña:** `admin123`

---

## ✨ Características Destacadas

### 🛒 Experiencia de Compra
- **Catálogo Dinámico:** Filtrado instantáneo por categorías.
- **Detalle de Producto:** Vista completa con control de stock.
- **Carrito de Compras:** Persistencia local y animaciones fluidas.
- **Wishlist:** Guarda tus productos favoritos.

### ⚙️ Panel de Administración
- **Dashboard:** Estadísticas rápidas del inventario.
- **Gestión CRUD:** Crea, edita y elimina productos fácilmente.
- **Control de Stock:** Indicadores visuales de bajo inventario.

---

## 📁 Estructura del Directorio

```text
e-commerce-java/
├── src/                # Código fuente del Backend (Java/Spring Boot)
│   ├── main/java/      # Controladores, Modelos y Servicios
│   └── main/resources/ # Configuración y datos iniciales
├── frontend/           # Código fuente del Frontend (Angular)
│   ├── src/app/        # Componentes y lógica del cliente
│   └── src/assets/     # Imágenes y estilos globales
└── pom.xml             # Configuración de Maven
```

---

## 🔧 Solución de Problemas Comunes

- **Error de Puerto 8080:** Asegúrate de que no tengas otra aplicación usando el puerto 8080.
- **Error en `npm install`:** Si falla, intenta borrar la carpeta `node_modules` y ejecutar `npm install --force`.
- **Backend no conecta:** Verifica que Java 17 esté correctamente configurado en tus variables de entorno.

---

⭐ *Si este proyecto te resultó útil, ¡no olvides darle una estrella en GitHub!*
