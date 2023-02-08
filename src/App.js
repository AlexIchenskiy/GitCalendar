import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { UserContextProvider } from './context/UserContext'

import Home from './pages/Home'

function App () {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:date" element={<Home />} />
      </Routes>
    </UserContextProvider>
  )
}

export default App
