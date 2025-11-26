import { useState } from "react";
import { BookOpen, Clock, CheckSquare, Calendar, FileText, Flame } from "lucide-react";
import SubjectProgress from "./SubjectProgress";
import PomodoroTimer from "./PomodoroTimer";
import TaskList from "./TaskList";
import CalendarComponent from "./Calendar";
import Notes from "./Notes";
import StreakTracker from "./StreakTracker";

type Tab = "overview" | "subjects" | "timer" | "tasks" | "calendar" | "notes";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: Flame },
    { id: "subjects" as Tab, label: "Subjects", icon: BookOpen },
    { id: "timer" as Tab, label: "Timer", icon: Clock },
    { id: "tasks" as Tab, label: "Tasks", icon: CheckSquare },
    { id: "calendar" as Tab, label: "Calendar", icon: Calendar },
    { id: "notes" as Tab, label: "Notes", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">StudyPlanner</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <nav className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-smooth whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <main>
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-2">
              <StreakTracker />
              <div className="glass rounded-xl p-6 border border-border">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Quick Timer
                </h2>
                <PomodoroTimer compact />
              </div>
              <div className="md:col-span-2">
                <TaskList preview />
              </div>
            </div>
          )}
          {activeTab === "subjects" && <SubjectProgress />}
          {activeTab === "timer" && <PomodoroTimer />}
          {activeTab === "tasks" && <TaskList />}
          {activeTab === "calendar" && <CalendarComponent />}
          {activeTab === "notes" && <Notes />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
