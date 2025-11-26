import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar as CalendarUI } from "./ui/calendar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";

interface CalendarEvent {
  id: string;
  name: string;
  subject: string;
  priority: "low" | "medium" | "high";
  date: string;
  type: "event" | "deadline";
}

const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("calendar-events");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tasks, setTasks] = useState<any[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventSubject, setNewEventSubject] = useState("");
  const [newEventPriority, setNewEventPriority] = useState<"low" | "medium" | "high">("medium");

  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("tasks");
      if (saved) setTasks(JSON.parse(saved));
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const addEvent = () => {
    if (newEventName.trim() && selectedDate) {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        name: newEventName,
        subject: newEventSubject || "General",
        priority: newEventPriority,
        date: selectedDate.toISOString().split("T")[0],
        type: "event",
      };
      setEvents([...events, newEvent]);
      setNewEventName("");
      setNewEventSubject("");
      setNewEventPriority("medium");
      setIsDialogOpen(false);
    }
  };

  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    const calendarEvents = events.filter((e) => e.date === dateStr);
    const taskDeadlines = tasks
      .filter((t) => t.deadline === dateStr)
      .map((t) => ({
        id: t.id,
        name: t.title,
        subject: t.subject,
        priority: t.priority || "medium",
        date: t.deadline,
        type: "deadline" as const,
      }));
    return [...calendarEvents, ...taskDeadlines];
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium":
        return "bg-primary/20 text-primary border-primary/30";
      case "low":
        return "bg-secondary text-secondary-foreground border-border";
      default:
        return "bg-secondary text-secondary-foreground border-border";
    }
  };

  const hasEventsOnDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.some((e) => e.date === dateStr) || tasks.some((t) => t.deadline === dateStr);
  };

  return (
    <div className="glass rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Calendar & Events
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Event name..."
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addEvent()}
              />
              <Input
                placeholder="Subject (optional)..."
                value={newEventSubject}
                onChange={(e) => setNewEventSubject(e.target.value)}
              />
              <Select
                value={newEventPriority}
                onValueChange={(value: "low" | "medium" | "high") => setNewEventPriority(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={addEvent} className="flex-1">
                  Create Event
                </Button>
                <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex justify-center">
          <CalendarUI
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border border-border"
            modifiers={{
              hasEvents: (date) => hasEventsOnDate(date),
            }}
            modifiersClassNames={{
              hasEvents: "bg-primary/10 font-bold",
            }}
          />
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">
            {selectedDate ? selectedDate.toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            }) : "Select a date"}
          </h3>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-2">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border transition-smooth ${getPriorityColor(event.priority)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium">{event.name}</p>
                      <p className="text-xs opacity-70">{event.subject}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-xs">
                        {event.type === "deadline" ? "Deadline" : "Event"}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No events or deadlines on this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
