import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment/moment'
import useUserContext from '../../hooks/useUserContext'

import './Calendar.scss'
import './Calendar.responsive.scss'

import CalendarDays from './components/CalendarDays'
import CalendarWeeks from './components/CalendarWeeks'

const Calendar = () => {
  const { date: selectedDate } = useParams()
  const navigate = useNavigate()
  const [userData] = useUserContext()

  const [date, setDate] = useState(calculateDate(selectedDate))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleState = useCallback((loading, error) => {
    setLoading(loading)
    setError(error)
  })

  useEffect(() => {
    const newDate = calculateDate(selectedDate)
    setDate(newDate)
    navigate(`/${newDate.format('YYYY-MM')}`)
  }, [selectedDate, navigate])

  const handleMonthChange = (amount) => {
    const newDate = date
    newDate.add(amount, 'months')
    navigate(`/${newDate.format('YYYY-MM')}`)
  }

  return (
    <div className="calendar">
      <div className="calendar-info">
        <div className="calendar-info-state">
          <span>
            {error ? <>&#9888;</> : loading ? <>&#8635;</> : <>&#10003;</>}
          </span>
        </div>
        <div className="calendar-info-date">
          <div className="button left" onClick={() => handleMonthChange(-1)}>
            <div></div>
          </div>
          <div className="date-wrapper">
            <span>{date.format('MMMM')}</span>
            <span>{date.format('YYYY')}</span>
          </div>
          <div className="button right" onClick={() => handleMonthChange(1)}>
            <div></div>
          </div>
        </div>
      </div>
      <div className="calendar-table">
        <table>
          <CalendarDays />
          <CalendarWeeks
            date={date}
            username={userData.username}
            repo={userData.repo}
            onStateChanged={handleState}
          />
        </table>
      </div>
    </div>
  )
}

function calculateDate (date) {
  return moment(date).isValid() ? moment(date) : moment()
}

export default Calendar
