import React, { useEffect, useMemo, useState } from 'react'

import useWindowDimensions from '../../../../hooks/useWindowDimensions'

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

const CalendarDays = () => {
  const { width } = useWindowDimensions()

  const [days, setDays] = useState(daysarr)
  const memoDays = useMemo(() => calculateDays(width), [width])

  useEffect(() => {
    setDays(memoDays)
  }, [memoDays])

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

export default CalendarDays
