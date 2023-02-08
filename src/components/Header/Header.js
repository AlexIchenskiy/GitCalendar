import React, { useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext'

import './Header.scss'
import './Header.modal.scss'
import './Header.responsive.scss'

import Modal from '../Modal'

const Header = () => {
  const [userData, setUserData] = useContext(UserContext)
  const [data, setData] = useState(userData)
  const [isVisible, setIsVisible] = useState(false)

  const handleClick = () => {
    setIsVisible(true)
  }

  const handleClose = () => {
    setData(userData)
    setIsVisible(false)
  }

  const handleSubmit = (e) => {
    setIsVisible(false)
    e.preventDefault()
    setUserData({
      ...userData,
      username: data.username,
      repo: data.repo
    })
  }

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
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              placeholder="Username"
            />
            <button type="submit" className="button-accept">
              <span>&#10003;</span>
            </button>
          </form>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={data.repo}
              onChange={(e) => setData({ ...data, repo: e.target.value })}
              placeholder="Username/Repo"
            />
            <button type="submit" className="button-accept">
              <span>&#10003;</span>
            </button>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default Header
