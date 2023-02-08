import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import useGitCommits from '../../../../hooks/useGitCommits'
import useWindowDimensions from '../../../../hooks/useWindowDimensions'

import './CalendarWeeks.scss'

import Modal from '../../../Modal'

function calculateWeeks (date, commits) {
  const firstDay = moment([date.year(), date.month(), 1])
  const lastDay = moment(firstDay).endOf('month')

  const weeks = []
  let week = []

  for (let i = firstDay.isoWeekday() - 1; i > 0; i--) {
    week.unshift({
      value: firstDay.add(i - firstDay.day(), 'days').date(),
      active: false
    })
  }

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

  if (week.length) {
    weeks.push(week)

    for (let i = week.length; i < 7; i++) {
      week.push({
        value: lastDay.add(week.length - i + 1, 'days').date(),
        active: false
      })
    }
  }

  return weeks
}

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

  const memoWeeks = useMemo(
    () => calculateWeeks(date, commits),
    [date, commits]
  )

  const [weeks, setWeeks] = useState(memoWeeks)
  const [isVisible, setIsVisible] = useState(false)
  const [events, setEvents] = useState([])

  const handleClick = (commitArr) => {
    if (commitArr && commitArr.length > 0) {
      setIsVisible(true)
      setEvents(commitArr)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    setWeeks(memoWeeks)
  }, [memoWeeks])

  useEffect(() => {
    onStateChanged(loading, error)
  }, [loading, error, onStateChanged])

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
                <div
                  className={
                    'table-day ' + (day.active ? 'active' : 'inactive')
                  }
                >
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
                        {moment(day.commits[0].commit.author.date).format(
                          'HH:mm'
                        )}
                      </span>
                      <span>
                        {day.commits[0].commit.message.length >
                        (width > 892
                          ? Math.floor(width / 120)
                          : Math.floor(width / 150))
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
                              <span
                                key={index}
                                style={{ opacity: 1 - 0.2 * index }}
                              ></span>
                              )
                            : null
                        )
                        : null}
                    </div>
                      )}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <Modal
        isVisible={isVisible}
        onClose={handleClose}
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

export default CalendarWeeks
