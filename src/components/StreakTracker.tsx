import { useState, useEffect } from "react";
import { Flame, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface StreakData {
  currentStreak: number;
  lastStudyDate: string;
  totalDays: number;
}

const StreakTracker = () => {
  const [streak, setStreak] = useState<StreakData>(() => {
    const saved = localStorage.getItem("streak");
    return saved
      ? JSON.parse(saved)
      : { currentStreak: 0, lastStudyDate: "", totalDays: 0 };
  });

  const [todayLogged, setTodayLogged] = useState(false);

  useEffect(() => {
    localStorage.setItem("streak", JSON.stringify(streak));
    const today = new Date().toDateString();
    setTodayLogged(streak.lastStudyDate === today);
  }, [streak]);

  const logStudySession = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (streak.lastStudyDate === today) {
      toast.info("Already logged today!");
      return;
    }

    let newStreak = streak.currentStreak;
    if (streak.lastStudyDate === yesterday) {
      newStreak += 1;
    } else if (streak.lastStudyDate !== today) {
      newStreak = 1;
    }

    setStreak({
      currentStreak: newStreak,
      lastStudyDate: today,
      totalDays: streak.totalDays + 1,
    });

    toast.success(`Great job! ${newStreak} day streak! 🔥`);
  };

  return (
    <div className="glass rounded-xl p-6 border border-border">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-warning" />
        Study Streak
      </h2>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-warning/20 mb-3">
          <Flame className="w-12 h-12 text-warning" />
        </div>
        <div className="text-4xl font-bold text-warning mb-1">{streak.currentStreak}</div>
        <p className="text-sm text-muted-foreground">Day Streak</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-secondary rounded-lg">
          <div className="text-2xl font-bold text-foreground">{streak.totalDays}</div>
          <p className="text-xs text-muted-foreground">Total Days</p>
        </div>
        <div className="text-center p-3 bg-secondary rounded-lg">
          <div className="text-2xl font-bold text-success">
            {streak.lastStudyDate ? "✓" : "-"}
          </div>
          <p className="text-xs text-muted-foreground">Today</p>
        </div>
      </div>

      <Button
        onClick={logStudySession}
        disabled={todayLogged}
        className="w-full"
        variant={todayLogged ? "secondary" : "default"}
      >
        {todayLogged ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Logged Today
          </>
        ) : (
          "Log Study Session"
        )}
      </Button>
    </div>
  );
};

export default StreakTracker;
