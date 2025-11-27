import { useState, useEffect } from "react";
import { Plus, TrendingUp, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

interface Subject {
  id: string;
  name: string;
  progress: number;
  color: string;
  target: number;
  completed: number;
}

const SubjectProgress = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem("subjects");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "1", name: "Mathematics", progress: 65, color: "math", target: 100, completed: 65 },
          { id: "2", name: "Science", progress: 40, color: "science", target: 100, completed: 40 },
          { id: "3", name: "English", progress: 80, color: "english", target: 100, completed: 80 },
        ];
  });
  const [newSubject, setNewSubject] = useState("");

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    if (newSubject.trim()) {
      const colors = ["math", "science", "english", "history", "other"];
      const color = colors[subjects.length % colors.length];
      setSubjects([
        ...subjects,
        {
          id: Date.now().toString(),
          name: newSubject,
          progress: 0,
          color,
          target: 100,
          completed: 0,
        },
      ]);
      setNewSubject("");
    }
  };

  const updateProgress = (id: string, increment: number) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === id) {
          const newCompleted = Math.max(0, Math.min(s.target, s.completed + increment));
          return {
            ...s,
            completed: newCompleted,
            progress: Math.round((newCompleted / s.target) * 100),
          };
        }
        return s;
      })
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const moveSubject = (id: string, direction: "up" | "down") => {
    const index = subjects.findIndex((s) => s.id === id);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < subjects.length - 1)
    ) {
      const newSubjects = [...subjects];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newSubjects[index], newSubjects[swapIndex]] = [newSubjects[swapIndex], newSubjects[index]];
      setSubjects(newSubjects);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Subject Progress
        </h2>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Add new subject..."
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSubject()}
            className="flex-1"
          />
          <Button onClick={addSubject} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {subjects.map((subject, index) => (
            <ContextMenu key={subject.id}>
              <ContextMenuTrigger>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">{subject.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {subject.completed}/{subject.target} topics
                    </span>
                  </div>
                  <Progress value={subject.progress} className="h-3" />
                  <div className="flex gap-2 items-center">
                    <Button
                      onClick={() => updateProgress(subject.id, -1)}
                      variant="outline"
                      size="sm"
                    >
                      -1
                    </Button>
                    <Input
                      type="number"
                      value={subject.completed}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setSubjects(
                          subjects.map((s) =>
                            s.id === subject.id
                              ? {
                                  ...s,
                                  completed: Math.max(0, Math.min(s.target, value)),
                                  progress: Math.round((Math.max(0, Math.min(s.target, value)) / s.target) * 100),
                                }
                              : s
                          )
                        );
                      }}
                      className="w-20 text-center"
                      min="0"
                      max={subject.target}
                    />
                    <span className="text-sm text-muted-foreground">/</span>
                    <Input
                      type="number"
                      value={subject.target}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setSubjects(
                          subjects.map((s) =>
                            s.id === subject.id
                              ? {
                                  ...s,
                                  target: Math.max(1, value),
                                  progress: Math.round((s.completed / Math.max(1, value)) * 100),
                                }
                              : s
                          )
                        );
                      }}
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button
                      onClick={() => updateProgress(subject.id, 1)}
                      variant="secondary"
                      size="sm"
                    >
                      +1
                    </Button>
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => moveSubject(subject.id, "up")} disabled={index === 0}>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Move Up
                </ContextMenuItem>
                <ContextMenuItem onClick={() => moveSubject(subject.id, "down")} disabled={index === subjects.length - 1}>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Move Down
                </ContextMenuItem>
                <ContextMenuItem onClick={() => deleteSubject(subject.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectProgress;
