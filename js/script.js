/**
 * Lógica principal de la aplicación:
 * - Carga asíncrona del componente sidebar
 * - Alternancia de visibilidad del menú lateral (colapso/expansión)
 * - Redimensionamiento automático del mapa Leaflet (invalidateSize)
 */
document.addEventListener('DOMContentLoaded', () => {
  const sidebarContainer = document.getElementById('sidebar-container');
  const collapseBtn = document.getElementById('sidebarCollapse');

  /**
   * Alterna el estado activo del sidebar y redimensiona el mapa
   */
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.classList.toggle('active');

    // En Leaflet, cuando el contenedor cambia de dimensiones (300ms de transición CSS),
    // se debe invocar map.invalidateSize() para que reacomode las teselas sin áreas vacías
    if (window.mapInstance && typeof window.mapInstance.invalidateSize === 'function') {
      setTimeout(() => {
        window.mapInstance.invalidateSize();
      }, 310);
    }
  }

  /**
   * Configura los oyentes de eventos del menú lateral
   */
  function setupSidebarEvents() {
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
      });
    }

    // En pantallas pequeñas, cerrar el menú al hacer clic sobre el contenido principal
    const content = document.getElementById('content');
    if (content) {
      content.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('active')) {
          toggleSidebar();
        }
      });
    }
  }

  // Carga modular del componente sidebar
  if (sidebarContainer) {
    fetch('sidebar.html')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} al cargar sidebar.html`);
        }
        return response.text();
      })
      .then((html) => {
        sidebarContainer.innerHTML = html;
        setupSidebarEvents();
      })
      .catch((error) => {
        console.warn(
          'No se pudo cargar sidebar.html dinámicamente (requiere servidor web local si se usa file://):',
          error
        );
        setupSidebarEvents();
      });
  }
});
