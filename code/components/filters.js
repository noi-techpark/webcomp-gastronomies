import { html } from "lit-element";
import { t } from "../translations";
import { STATE_DEFAULT_FILTERS } from "../utils";
import iconChevronUp from "../assets/chevron-up.svg";
import iconChevronDown from "../assets/chevron-down.svg";

export function render_filters(categories) {
  let filtersNumber = 0;
  if (this.filters.categories.length) {
    filtersNumber = filtersNumber + 1;
  }

  return html` <div class="filters">
    <div class="header">
      <wc-sidemodal-header
        type="filter"
        .fTitle="${filtersNumber ? filtersNumber : ""} ${t["filters"][
          this.language
        ]}"
        .fCancelFiltersText="${t["cancelFilters"][this.language]}"
        .fCancelFiltersAction="${() => {
          this.filters = STATE_DEFAULT_FILTERS;
        }}"
        .closeModalAction="${() => {
          this.filtersOpen = false;
        }}"
      ></wc-sidemodal-header>
    </div>
    <div>
      <wc-divider></wc-divider>
    </div>
    <div>
      <div>
        <p
          class="caption"
          @click="${() => {
            this.filtersAccordionOpen = {
              ...this.filtersAccordionOpen,
              category: !this.filtersAccordionOpen["category"],
            };
          }}"
        >
          ${t["category"][this.language]}
          <span
            >${this.filtersAccordionOpen["category"]
              ? html`<img src="${iconChevronDown}" alt="" />`
              : html`<img src="${iconChevronUp}" alt="" />`}</span
          >
        </p>
        ${this.filtersAccordionOpen["category"]
          ? html`<div class="options_container">
              ${this.categories.map((category) => {
                return html`<wc-checkbox
                  .value="${this.filters.categories.includes(category)}"
                  .action="${() => {
                    if (this.filters.categories.includes(category)) {
                      this.filters = {
                        ...this.filters,
                        categories: this.filters.categories.filter(
                          (c) => c !== category
                        ),
                      };
                    } else {
                      this.filters = {
                        ...this.filters,
                        categories: [...this.filters.categories, category],
                      };
                    }
                  }}"
                  .label="${category}"
                  .name="availability"
                ></wc-checkbox>`;
              })}
            </div>`
          : null}
      </div>
    </div>
  </div>`;
}
