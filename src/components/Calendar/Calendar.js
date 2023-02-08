import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment/moment'
import useUserContext from '../../hooks/useUserContext'
import errors from '../../data/errors.json'

import './Calendar.scss'
import './Calendar.responsive.scss'

import CalendarDays from './components/CalendarDays'
import CalendarWeeks from './components/CalendarWeeks'

const Calendar = () => {
  const { date: selectedDate } = useParams()
  const navigate = useNavigate()
  const [userData] = useUserContext()

  const date = useMemo(() => calculateDate(selectedDate), [selectedDate])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleState = useCallback((loading, error) => {
    setLoading(loading)
    setError(error)
  })

  useEffect(() => {
    navigate(`/${date.format('YYYY-MM')}`)
  }, [date])

  const handleMonthChange = (amount) => {
    navigate(`/${date.add(amount, 'months').format('YYYY-MM')}`)
  }

  return (
    <div className="calendar">
      <div className="calendar-info">
        <div className="calendar-info-state">
          <span>
            {error ? <>&#9888;</> : (loading ? <>&#8635;</> : <>&#10003;</>)}
          </span>
          <span className="calendar-info-state-hover">
            {error ? errors[error.message] || error.message : (loading ? 'Loading...' : 'Loaded!')}
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
