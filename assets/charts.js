// Lightweight charts helper for The Grid rules pages
// Uses Chart.js via CDN. Provides themed defaults and simple renderers.

(function(){
  function getTheme() {
    const s = getComputedStyle(document.documentElement);
    const paper = s.getPropertyValue('--paper').trim() || '#f0eded';
    const muted = s.getPropertyValue('--muted').trim() || 'rgba(240,237,237,0.6)';
    const accent1 = s.getPropertyValue('--accent1').trim() || '#00ff80';
    const accent2 = s.getPropertyValue('--accent2').trim() || '#00cc66';
    const accent3 = s.getPropertyValue('--accent3').trim() || '#00994d';
    const glass = s.getPropertyValue('--glass').trim() || 'rgba(0,255,128,0.1)';
    return { paper, muted, accent1, accent2, accent3, glass };
  }

  function applyDefaults() {
    if (!window.Chart) return;
    const t = getTheme();
    Chart.defaults.color = t.paper;
    Chart.defaults.font.family = 'Inter, system-ui, Roboto, sans-serif';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';
    Chart.defaults.plugins.legend.labels.color = t.muted;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0,0,0,0.7)';
    Chart.defaults.plugins.tooltip.titleColor = '#fff';
    Chart.defaults.plugins.tooltip.bodyColor = '#ddd';
  }

  function renderDoughnutChart(canvasId, labels, values, colors) {
    if (!window.Chart) return;
    const t = getTheme();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const palette = colors && colors.length ? colors : [t.accent1, t.accent2, t.accent3, '#4b76b4', '#8e44ad'];
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: palette.slice(0, values.length),
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true }
        },
        cutout: '60%'
      }
    });
  }

  function renderPieChart(canvasId, labels, values, colors) {
    if (!window.Chart) return;
    const t = getTheme();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const palette = colors && colors.length ? colors : [t.accent1, t.accent2, t.accent3, '#4b76b4', '#8e44ad'];
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: palette.slice(0, values.length),
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  function renderPolarAreaChart(canvasId, labels, values, colors) {
    if (!window.Chart) return;
    const t = getTheme();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const palette = colors && colors.length ? colors : [t.accent1, t.accent2, t.accent3, '#4b76b4', '#8e44ad'];
    new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: palette.slice(0, values.length),
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  function renderRadarChart(canvasId, labels, values, color) {
    if (!window.Chart) return;
    const t = getTheme();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Score Weight',
          data: values,
          backgroundColor: (color || t.accent1) + '33',
          borderColor: (color || t.accent1),
          pointBackgroundColor: (color || t.accent1),
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.08)' },
            angleLines: { color: 'rgba(255,255,255,0.08)' },
            ticks: { showLabelBackdrop: false }
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  function renderBarChart(canvasId, labels, values, color) {
    if (!window.Chart) return;
    const t = getTheme();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Count',
          data: values,
          backgroundColor: (color || t.accent1),
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { precision: 0 } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  // expose helpers
  window.GridCharts = {
    applyDefaults,
    renderDoughnutChart,
    renderPieChart,
    renderPolarAreaChart,
    renderRadarChart,
    renderBarChart,
  };

  // auto-apply defaults when DOM ready
  document.addEventListener('DOMContentLoaded', applyDefaults);
})();