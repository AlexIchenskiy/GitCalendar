import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

const UserContext = createContext()

const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    username: 'AlexIchenskiy',
    repo: ''
  })

  return (
    <UserContext.Provider value={[userData, setUserData]}>
      {children}
    </UserContext.Provider>
  )
}

UserContextProvider.propTypes = {
  children: PropTypes.node
}

export { UserContext, UserContextProvider }
