/**
 * Inicialización y configuración básica del mapa con Leaflet
 */
(function initMap() {
    // Verificación de disponibilidad de la librería Leaflet
    if (typeof L === 'undefined') {
        console.error('Leaflet (L) no está cargado.');
        return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.warn('Contenedor #map no encontrado en el DOM.');
        return;
    }

    // Coordenadas centrales iniciales: [Latitud, Longitud] (Tijuana, B.C.)
    const TIJUANA_CENTER = [32.5149, -116.9725];
    const DEFAULT_ZOOM = 13;

    // 1. Inicializar la instancia del mapa
    const map = L.map('map', {
        center: TIJUANA_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true
    });

    // 2. Capa base de teselas (OpenStreetMap estándar, libre y sin clave de API)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> colaboradores'
    }).addTo(map);

    // 3. Marcador de ejemplo inicial
    const marker = L.marker(TIJUANA_CENTER).addTo(map);
    marker.bindPopup('<b>La Ruta</b><br>Tijuana, B.C.').openPopup();

    // Exponer instancia global para permitir recalcular el tamaño al alternar el sidebar
    window.mapInstance = map;
})();
