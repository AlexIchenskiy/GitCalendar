import React, { useCallback, useState } from 'react'
import useUserContext from '../../hooks/useUserContext'

import './Header.scss'
import './Header.modal.scss'
import './Header.responsive.scss'

import Modal from '../Modal'
import useModal from '../../hooks/useModal'

const Header = () => {
  const [userData, setUserData] = useUserContext()
  const [data, setData] = useState(userData)
  const [isVisible, setIsVisible, toggle] = useModal()

  const handleClose = useCallback(() => {
    setData(userData)
    setIsVisible(false)
  })

  const handleSubmit = (e) => {
    toggle()
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
        <div className="header-edit" onClick={toggle}>
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
