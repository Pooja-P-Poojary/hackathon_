import "../styles/Timetable.css";

function Timetable() {
  const timetable = [
    {
      time: "09:00 - 10:00",
      Monday: { subject: "DBMS", room: "Room 101" },
      Tuesday: { subject: "Computer Networks", room: "Lab 2" },
      Wednesday: { subject: "Operating Systems", room: "Room 203" },
      Thursday: { subject: "Java", room: "Lab 1" },
      Friday: { subject: "Artificial Intelligence", room: "Room 204" },
    },
    {
      time: "10:00 - 11:00",
      Monday: { subject: "Operating Systems", room: "Room 102" },
      Tuesday: { subject: "DBMS", room: "Room 101" },
      Wednesday: { subject: "FREE", room: "" },
      Thursday: { subject: "Computer Networks", room: "Lab 2" },
      Friday: { subject: "Java", room: "Lab 3" },
    },
    {
      time: "11:00 - 12:00",
      Monday: { subject: "Java", room: "Lab 1" },
      Tuesday: { subject: "Artificial Intelligence", room: "Room 204" },
      Wednesday: { subject: "Computer Networks", room: "Lab 2" },
      Thursday: { subject: "DBMS", room: "Room 101" },
      Friday: { subject: "FREE", room: "" },
    },
    {
      time: "12:00 - 01:00",
      Monday: { subject: "FREE", room: "" },
      Tuesday: { subject: "Operating Systems", room: "Room 203" },
      Wednesday: { subject: "DBMS", room: "Room 101" },
      Thursday: { subject: "Artificial Intelligence", room: "Room 204" },
      Friday: { subject: "Computer Networks", room: "Lab 2" },
    },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="timetable-page">
      <header className="timetable-header">
        <div>
          <div className="brand-small">CF</div>
          <h1>ClassFlow</h1>
          <p>Faculty Substitution System</p>
        </div>

        <div className="faculty-info">
          <span>Welcome, Prof. A</span>
          <button>Logout</button>
        </div>
      </header>

      <main className="timetable-container">
        <div className="page-title">
          <div>
            <h2>My Timetable</h2>
            <p>Weekly class schedule</p>
          </div>

          <div className="week-selector">
            <button>‹</button>
            <span>August 4 - August 8, 2026</span>
            <button>›</button>
          </div>
        </div>

        <div className="timetable-wrapper">
          <table className="timetable">
            <thead>
              <tr>
                <th className="time-column">Time</th>

                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {timetable.map((slot) => (
                <tr key={slot.time}>
                  <td className="time-cell">{slot.time}</td>

                  {days.map((day) => {
                    const classInfo = slot[day];
                    const isFree = classInfo.subject === "FREE";

                    return (
                      <td key={day}>
                        {isFree ? (
                          <div className="free-class">FREE</div>
                        ) : (
                          <div className="class-card">
                            <strong>{classInfo.subject}</strong>
                            <span>{classInfo.room}</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="timetable-legend">
          <div>
            <span className="legend-box normal"></span>
            Regular Class
          </div>

          <div>
            <span className="legend-box substituted"></span>
            Substituted Class
          </div>

          <div>
            <span className="legend-box cancelled"></span>
            Cancelled Class
          </div>
        </div>
      </main>
    </div>
  );
}

export default Timetable;