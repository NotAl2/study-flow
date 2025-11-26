import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface PomodoroTimerProps {
  compact?: boolean;
}

const PomodoroTimer = ({ compact = false }: PomodoroTimerProps) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (mode === "work") {
      toast.success("Work session complete! Time for a break.");
      setMode("break");
      setMinutes(5);
    } else {
      toast.success("Break complete! Ready for another session?");
      setMode("work");
      setMinutes(25);
    }
    setSeconds(0);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === "work" ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = (newMode: "work" | "break") => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === "work" ? 25 : 5);
    setSeconds(0);
  };

  const formatTime = (m: number, s: number) => {
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={compact ? "" : "glass rounded-xl p-8 border border-border"}>
      {!compact && (
        <h2 className="text-xl font-semibold mb-6 text-center">Pomodoro Timer</h2>
      )}

      <div className="flex gap-2 mb-6 justify-center">
        <Button
          onClick={() => switchMode("work")}
          variant={mode === "work" ? "default" : "outline"}
          size="sm"
        >
          Work (25m)
        </Button>
        <Button
          onClick={() => switchMode("break")}
          variant={mode === "break" ? "default" : "outline"}
          size="sm"
        >
          Break (5m)
        </Button>
      </div>

      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-primary mb-2">{formatTime(minutes, seconds)}</div>
        <div className="text-sm text-muted-foreground capitalize">{mode} Session</div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={toggleTimer} size="lg" className="px-8">
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        <Button onClick={resetTimer} variant="outline" size="lg">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
