import React from 'react'

import './Home.scss'
import './Home.responsive.scss'

import Calendar from '../../components/Calendar'
import Header from '../../components/Header'

const Home = () => {
  return (
    <section className="home">
      <Header />
      <Calendar />
    </section>
  )
}

export default Home
