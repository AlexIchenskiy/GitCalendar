import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const CalendarWeeksDay = ({ day, width, height }) => {
  return (
    <div className={'table-day ' + (day.active ? 'active' : 'inactive')}>
      <div className="table-day-info">
        <span>{day.value}</span>
        {day.commits && day.commits.length > 1 && width > 768
          ? (
          <span className="table-day-info-more">
            +{day.commits.length - 1} more
          </span>
            )
          : null}
      </div>
      {day.commits && day.commits[0] && width > 587
        ? (
        <div className="table-day-description">
          <span>
            {moment(day.commits[0].commit.author.date).format('HH:mm')}
          </span>
          <span>
            {day.commits[0].commit.message.length >
            (width > 892 ? Math.floor(width / 120) : Math.floor(width / 150))
              ? day.commits[0].commit.message
                .slice(
                  0,
                  width > 1280
                    ? Math.floor(width / 110)
                    : width > 892
                      ? Math.floor(width / 130)
                      : Math.floor(width / 150)
                )
                .trim() + '...'
              : day.commits[0].commit.message}
          </span>
        </div>
          )
        : (
        <div className="table-day-lines">
          {day.commits
            ? day.commits.map((commit, index) =>
              commit && index < Math.floor(height / 120)
                ? (
                  <span key={index} style={{ opacity: 1 - 0.2 * index }}></span>
                  )
                : null
            )
            : null}
        </div>
          )}
    </div>
  )
}

CalendarWeeksDay.propTypes = { day: PropTypes.object, width: PropTypes.number, height: PropTypes.number }

export default CalendarWeeksDay
