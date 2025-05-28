import { LitElement, html, css } from 'lit';

export class WorkZone extends LitElement {
  static properties = {
    polygons: { type: Array },
    scale: { type: Number },
    offsetX: { type: Number },
    offsetY: { type: Number },
    isDragging: { type: Boolean },
    errorMessage: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 20px 50px 50px 50px;
      min-height: 400px;
      position: relative;
      overflow: visible;
    }

    .error-message {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #ff5252;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .work-area {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 400px;
    }

    .grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .axis {
      position: absolute;
      background-color: #ddd;
    }

    .axis-x {
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
    }

    .axis-y {
      top: 0;
      left: 0;
      width: 1px;
      height: 100%;
    }

    .scale-marks {
      position: absolute;
      color: #666;
      font-size: 12px;
    }

    .scale-marks-x {
      position: absolute;
      bottom: -25px;
      transform: translateX(-50%);
    }

    .scale-marks-y {
      left: -25px;
    }

    .polygon-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-origin: 0 0;
    }
  `;

  constructor() {
    super();
    this.polygons = [];
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;
    this.errorMessage = '';
  }

  firstUpdated() {
    this.workArea = this.shadowRoot.querySelector('.work-area');
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.workArea.addEventListener('wheel', this.handleWheel.bind(this));
    this.workArea.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.workArea.addEventListener('dragover', this.handleDragOver.bind(this));
    this.workArea.addEventListener('drop', this.handleDrop.bind(this));
    this.workArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
  }

  handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    this.scale = Math.max(0.1, Math.min(5, this.scale * delta));
    this.requestUpdate();
  }

  handleMouseDown(e) {
    if (e.button === 0) {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }
  }

  handleMouseMove(e) {
    if (this.isDragging) {
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.offsetX += dx;
      this.offsetY += dy;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.requestUpdate();
    }
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  showError(message) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  handleDrop(e) {
    e.preventDefault();

    try {
      const polygonData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = this.workArea.getBoundingClientRect();

      const x = (e.clientX - rect.left - this.offsetX) / this.scale;
      const y = (e.clientY - rect.top - this.offsetY) / this.scale;

      const newPolygon = {
        ...polygonData,
        x,
        y,
      };

      this.dispatchEvent(new CustomEvent('polygon-dropped', {
        detail: newPolygon,
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      this.showError('Ошибка при добавлении полигона');
    }
  }

  handleDragLeave(e) {
    e.preventDefault();
  }

  renderScaleMarks() {
    const marks = [];
    const step = 50 * this.scale;
    const startX = Math.floor(this.offsetX / step) * step;
    const startY = Math.floor(this.offsetY / step) * step;
    const height = this.workArea?.clientHeight || 400;
    const width = this.workArea?.clientWidth || 1500;

    const tolerance = 10;

    for (let x = startX; x < startX + width + step; x += step) {
      const value = Math.round(x / this.scale);
      const markLeft = x - this.offsetX;

      const isVisible = markLeft > -tolerance && markLeft < width + tolerance;

      if (!isVisible && !(value === 0 && Math.round((height - this.offsetY) / this.scale) === 0)) {
         continue;
      }

      if (value === 0 && Math.round((height - this.offsetY) / this.scale) === 0) {
         continue;
      }

      marks.push(html`
        <div class="scale-marks scale-marks-x" style="left: ${markLeft}px;">
          ${value}
        </div>
      `);
    }

    for (let y = startY; y < startY + height + step; y += step) {
      const value = Math.round((height - (y - this.offsetY)) / this.scale);
       if (value === 0 && Math.round(-this.offsetX / this.scale) === 0) {
        continue;
      }
      marks.push(html`
        <div class="scale-marks scale-marks-y" style="top: ${y - this.offsetY}px">
          ${value}
        </div>
      `);
    }

     const zeroLeft = -this.offsetX;
     const zeroTop = height - this.offsetY;
     const isZeroVisible = zeroLeft > -tolerance && zeroLeft < width + tolerance &&
                           zeroTop > -tolerance && zeroTop < height + tolerance;

     if (Math.round(-this.offsetX / this.scale) === 0 && Math.round((height - this.offsetY) / this.scale) === 0 && isZeroVisible) {
       marks.push(html`
         <div class="scale-marks" style="left: ${zeroLeft}px; top: ${zeroTop}px;">
           0
         </div>
       `);
     }

    return marks;
  }

  render() {
    return html`
      ${this.errorMessage ? html`
        <div class="error-message">
          ${this.errorMessage}
        </div>
      ` : ''}
      <div class="work-area">
        <div class="grid">
          <div class="axis axis-x"></div>
          <div class="axis axis-y"></div>
          ${this.renderScaleMarks()}
        </div>
        <div class="polygon-container" style="transform: translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})">
          ${this.polygons.map(polygon => html`
            <svg width="100" height="100" viewBox="0 0 100 100" style="position: absolute; left: ${polygon.x || 0}px; top: ${polygon.y || 0}px">
              <polygon
                points=${polygon.points}
                fill=${polygon.fill}
              ></polygon>
            </svg>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('work-zone', WorkZone);
