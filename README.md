# La Ruta

Aplicación web interactiva para la visualización de rutas de transporte público en Tecate, B.C., desarrollada con una arquitectura modular y diseño responsivo para dispositivos móviles y de escritorio.

## Características

- **Diseño Responsivo**: Cabecera fluida con ajuste tipográfico mediante `clamp()` y barra lateral deslizable optimizada tanto para PC como para dispositivos móviles.
- **Visualizador Cartográfico Funcional (Leaflet)**: Integración con la librería ligera [Leaflet](https://leafletjs.com/) utilizando teselas libres de OpenStreetMap (no requiere claves de API).
- **Arquitectura Limpia**: Separación semántica de componentes (HTML5, CSS modular con variables, JavaScript vanilla sin dependencias innecesarias).
- **Sincronización Dinámica**: Redimensionamiento automático del lienzo del mapa (`map.invalidateSize()`) al expandir o colapsar el menú lateral.

## Estructura del Proyecto

```text
La-Ruta/
├── index.html            # Estructura principal de la aplicación (HTML5 semántico)
├── sidebar.html          # Componente modular de navegación lateral
├── README.md             # Documentación del proyecto
├── assets/               # Recursos gráficos (logotipos y vectores)
│   ├── la-calabaza.svg
│   ├── la-calabaza.png
│   └── lacalabaza.gif
├── css/
│   ├── bootstrap.min.css # Framework Bootstrap 5.3.8
│   └── styles.css        # Estilos personalizados y diseño responsivo
├── js/
│   ├── map.js            # Inicialización y configuración del mapa Leaflet
│   └── script.js         # Carga asíncrona del sidebar y manejo de eventos
└── other/                # Archivos auxiliares y fuentes de datos
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
