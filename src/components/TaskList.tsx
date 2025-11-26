import { useState, useEffect } from "react";
import { Plus, Trash2, CheckSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

interface Task {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
  subject: string;
}

interface TaskListProps {
  preview?: boolean;
}

const TaskList = ({ preview = false }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "Complete Math Assignment",
            deadline: "2024-12-01",
            completed: false,
            subject: "Mathematics",
          },
          {
            id: "2",
            title: "Study for Science Quiz",
            deadline: "2024-11-28",
            completed: false,
            subject: "Science",
          },
        ];
  });
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask,
          deadline: newDeadline || new Date().toISOString().split("T")[0],
          completed: false,
          subject: "General",
        },
      ]);
      setNewTask("");
      setNewDeadline("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const displayTasks = preview ? tasks.slice(0, 3) : tasks;
  const sortedTasks = [...displayTasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="glass rounded-xl p-6 border border-border">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CheckSquare className="w-5 h-5 text-primary" />
        Tasks & Deadlines
      </h2>

      {!preview && (
        <div className="grid gap-2 mb-6 md:grid-cols-3">
          <Input
            placeholder="Task title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="md:col-span-2"
          />
          <Input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <Button onClick={addTask} className="md:col-span-3">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {sortedTasks.map((task) => {
          const isOverdue = new Date(task.deadline) < new Date() && !task.completed;
          return (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-smooth ${
                task.completed
                  ? "bg-secondary border-border opacity-60"
                  : isOverdue
                  ? "bg-destructive/10 border-destructive/50"
                  : "bg-card border-border"
              }`}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <div className="flex-1">
                <p className={task.completed ? "line-through text-muted-foreground" : "font-medium"}>
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
              {!preview && (
                <Button
                  onClick={() => deleteTask(task.id)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
