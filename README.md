# NovaMarket - Plataforma E-commerce Full Stack

NovaMarket es una aplicación web de comercio electrónico moderna y completa, diseñada con una arquitectura desacoplada que utiliza Spring Boot para el backend y Angular para el frontend. La plataforma ofrece una experiencia de usuario fluida con una gestión de catálogo robusta, carrito de compras y un panel de administración integral.

## Tecnologías Utilizadas

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Hibernate
- Maven

### Frontend
- Angular 18+
- Angular Material (Componentes UI)
- Lucide Angular (Iconografía)
- Signals para gestión de estado
- Animaciones avanzadas con Angular Animations
- SCSS para estilos personalizados

## Estructura del Proyecto

El repositorio está organizado en dos directorios principales:

- /src: Contiene el código fuente del backend desarrollado en Spring Boot.
- /frontend: Contiene la aplicación cliente desarrollada en Angular.

## Requisitos Previos

Para ejecutar este proyecto localmente, asegúrese de tener instalado:
- Java Development Kit (JDK) 17 o superior.
- Node.js (versión 18.x o superior) y npm.
- Maven 3.x.
- Un IDE como IntelliJ IDEA, VS Code o Eclipse.

## Instrucciones de Configuración

### 1. Clonar el repositorio
git clone https://github.com/SoyPhilips/e-commerce-java.git
cd e-commerce-java

### 2. Configurar el Backend
1. Navegue a la raíz del proyecto donde se encuentra el archivo pom.xml.
2. Instale las dependencias y compile el proyecto:
   mvn clean install
3. Inicie la aplicación Spring Boot:
   mvn spring-boot:run
   
El servidor backend estará disponible en http://localhost:8080.

### 3. Configurar el Frontend
1. Navegue al directorio del frontend:
   cd frontend
2. Instale las dependencias de npm:
   npm install
3. Inicie el servidor de desarrollo de Angular:
   npm start

La aplicación frontend estará disponible en http://localhost:4200.

## Características Principales

### Para Usuarios
- Exploración de catálogo con filtrado por categorías.
- Vista detallada de productos con selección de cantidad.
- Sistema de carrito de compras persistente.
- Lista de deseos (Wishlist) integrada.
- Proceso de checkout simplificado.

### Para Administradores
- Dashboard con estadísticas de inventario.
- Gestión completa de productos (Crear, Leer, Actualizar, Eliminar).
- Control de stock con indicadores visuales.
- Interfaz de administración protegida.

## Credenciales de Acceso (Modo Desarrollo)

Para acceder al panel de administración durante las pruebas:
- Email: admin@novamarket.com
- Contraseña: admin123

## Licencia

Este proyecto fue desarrollado con fines educativos y de demostración.
