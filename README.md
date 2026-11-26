# La Ruta

Aplicación web interactiva para la visualización de rutas de transporte público en Tecate, B.C., desarrollada con una arquitectura modular y diseño responsivo para dispositivos móviles y de escritorio.

## Características

- **Diseño Responsivo**: Cabecera fluida con ajuste tipográfico mediante `clamp()` y barra lateral deslizable (`sidebar.html`) optimizada tanto para escritorio (modo colapsado de iconos) como para dispositivos móviles.
- **Visualizador Cartográfico Funcional (Leaflet)**: Integración con [Leaflet 1.9.4](https://leafletjs.com/) utilizando teselas libres de OpenStreetMap (sin claves de API), centrado en Tecate, B.C. (zoom `15`) con marcador inicial.
- **Datos de Ruta (GeoJSON, en progreso)**: Definición de trazado (`LineString`) y puntos de parada (`Point`) en formato GeoJSON dentro de `js/rutaData.js` para la implementación de la ruta de transporte.
- **Arquitectura Modular**: Separación de componentes con HTML5 semántico, Bootstrap 5.3.8, Bootstrap Icons 1.11.3, CSS personalizado con variables y JavaScript vanilla.
- **Sincronización Dinámica**: Redimensionamiento automático del lienzo del mapa (`map.invalidateSize()`) al expandir o colapsar el menú lateral.

## Estructura del Proyecto

```text
La-Ruta/
├── index.html            # Estructura principal de la aplicación (HTML5 semántico)
├── sidebar.html          # Componente modular de navegación lateral
├── README.md             # Documentación del proyecto
├── assets/               # Recursos gráficos
│   └── la-calabaza.svg   # Logotipo vectorial de la cabecera
├── css/
│   ├── bootstrap.min.css # Framework Bootstrap 5.3.8
│   └── styles.css        # Estilos personalizados, variables y diseño responsivo
└── js/
    ├── map.js            # Inicialización del mapa Leaflet centrado en Tecate, B.C.
    ├── rutaData.js       # Datos GeoJSON de la ruta (LineString) y puntos (Point)
    └── script.js         # Carga asíncrona del sidebar y manejo de eventos
```

## Ejecución Local

Para probar la aplicación en tu entorno local con soporte completo para carga asíncrona de componentes (`fetch`):

1. **Con extensión Live Server (VS Code / Antigravity IDE)**:
   - Haz clic derecho en `index.html` y selecciona **Open with Live Server**.

2. **Con Python**:
   ```bash
   python -m http.server 8000
   ```
   Luego abre tu navegador en `http://localhost:8000`.
