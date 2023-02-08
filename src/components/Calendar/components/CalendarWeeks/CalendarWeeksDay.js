import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const CalendarWeeksDay = ({ day, width, height }) => {
  return (
    <div className={'table-day ' + (day.active ? 'active' : 'inactive')}>
      <div className="table-day-info">
        <span>{day.value}</span>
        {day.commits && day.commits.length > 1 && width > 768 && (
          <span className="table-day-info-more">
            +{day.commits.length - 1} more
          </span>
        )}
      </div>
      {day.commits &&
        day.commits[0] &&
        (width > 587
          ? (
          <div className="table-day-description">
            <span>
              {moment(day.commits[0].commit.author.date).format('HH:mm')}
            </span>
            <span>
              {sliceMessageByWidth(day.commits[0].commit.message, width)}
            </span>
          </div>
            )
          : (
          <div className="table-day-lines">
            {day.commits.map(
              (commit, index) =>
                index < Math.floor(height / 120) && (
                  <span key={index} style={{ opacity: 1 - 0.2 * index }}></span>
                )
            )}
          </div>
            ))}
    </div>
  )
}

CalendarWeeksDay.propTypes = {
  day: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number
}

const sliceMessageByWidth = (message, width) => {
  // magic number to shorten the message
  let cutBy = 160
  if (width > 892) {
    if (width > 1280) {
      cutBy = 105
    } else {
      cutBy = 130
    }
  }

  // if the message is already short enough, return it
  if (message.length <= Math.floor(width / cutBy)) {
    return message
  }

  return message.slice(0, Math.floor(width / cutBy)).trim() + '...'
}

export default CalendarWeeksDay
