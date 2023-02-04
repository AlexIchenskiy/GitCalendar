import "./Calendar.scss";
import "./Calendar.responsive.scss";
import CalendarDays from "./components/CalendarDays/CalendarDays";

const Calendar = () => {
  return (
    <div className="calendar">
      <div className="calendar-info"></div>
      <div className="calendar-table">
        <table>
          <CalendarDays />
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
