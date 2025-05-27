import { LitElement, html, css } from 'lit';

export class BufferZone extends LitElement {
  static properties = {
    polygons: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 20px;
      min-height: 200px;
    }

    .polygon-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    polygon {
      cursor: move;
      transition: transform 0.2s;
    }

    polygon:hover {
      transform: scale(1.05);
    }
  `;

  constructor() {
    super();
    this.polygons = [];
  }

  render() {
    return html`
      <div class="polygon-container">
        ${this.polygons.map(polygon => html`
          <svg width="100" height="100" viewBox="0 0 100 100">
            <polygon
              points=${polygon.points}
              fill=${polygon.fill}
              draggable="true"
              @dragstart=${(e) => this.handleDragStart(e, polygon)}
            ></polygon>
          </svg>
        `)}
      </div>
    `;
  }

  handleDragStart(e, polygon) {
    e.dataTransfer.setData('application/json', JSON.stringify(polygon));
    e.dataTransfer.effectAllowed = 'move';
  }
}

customElements.define('buffer-zone', BufferZone);
