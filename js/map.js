/**
 * Inicialización del mapa Leaflet, trazado de ruta y simulación por horario.
 */
(function initMap() {
    if (typeof L === 'undefined') {
        console.error('Leaflet (L) no está cargado.');
        return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.warn('Contenedor #map no encontrado en el DOM.');
        return;
    }

    const TECATE = [32.55837733324173, -116.62748688360031];
    const DEFAULT_ZOOM = 15;
    const ROUTE_COLOR = '#d90429';
    const SIMULATION_TICK_MS = 1000;

    const map = L.map('map', {
        center: TECATE,
        zoom: DEFAULT_ZOOM,
        zoomControl: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> colaboradores'
    }).addTo(map);

    /**
     * Crea un elemento seguro para el popup evitando inyección HTML.
     */
    function createPopupTitle(text) {
        const title = document.createElement('strong');
        title.textContent = text;
        return title;
    }

    /**
     * Precalcula los segmentos con distancia positiva y la distancia total de la ruta.
     */
    function buildRouteMetrics(points) {
        const segments = [];
        let totalDistance = 0;

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = L.latLng(points[i]);
            const p2 = L.latLng(points[i + 1]);
            const dist = p1.distanceTo(p2);
            if (dist > 0) {
                segments.push({ p1, p2, dist });
                totalDistance += dist;
            }
        }

        return { segments, totalDistance };
    }

    let routePoints = [];

    if (typeof datosRuta !== 'undefined' && Array.isArray(datosRuta.features)) {
        L.geoJSON(datosRuta, {
            style: function (feature) {
                if (feature?.geometry?.type === 'LineString') {
                    return { color: ROUTE_COLOR, weight: 5, opacity: 0.85 };
                }
                return {};
            },
            pointToLayer: function (feature, latlng) {
                const nombreParada = feature?.properties?.nombre || 'Parada';
                return L.circleMarker(latlng, {
                    radius: 7,
                    fillColor: '#ffffff',
                    color: ROUTE_COLOR,
                    weight: 3,
                    fillOpacity: 1
                }).bindPopup(createPopupTitle(nombreParada));
            },
            onEachFeature: function (feature, layer) {
                if (feature?.geometry?.type === 'LineString' && routePoints.length === 0) {
                    routePoints = layer.getLatLngs();
                }
            }
        }).addTo(map);
    } else {
        console.warn('datosRuta no está definido o no es válido. Verifica que js/rutaData.js se cargue antes.');
    }

    const routeMetrics = buildRouteMetrics(routePoints);

    window.mapInstance = map;
    window.puntosParaSimulacion = routePoints;

    const initialPosition = routePoints[0] || TECATE;
    const truckMarker = L.marker(initialPosition, {
        title: 'Unidad en ruta',
        zIndexOffset: 500
    })
        .addTo(map)
        .bindPopup('<b>La Ruta</b><br>Unidad de transporte');

    let intervalId = null;

    /**
     * Convierte una cadena "HH:MM" en milisegundos para la fecha actual.
     */
    function parseTimeToTodayMs(timeStr) {
        if (typeof timeStr !== 'string') return null;
        const match = /^(\d{2}):(\d{2})$/.exec(timeStr.trim());
        if (!match) return null;

        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0).getTime();
    }

    /**
     * Calcula la posición interpolada sobre la ruta para un progreso entre 0 y 1.
     */
    function getPositionAtProgress(points, metrics, progress) {
        if (!points || points.length === 0) return TECATE;
        if (progress <= 0 || metrics.totalDistance <= 0) return points[0];
        if (progress >= 1) return points[points.length - 1];

        const targetDistance = metrics.totalDistance * progress;
        let accumulated = 0;

        for (const seg of metrics.segments) {
            if (accumulated + seg.dist >= targetDistance) {
                const ratio = (targetDistance - accumulated) / seg.dist;
                const lat = seg.p1.lat + (seg.p2.lat - seg.p1.lat) * ratio;
                const lng = seg.p1.lng + (seg.p2.lng - seg.p1.lng) * ratio;
                return [lat, lng];
            }
            accumulated += seg.dist;
        }

        return points[points.length - 1];
    }

    function stopSimulation() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function iniciarSimulacionHorario() {
        const inputInicio = document.getElementById('horaInicio');
        const inputFin = document.getElementById('horaFin');
        const estadoEl = document.getElementById('estadoRuta');

        if (routePoints.length < 2 || routeMetrics.totalDistance <= 0) {
            stopSimulation();
            if (estadoEl) estadoEl.textContent = 'No hay datos válidos de ruta cargados.';
            return;
        }

        const inicioMs = parseTimeToTodayMs(inputInicio?.value);
        const finMs = parseTimeToTodayMs(inputFin?.value);

        if (inicioMs === null || finMs === null || finMs <= inicioMs) {
            stopSimulation();
            if (estadoEl) estadoEl.textContent = 'Revisa que la hora de fin sea mayor a la de inicio.';
            return;
        }

        stopSimulation();

        const tick = () => {
            const ahoraMs = Date.now();
            const progreso = (ahoraMs - inicioMs) / (finMs - inicioMs);
            const pos = getPositionAtProgress(routePoints, routeMetrics, progreso);
            truckMarker.setLatLng(pos);

            if (progreso <= 0) {
                if (estadoEl) estadoEl.textContent = 'En espera de hora de inicio';
            } else if (progreso >= 1) {
                if (estadoEl) estadoEl.textContent = 'Ruta finalizada (100%)';
                stopSimulation();
            } else {
                if (estadoEl) estadoEl.textContent = `En ruta (${Math.round(progreso * 100)}%)`;
            }
        };

        tick();
        if (Date.now() < finMs) {
            intervalId = setInterval(tick, SIMULATION_TICK_MS);
        }
    }

    // Delegación de eventos porque sidebar.html se carga de forma asíncrona
    const sidebarContainer = document.getElementById('sidebar-container') || document;
    sidebarContainer.addEventListener('click', (event) => {
        if (event.target.closest('#btnIniciar')) {
            iniciarSimulacionHorario();
        }
    });
})();
