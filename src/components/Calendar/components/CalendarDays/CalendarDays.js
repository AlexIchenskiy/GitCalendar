import React, { useMemo } from 'react'
import useWindowDimensions from '../../../../hooks/useWindowDimensions'

const CalendarDays = () => {
  const { width } = useWindowDimensions()

  const days = useMemo(() => calculateDays(width), [width])

  return (
    <>
      <thead>
        <tr>
          {days.map((day) => (
            <th key={day}>{day.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
    </>
  )
}

const daysarr = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

function calculateDays (width) {
  if (width < 992) {
    const newDays = daysarr.map((el) => {
      return el.slice(0, 3)
    })
    return newDays
  } else {
    return daysarr
  }
}

export default CalendarDays
