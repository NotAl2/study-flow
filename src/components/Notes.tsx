import { useState, useEffect } from "react";
import { Plus, Trash2, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    if (newTitle.trim() && newContent.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        subject: "General",
        createdAt: new Date().toISOString(),
      };
      setNotes([note, ...notes]);
      setNewTitle("");
      setNewContent("");
      setIsCreating(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1 glass rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Notes
          </h2>
          <Button onClick={() => setIsCreating(true)} size="icon" variant="ghost">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-3 rounded-lg cursor-pointer transition-smooth ${
                selectedNote?.id === note.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <p className="font-medium truncate">{note.title}</p>
              <p className="text-xs opacity-70">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 glass rounded-xl p-6 border border-border">
        {isCreating ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Create New Note</h2>
            <Input
              placeholder="Note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              placeholder="Note content..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={12}
            />
            <div className="flex gap-2">
              <Button onClick={createNote}>Save Note</Button>
              <Button onClick={() => setIsCreating(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : selectedNote ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{selectedNote.title}</h2>
              <Button
                onClick={() => deleteNote(selectedNote.id)}
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(selectedNote.createdAt).toLocaleDateString()}
            </p>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{selectedNote.content}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
