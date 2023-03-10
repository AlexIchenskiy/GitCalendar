import { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import objectToQueryString from '../util/objectToQueryString'

const useGitCommits = (user, repo = '', year, month) => {
  const queryString = useMemo(
    () => calculateQueryString(user, repo, year, month),
    [user, repo, year, month]
  )
  const [commits, setCommits] = useState([])
  const [loading, setLoading] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCancel(false)
    setLoading(true)

    const controller = new AbortController()
    let currCommits = []
    setCommits([])

    const getCommits = async (page = 1) => {
      let hasMore = true
      if (!hasMore) {
        return
      }

      try {
        const res = await fetch(
          `https://api.github.com/search/commits?q=${queryString}&per_page=100&page=${page}`,
          { signal: controller.signal }
        )

        if (!res.ok) {
          setError(res.status)
          throw new Error(res.status)
        }

        const data = (await res.json()).items
        if (!data || data.length === 0) {
          hasMore = false
          setLoading(false)
          return
        }

        currCommits = sortByCommitDate([...currCommits, ...data])
        setCommits(() => currCommits)

        // if there are more commits on less than 8 pages (API limits)
        // get commits from the next page
        const linkHeader = res.headers.get('Link')
        if (linkHeader && linkHeader.match(/<(.*?)>; rel="next"/) && page < 8) {
          getCommits(++page)
        } else {
          if (!cancel) {
            currCommits = sortByCommitDate(currCommits)
            setCommits(currCommits)
            hasMore = false
            setError(null)
            setLoading(false)
          }
        }
      } catch (e) {
        if (!cancel) {
          setError(e)
          setLoading(true)
          // try again after 5 seconds if too many requests
          if (e.message === '403') {
            setTimeout(() => getCommits(page), 5000)
          }
        }
      }
    }

    if (user.length > 0) {
      getCommits()
    } else {
      setCommits([])
      setError(new Error(422))
      setLoading(false)
    }

    return () => {
      setCancel(true)
      controller.abort()
    }
  }, [queryString])

  return { commits, loading, error }
}

const calculateQueryString = (user, repo, year, month) => {
  const username = user
  const date = moment().year(year).month(month)
  const since = date.startOf('month').format('YYYY-MM-DD')
  const until = date.endOf('month').format('YYYY-MM-DD')

  const params = {
    author: username,
    'committer-date': since + '..' + until
  }

  if (repo.length > 3) {
    params.repo = repo
  }

  return objectToQueryString(params)
}

const sortByCommitDate = (arr) => {
  return arr.sort(
    (comm1, comm2) =>
      moment(comm1.commit.author.date) -
      moment(comm2.commit.author.date)
  )
}

export default useGitCommits
