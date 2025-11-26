import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

interface TimeSlot {
  day: string;
  time: string;
  subject: string;
}

const Timetable = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["9:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

  const [schedule, setSchedule] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem("timetable");
    return saved
      ? JSON.parse(saved)
      : [
          { day: "Monday", time: "9:00", subject: "Mathematics" },
          { day: "Monday", time: "10:00", subject: "Science" },
          { day: "Tuesday", time: "9:00", subject: "English" },
          { day: "Wednesday", time: "11:00", subject: "History" },
        ];
  });

  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [inputSubject, setInputSubject] = useState("");

  useEffect(() => {
    localStorage.setItem("timetable", JSON.stringify(schedule));
  }, [schedule]);

  const getSubject = (day: string, time: string) => {
    return schedule.find((s) => s.day === day && s.time === time)?.subject || "";
  };

  const handleSlotClick = (day: string, time: string) => {
    const existing = getSubject(day, time);
    setSelectedSlot({ day, time });
    setInputSubject(existing);
  };

  const saveSlot = () => {
    if (selectedSlot) {
      const filtered = schedule.filter(
        (s) => !(s.day === selectedSlot.day && s.time === selectedSlot.time)
      );
      if (inputSubject.trim()) {
        setSchedule([...filtered, { ...selectedSlot, subject: inputSubject }]);
      } else {
        setSchedule(filtered);
      }
      setSelectedSlot(null);
      setInputSubject("");
    }
  };

  return (
    <div className="glass rounded-xl p-6 border border-border">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-primary" />
        Weekly Timetable
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-semibold text-muted-foreground border-b border-border">
                Time
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="p-2 text-center text-sm font-semibold text-muted-foreground border-b border-border"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time}>
                <td className="p-2 text-sm font-medium text-foreground border-b border-border">
                  {time}
                </td>
                {days.map((day) => {
                  const subject = getSubject(day, time);
                  return (
                    <td
                      key={`${day}-${time}`}
                      className="p-2 border-b border-border"
                      onClick={() => handleSlotClick(day, time)}
                    >
                      <div
                        className={`min-h-[60px] rounded-lg p-2 cursor-pointer transition-smooth ${
                          subject
                            ? "bg-primary/10 hover:bg-primary/20 border border-primary/30"
                            : "bg-secondary hover:bg-secondary/80 border border-transparent"
                        }`}
                      >
                        {subject && (
                          <p className="text-xs font-medium text-center">{subject}</p>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlot && (
        <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
          <h3 className="font-semibold mb-3">
            Edit: {selectedSlot.day} at {selectedSlot.time}
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputSubject}
              onChange={(e) => setInputSubject(e.target.value)}
              placeholder="Subject name..."
              className="flex-1 px-3 py-2 rounded-md border border-input bg-background"
              onKeyDown={(e) => e.key === "Enter" && saveSlot()}
            />
            <button
              onClick={saveSlot}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
            >
              Save
            </button>
            <button
              onClick={() => {
                setSelectedSlot(null);
                setInputSubject("");
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-smooth"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
