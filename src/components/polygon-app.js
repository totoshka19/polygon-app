import {css, html, LitElement} from 'lit';
import { POLYGON_COLORS } from '../constants/colors.js';

export class PolygonApp extends LitElement {
  static properties = {
    polygons: { type: Array },
    bufferPolygons: { type: Array },
    workPolygons: { type: Array },
    colorIndex: { type: Number },
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
    this.bufferPolygons = [];
    this.workPolygons = [];
    this.colorIndex = 0;
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem('polygonAppData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.bufferPolygons = data.bufferPolygons || [];
      this.workPolygons = data.workPolygons || [];
      this.colorIndex = data.colorIndex || 0;
    } else {
      this.bufferPolygons = [];
      this.workPolygons = [];
      this.colorIndex = 0;
    }
  }

  saveToLocalStorage() {
    const dataToSave = {
      bufferPolygons: this.bufferPolygons,
      workPolygons: this.workPolygons,
      colorIndex: this.colorIndex,
    };
    localStorage.setItem('polygonAppData', JSON.stringify(dataToSave));
  }

  resetData() {
    this.bufferPolygons = [];
    this.workPolygons = [];
    this.colorIndex = 0;
    localStorage.removeItem('polygonAppData');
  }

  createPolygons() {
    const count = Math.floor(Math.random() * 16) + 5;
    const newPolygons = Array.from({length: count}, () => this.generateRandomPolygon());
    this.bufferPolygons = newPolygons;
    this.saveToLocalStorage();
  }

  generateRandomPolygon() {
    const vertices = Math.floor(Math.random() * 8) + 3;
    const points = [];

    for (let i = 0; i < vertices; i++) {
      const angle = (i / vertices) * 2 * Math.PI;
      const radius = 20 + Math.random() * 30;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    const color = POLYGON_COLORS[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % POLYGON_COLORS.length;

    return {
      id: Date.now() + Math.random(),
      points: points.join(' '),
      fill: color,
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
        <buffer-zone .polygons=${this.bufferPolygons}></buffer-zone>
        <work-zone .polygons=${this.workPolygons} @polygon-dropped=${this.handlePolygonDropped}></work-zone>
      </div>
    `;
  }

  handlePolygonDropped(event) {
    const droppedPolygon = event.detail;

    const updatedBufferPolygons = this.bufferPolygons.filter(polygon => polygon.id !== droppedPolygon.id);
    this.bufferPolygons = updatedBufferPolygons;

    this.workPolygons = [...this.workPolygons, droppedPolygon];

    this.saveToLocalStorage();
    this.requestUpdate();
  }
}

customElements.define('polygon-app', PolygonApp);
