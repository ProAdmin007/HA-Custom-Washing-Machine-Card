import { css } from "lit";

// All visual decisions live behind --wmc-* custom properties so a future
// restyle (once a reference design is available) is a CSS-only change.
export const cardStyles = css`
  :host {
    --wmc-icon-size: 40px;
    --wmc-text-color: var(--primary-text-color);
    --wmc-secondary-color: var(--secondary-text-color);
    --wmc-row-gap: 12px;
  }

  ha-card {
    padding: 16px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: var(--wmc-row-gap);
  }

  .header ha-icon {
    --mdc-icon-size: var(--wmc-icon-size);
    color: var(--wmc-status-color, var(--wmc-secondary-color));
  }

  .header-text {
    display: flex;
    flex-direction: column;
  }

  .name {
    font-size: 16px;
    font-weight: 500;
    color: var(--wmc-text-color);
  }

  .status-label {
    font-size: 14px;
    color: var(--wmc-status-color, var(--wmc-secondary-color));
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--wmc-text-color);
  }

  .row ha-icon {
    --mdc-icon-size: 20px;
    color: var(--wmc-secondary-color);
  }

  .row .value {
    margin-left: auto;
    color: var(--wmc-secondary-color);
  }

  .progress-outer {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: var(--divider-color, #e0e0e0);
    overflow: hidden;
    margin-top: 4px;
  }

  .progress-inner {
    height: 100%;
    background: var(--wmc-status-color, var(--primary-color));
    transition: width 0.4s ease;
  }
`;
