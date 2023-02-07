import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./Modal.scss";

const Modal = ({ title = "", children, isVisible, onClose }) => {
  const [visible, setVisible] = useState(isVisible);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  const root = document.getElementById("root");

  return ReactDOM.createPortal(
    <div
      className={"modal-wrapper " + (visible ? "opened" : "closed")}
      onClick={() => handleClose()}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-info">
          <span>{title}</span>
          <div className="modal-close-button" onClick={() => handleClose()}>
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
