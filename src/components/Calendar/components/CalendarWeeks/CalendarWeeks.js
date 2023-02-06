import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import useGitCommits from "../../../../hooks/useGitCommits";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";

function calculateWeeks(date, commits) {
  const firstDay = moment([date.year(), date.month(), 1]);
  const lastDay = moment(firstDay).endOf("month");

  let weeks = [];
  let week = [];

  for (let i = firstDay.isoWeekday() - 1; i > 0; i--) {
    week.unshift({
      value: firstDay.add(i - firstDay.day(), "days").date(),
      active: false,
    });
  }

  for (let i = 1; i <= lastDay.date(); i++) {
    week.push({
      value: i,
      active: true,
      commits: commits.filter(
        (commit) => moment(commit.commit.author.date).date() === i
      ),
    });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length) {
    weeks.push(week);

    for (let i = week.length; i < 7; i++) {
      week.push({
        value: lastDay.add(week.length - i + 1, "days").date(),
        active: false,
      });
    }
  }

  return weeks;
}

const CalendarWeeks = (props) => {
  const { loading, commits } = useGitCommits(
    props.username || null,
    props.date.year(),
    props.date.month()
  );
  const memoWeeks = useMemo(
    () => calculateWeeks(props.date, loading ? [] : commits),
    [props.date, commits, loading]
  );
  const [weeks, setWeeks] = useState(memoWeeks);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    setWeeks(memoWeeks);
  }, [memoWeeks]);

  return (
    <tbody>
      {weeks.map((week, index) => (
        <tr
          key={index}
          style={{
            height: `calc(100% / ${weeks.length})`,
          }}
        >
          {week.map((day, index) => (
            <td key={index}>
              <div
                className={"table-day " + (day.active ? "active" : "inactive")}
              >
                <div className="table-day-info">
                  <span>{day.value}</span>
                  {day.commits && day.commits.length > 1 && width > 768 ? (
                    <span className="table-day-info-more">
                      +{day.commits.length - 1} more
                    </span>
                  ) : null}
                </div>
                {day.commits && day.commits[0] && width > 587 ? (
                  <div className="table-day-description">
                    <span>
                      {moment(day.commits[0].commit.author.date).format(
                        "HH:mm"
                      )}
                    </span>
                    <span>
                      {day.commits[0].commit.message
                        .slice(
                          0,
                          width > 892
                            ? Math.floor(width / 120)
                            : Math.floor(width / 150)
                        )
                        .trim() + "..."}
                    </span>
                  </div>
                ) : (
                  <div className="table-day-lines">
                    {day.commits
                      ? day.commits.map((commit, index) =>
                          commit && index < Math.floor(height / 120) ? (
                            <span
                              key={index}
                              style={{ opacity: 1 - 0.2 * index }}
                            ></span>
                          ) : null
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
  );
};

export default CalendarWeeks;
