import { css, html, LitElement, unsafeCSS } from 'lit-element';
import XBlackIcon from '../assets/x-black.svg';
import style from './sideModalRow.scss';

export const SIDE_MODAL_ROW_TYPES = { horizontal: 'horizontal', vertical: 'vertical' };

export class SideModalRow extends LitElement {
  constructor() {
    super();

    this.type = SIDE_MODAL_ROW_TYPES.horizontal;
    this.title = '--';
    this.text = '--';
  }

  static get styles() {
    return css`
      ${unsafeCSS(style)}
    `;
  }

  static get properties() {
    return {
      type: { type: String },
      title: { type: String },
      text: { type: String }
    };
  }

  render() {
    return html`<div class="sideModalRow ${this.type ? this.type : ''}">
      <div><p class="sideModalRow__title">${this.title}</p></div>
      <div><p class="sideModalRow__text">${this.text}</p></div>
    </div>`;
  }
}

customElements.get('wc-sidemodal-row') || customElements.define('wc-sidemodal-row', SideModalRow);
