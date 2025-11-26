import { useState, useEffect } from "react";
import { Plus, Trash2, CheckSquare, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

interface Task {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
  subject: string;
  priority: "low" | "medium" | "high";
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
            priority: "high",
          },
          {
            id: "2",
            title: "Study for Science Quiz",
            deadline: "2024-11-28",
            completed: false,
            subject: "Science",
            priority: "medium",
          },
        ];
  });
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");

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
          priority: newPriority,
        },
      ]);
      setNewTask("");
      setNewDeadline("");
      setNewPriority("medium");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const updatePriority = (id: string, priority: "low" | "medium" | "high") => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, priority } : t)));
  };

  const moveTask = (id: string, direction: "up" | "down") => {
    const index = tasks.findIndex((t) => t.id === id);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < tasks.length - 1)
    ) {
      const newTasks = [...tasks];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newTasks[index], newTasks[swapIndex]] = [newTasks[swapIndex], newTasks[index]];
      setTasks(newTasks);
    }
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
        <div className="grid gap-2 mb-6">
          <div className="grid gap-2 md:grid-cols-3">
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
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <Select
              value={newPriority}
              onValueChange={(value: "low" | "medium" | "high") => setNewPriority(value)}
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
            <Button onClick={addTask}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sortedTasks.map((task, index) => {
          const isOverdue = new Date(task.deadline) < new Date() && !task.completed;
          const getPriorityColor = (priority: string) => {
            switch (priority) {
              case "high":
                return "border-l-4 border-l-destructive";
              case "medium":
                return "border-l-4 border-l-primary";
              case "low":
                return "border-l-4 border-l-muted-foreground";
              default:
                return "";
            }
          };
          
          return (
            <ContextMenu key={task.id}>
              <ContextMenuTrigger>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-smooth ${
                    task.completed
                      ? "bg-secondary border-border opacity-60"
                      : isOverdue
                      ? "bg-destructive/10 border-destructive/50"
                      : "bg-card border-border"
                  } ${getPriorityColor(task.priority)}`}
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
                      Due: {new Date(task.deadline).toLocaleDateString()} • Priority: {task.priority}
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
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => updatePriority(task.id, "high")}>
                  Set High Priority
                </ContextMenuItem>
                <ContextMenuItem onClick={() => updatePriority(task.id, "medium")}>
                  Set Medium Priority
                </ContextMenuItem>
                <ContextMenuItem onClick={() => updatePriority(task.id, "low")}>
                  Set Low Priority
                </ContextMenuItem>
                <ContextMenuItem onClick={() => moveTask(task.id, "up")} disabled={index === 0}>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Move Up
                </ContextMenuItem>
                <ContextMenuItem onClick={() => moveTask(task.id, "down")} disabled={index === sortedTasks.length - 1}>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Move Down
                </ContextMenuItem>
                <ContextMenuItem onClick={() => deleteTask(task.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
