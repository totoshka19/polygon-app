import { LitElement, html, css } from 'lit';

export class PolygonApp extends LitElement {
  static properties = {
    polygons: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: 100vh;
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #45a049;
    }
  `;

  constructor() {
    super();
    this.polygons = [];
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const savedPolygons = localStorage.getItem('polygons');
    if (savedPolygons) {
      this.polygons = JSON.parse(savedPolygons);
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('polygons', JSON.stringify(this.polygons));
  }

  resetData() {
    this.polygons = [];
    localStorage.removeItem('polygons');
  }

  createPolygons() {
    const count = Math.floor(Math.random() * 16) + 5; // Random number between 5 and 20
    const newPolygons = Array.from({ length: count }, () => this.generateRandomPolygon());
    this.polygons = [...this.polygons, ...newPolygons];
    this.saveToLocalStorage();
  }

  generateRandomPolygon() {
    const vertices = Math.floor(Math.random() * 8) + 3; // Random number of vertices between 3 and 10
    const points = [];

    for (let i = 0; i < vertices; i++) {
      const angle = (i / vertices) * 2 * Math.PI;
      const radius = 20 + Math.random() * 30;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    return {
      id: Date.now() + Math.random(),
      points: points.join(' '),
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
  }

  render() {
    return html`
      <div class="container">
        <div class="controls">
          <button @click=${this.createPolygons}>Создать</button>
          <button @click=${this.saveToLocalStorage}>Сохранить</button>
          <button @click=${this.resetData}>Сбросить</button>
        </div>
        <buffer-zone .polygons=${this.polygons}></buffer-zone>
        <work-zone .polygons=${this.polygons}></work-zone>
      </div>
    `;
  }
}

customElements.define('polygon-app', PolygonApp);
