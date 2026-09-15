# 📚 Matchbook

Aplicación web de intercambio de libros entre usuarios, con un sistema de match que sugiere compatibilidades entre lo que una persona ofrece y lo que otra desea leer.

Proyecto desarrollado como práctica personal para reforzar fundamentos de frontend con JavaScript vanilla: manipulación del DOM, navegación entre "páginas" sin recargar el sitio, y persistencia de datos en el navegador sin depender de un backend.

🎯 Propósito del proyecto

La idea central es simular el flujo completo de una app de intercambio de libros tipo "Tinder de libros":

Un usuario se registra e indica qué libros ofrece y cuáles desea conseguir.
El sistema busca otros usuarios con intereses compatibles y muestra un "match" cuando encuentra coincidencias.
Si no hay compatibilidad exacta, se ofrecen opciones similares como alternativa.

Todo el flujo (autenticación, gestión de libros, búsqueda de matches) está resuelto 100% en el cliente, sin backend ni base de datos real — es un ejercicio enfocado en lógica de frontend, estructura de UI por pantallas y manejo de estado con localStorage.

✨ Funcionalidades
Autenticación simulada: registro y login de usuarios, con sesión persistida en localStorage.
Gestión de biblioteca personal: agregar y eliminar libros en dos listas — "Ofrezco" y "Quiero" — cada una con título, autor y estado de conservación.
Sistema de match: búsqueda simulada (con delay de carga) que compara al usuario contra un set de perfiles de ejemplo y muestra el resultado — ya sea un match compatible o alternativas de menor compatibilidad.
Perfil editable: visualización y edición de datos personales (nombre, teléfono, ciudad, estado).
Navegación por pantallas (SPA simple): todas las vistas viven en un único index.html, controladas por JavaScript sin router ni recarga de página.
Diseño responsive: adaptado a móvil mediante media queries, incluyendo reordenamiento de layouts tipo split-screen y listas.
🛠️ Stack tecnológico
HTML5 — estructura semántica de cada pantalla como sección independiente.
CSS3 — diseño con variables CSS, tarjetas, animaciones (fadeIn, pulse) y responsive design.
JavaScript (Vanilla) — toda la lógica de navegación, autenticación y CRUD de libros, sin frameworks ni librerías externas.
localStorage — persistencia de usuarios registrados y sesión activa en el navegador.
📁 Estructura del proyecto
matchbook/
├── index.html      # Todas las pantallas de la app (login, dashboard, perfil, etc.)
├── style.css        # Estilos, diseño responsive y componentes visuales
└── script.js         # Lógica de navegación, autenticación, CRUD y sistema de match
🚀 Cómo probarlo localmente

No requiere instalación ni dependencias:

Clona el repositorio.
Abre index.html directamente en el navegador (doble clic, o con la extensión "Live Server" de VS Code para recarga automática).
Regístrate con cualquier correo y contraseña — los datos quedan guardados en el localStorage de tu navegador.
⚠️ Estado actual y alcance

Este proyecto es una prueba de concepto de frontend, no una aplicación en producción:

Los "matches" provienen de un arreglo de datos simulados (simulatedMatches) dentro de script.js, no de una base de datos real ni de otros usuarios reales.
No hay backend: toda la información vive únicamente en el navegador del usuario y se pierde si se borra el localStorage.
No incluye validaciones de seguridad (las contraseñas se guardan en texto plano), algo esperable en un ejercicio de práctica pero que se resolvería con un backend real (hash de contraseñas, JWT, base de datos) en una versión futura.
👤 Autor

Santiago Orozco — Estudiante de Ingeniería en Tecnologías de la Información (UPSE)
