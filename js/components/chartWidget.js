/**
 * DwelloCrew 2.0 — Analytical SVG Charts Generator for Admin Console
 */

export class ChartWidget {
  static renderRevenueLineChart(dataPoints = [1200, 2400, 3100, 4800, 6200, 8900, 11400]) {
    const width = 600;
    const height = 200;
    const padding = 30;

    const maxVal = Math.max(...dataPoints, 10000);
    const minVal = 0;

    const points = dataPoints.map((val, idx) => {
      const x = padding + (idx * ((width - 2 * padding) / (dataPoints.length - 1)));
      const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    return `
      <div class="chart-wrapper glass-panel">
        <div class="chart-header">
          <h4>Platform Revenue Trend (6 Months)</h4>
          <span class="chart-stat-badge">+28.4% YoY</span>
        </div>
        <svg viewBox="0 0 ${width} ${height}" class="svg-chart">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <!-- Grid Lines -->
          <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.05)" />
          <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="rgba(255,255,255,0.05)" />
          <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.1)" />

          <!-- Filled Area -->
          <polygon points="${areaPoints}" fill="url(#chartGrad)" />

          <!-- Trend Line -->
          <polyline points="${points}" fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" />

          <!-- Point Markers -->
          ${dataPoints.map((val, idx) => {
            const x = padding + (idx * ((width - 2 * padding) / (dataPoints.length - 1)));
            const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
            return `<circle cx="${x}" cy="${y}" r="4" fill="#0F172A" stroke="#38BDF8" stroke-width="2"><title>$${val}</title></circle>`;
          }).join('')}
        </svg>
      </div>
    `;
  }

  static renderCategoryBarChart(categories = [
    { name: 'Repairs', count: 184, color: '#38BDF8' },
    { name: 'Salon & Spa', count: 142, color: '#F472B6' },
    { name: 'Pet Care', count: 98, color: '#34D399' },
    { name: 'Tutoring', count: 76, color: '#FBBF24' }
  ]) {
    const maxCount = Math.max(...categories.map(c => c.count));

    return `
      <div class="chart-wrapper glass-panel">
        <div class="chart-header">
          <h4>Completed Services by Category</h4>
          <span class="chart-stat-badge">Total: 500</span>
        </div>
        <div class="bar-chart-list">
          ${categories.map(cat => {
            const widthPercent = Math.round((cat.count / maxCount) * 100);
            return `
              <div class="bar-row">
                <div class="bar-label">${cat.name}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width: ${widthPercent}%; background: ${cat.color};"></div>
                </div>
                <div class="bar-val">${cat.count}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}
