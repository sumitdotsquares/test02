/** @jsx jsx */
import { jsx } from "@emotion/core";

export default function NavButton({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      css={{
        border: "1px solid #929598",
        background: "transparent",
        padding: "8px",
        fontSize: "12px"
      }}
    >
      {children}
    </button>
  );
}
