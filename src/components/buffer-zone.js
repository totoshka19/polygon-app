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

    .polygon-wrapper {
      cursor: pointer;
      transition: transform 0.2s;
      user-select: none;
    }

    .polygon-wrapper:hover {
      transform: scale(1.05);
    }

    .polygon-wrapper:active {
      cursor: grabbing;
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
          <div class="polygon-wrapper" draggable="true"
               @dragstart=${(e) => this.handleDragStart(e, polygon)}
               @dragend=${(e) => this.handleDragEnd(e)}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <polygon
                points=${polygon.points}
                fill=${polygon.fill}
              ></polygon>
            </svg>
          </div>
        `)}
      </div>
    `;
  }

  handleDragStart(e, polygon) {
    e.dataTransfer.setData('application/json', JSON.stringify(polygon));
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  }

  handleDragEnd(e) {
    e.target.style.opacity = '1';
  }
}

customElements.define('buffer-zone', BufferZone);
