import moment from "moment";
import { useEffect, useState } from "react";

function calculateWeeks(date) {
  const firstDay = moment([date.year(), date.month(), 1]);
  const lastDay = moment(firstDay).endOf("month");

  let weeks = [];
  let week = [];

  for (let i = firstDay.isoWeekday() - 1; i > 0; i--) {
    week.unshift({
      value: firstDay.add("days", i - firstDay.day()).date(),
      active: false,
    });
  }

  for (let i = 1; i <= lastDay.date(); i++) {
    week.push({ value: i, active: true });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length) {
    weeks.push(week);

    for (let i = week.length; i < 7; i++) {
      week.push({
        value: lastDay.add("days", week.length - i + 1).date(),
        active: false,
      });
    }
  }

  return weeks;
}

const CalendarWeeks = (props) => {
  const [weeks, setWeeks] = useState(calculateWeeks(props.date));

  useEffect(() => {
    setWeeks(calculateWeeks(props.date));
  }, [props.date]);

  return (
    <tbody>
      {weeks.map((week, index) => (
        <tr key={index}>
          {week.map((day, index) => (
            <td key={index}>
              <div
                className={"table-day " + (day.active ? "active" : "inactive")}
              >
                {day.value}
              </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default CalendarWeeks;
