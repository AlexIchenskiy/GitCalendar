import { useState } from "react";
import ReactDOM from "react-dom";

import "./Modal.scss";

const Modal = ({ title = "", children, isVisible = false }) => {
  const [visible, setVisible] = useState(isVisible);

  const root = document.getElementById("root");

  return ReactDOM.createPortal(
    <div
      className={"modal-wrapper " + (visible ? "opened" : "closed")}
      onClick={() => setVisible(false)}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-info">
          <span>{title}</span>
          <div className="modal-close-button" onClick={() => setVisible(false)}>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>,
    root
  );
};

export default Modal;
