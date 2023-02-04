import "./Calendar.scss";
import "./Calendar.responsive.scss";

import { useNavigate, useParams } from "react-router-dom";
import moment from "moment/moment";
import { useEffect, useState } from "react";

import CalendarDays from "./components/CalendarDays";
import CalendarWeeks from "./components/CalendarWeeks";

function calculateDate(date) {
  return moment(date).isValid() ? moment(date) : moment();
}

const Calendar = () => {
  const { date: selectedDate } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(calculateDate(selectedDate));

  useEffect(() => {
    const newDate = calculateDate(selectedDate);
    setDate(newDate);
    navigate(`/${newDate.format("YYYY-MM")}`);
  }, [selectedDate, navigate]);

  const handleMonthChange = (amount) => {
    const newDate = date;
    newDate.add(amount, "months");
    navigate(`/${newDate.format("YYYY-MM")}`);
  };

  return (
    <div className="calendar">
      <div className="calendar-info">
        <div className="calendar-info-date">
          <div className="button left" onClick={() => handleMonthChange(-1)}>
            <div></div>
          </div>
          <div className="date-wrapper">
            <span>{date.format("MMMM")}</span>
            <span>{date.format("YYYY")}</span>
          </div>
          <div className="button right" onClick={() => handleMonthChange(1)}>
            <div></div>
          </div>
        </div>
      </div>
      <div className="calendar-table">
        <table>
          <CalendarDays />
          <CalendarWeeks date={date} />
        </table>
      </div>
    </div>
  );
};

export default Calendar;
