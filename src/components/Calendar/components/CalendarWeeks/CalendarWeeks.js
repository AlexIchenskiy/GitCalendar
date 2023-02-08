import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import useGitCommits from '../../../../hooks/useGitCommits'
import useWindowDimensions from '../../../../hooks/useWindowDimensions'

import './CalendarWeeks.scss'
import './CalendarWeeks.responsive.scss'

import Modal from '../../../Modal'
import useModal from '../../../../hooks/useModal'
import CalendarWeeksDay from './CalendarWeeksDay'

const CalendarWeeks = ({
  username = null,
  repo = '',
  date,
  onStateChanged
}) => {
  const { width, height } = useWindowDimensions()
  const {
    commits = [],
    loading,
    error
  } = useGitCommits(username, repo, date.year(), date.month())

  const weeks = useMemo(() => calculateWeeks(date, commits), [date, commits])

  const [isVisible, setIsVisible, toggle] = useModal()
  const [events, setEvents] = useState([])

  const handleClick = (commitArr) => {
    if (commitArr && commitArr.length > 0) {
      toggle()
      setEvents(commitArr)
    }
  }

  useEffect(() => {
    onStateChanged(loading, error)
  }, [loading, error])

  return (
    <>
      <tbody>
        {weeks.map((week, index) => (
          <tr
            key={index}
            style={{
              height: `calc(100% / ${weeks.length})`
            }}
          >
            {week.map((day, index) => (
              <td
                key={index}
                onClick={() => handleClick(day.commits)}
                className={
                  day.commits && day.commits.length > 0 ? 'clickable' : null
                }
              >
                <CalendarWeeksDay day={day} width={width} height={height} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <Modal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        title={
          events[0]
            ? moment(events[0].commit.author.date).format('YYYY.MM.DD')
            : null
        }
      >
        <div className="modal-commits">
          {events.map((event, index) => (
            <div className="modal-commit" key={index}>
              <a href={event.html_url} target="_blank" rel="noreferrer">
                <span className="modal-commit-title">
                  {event.commit.message}
                </span>
              </a>
              <span className="modal-commit-subtitle">
                {moment(event.commit.author.date).format('HH:mm:ss')}
              </span>
              <span className="modal-commit-description">
                Repo: {event.repository.name}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}

CalendarWeeks.propTypes = {
  username: PropTypes.string,
  repo: PropTypes.string,
  date: PropTypes.instanceOf(moment),
  onStateChanged: PropTypes.func
}

function calculateWeeks (date, commits) {
  const firstDay = moment([date.year(), date.month(), 1])
  const lastDay = moment(firstDay).endOf('month')

  const weeks = []
  let week = []

  // fill first week with values from previous month (if present)
  for (let i = firstDay.isoWeekday() - 1; i > 0; i--) {
    week.unshift({
      value: firstDay.add(i - firstDay.day(), 'days').date(),
      active: false
    })
  }

  // fill other weeks till the end of the month
  for (let i = 1; i <= lastDay.date(); i++) {
    week.push({
      value: i,
      active: true,
      commits: commits.filter(
        (commit) => moment(commit.commit.author.date).date() === i
      )
    })

    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  // fill the last week with remaining values from the next month
  if (week.length > 0) {
    for (let i = week.length; i < 7; i++) {
      week.push({
        value: lastDay.add(week.length - i + 1, 'days').date(),
        active: false
      })
    }

    weeks.push(week)
  }

  return weeks
}

export default CalendarWeeks
