import { useState, useContext } from "react";

import Modal from "../Modal";

import "./Header.scss";
import "./Header.modal.scss";
import "./Header.responsive.scss";
import { UserContext } from "../../context/UserContext";

const Header = () => {
  const [userData, setUserData] = useContext(UserContext);
  const [username, setUsername] = useState(userData.username);
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(true);
  };

  const handleClose = () => {
    setUsername(userData.username);
    setIsVisible(false);
  };

  const handleSubmit = (e) => {
    setIsVisible(false);
    e.preventDefault();
    setUserData({
      ...userData,
      username: username,
    });
  };

  return (
    <>
      <header>
        <h1>GitCalendar</h1>
        <div className="header-edit" onClick={() => handleClick()}>
          <span>&#9998; Edit user data</span>
        </div>
      </header>
      <Modal isVisible={isVisible} onClose={handleClose} title="Edit user data">
        <div className="modal-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <button type="submit" className="button-accept">
              <span>&#10003;</span>
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Header;
