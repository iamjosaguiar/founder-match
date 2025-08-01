"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Brain,
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Search
} from "lucide-react";

type Memory = {
  id: string;
  memoryType: string;
  content: string;
  category?: string;
  importance: number;
  confidence: number;
  source?: string;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
};

type GroupedMemories = Record<string, Memory[]>;

export default function MemoryManager() {
  const [memories, setMemories] = useState<GroupedMemories>({});
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMemory, setEditingMemory] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    memoryType: "preference",
    content: "",
    category: "manual",
    importance: 5
  });

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat/memory");
      if (response.ok) {
        const data = await response.json();
        setMemories(data.memories || {});
      }
    } catch (error) {
      console.error("Error loading memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      const response = await fetch(`/api/chat/memory/${memoryId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        loadMemories(); // Reload memories
      }
    } catch (error) {
      console.error("Error deleting memory:", error);
    }
  };

  const updateMemoryImportance = async (memoryId: string, action: string) => {
    try {
      const response = await fetch("/api/chat/memory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memoryIds: [memoryId],
          action
        })
      });
      if (response.ok) {
        loadMemories(); // Reload memories
      }
    } catch (error) {
      console.error("Error updating memory:", error);
    }
  };

  const editMemory = async (memoryId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/chat/memory/${memoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent })
      });
      if (response.ok) {
        setEditingMemory(null);
        setEditContent("");
        loadMemories(); // Reload memories
      }
    } catch (error) {
      console.error("Error editing memory:", error);
    }
  };

  const addMemory = async () => {
    if (!newMemory.content.trim()) return;
    
    try {
      const response = await fetch("/api/chat/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemory)
      });
      if (response.ok) {
        setNewMemory({
          memoryType: "preference",
          content: "",
          category: "manual",
          importance: 5
        });
        setShowAddForm(false);
        loadMemories(); // Reload memories
      }
    } catch (error) {
      console.error("Error adding memory:", error);
    }
  };

  const getMemoryTypeColor = (type: string) => {
    const colors = {
      preference: "bg-blue-100 text-blue-800",
      goal: "bg-green-100 text-green-800",
      skill: "bg-purple-100 text-purple-800",
      weakness: "bg-red-100 text-red-800",
      context: "bg-yellow-100 text-yellow-800",
      fact: "bg-gray-100 text-gray-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "conversation": return "💬";
      case "profile": return "👤";
      case "assessment": return "📊";
      default: return "✏️";
    }
  };

  const filteredMemories = Object.entries(memories).reduce((acc, [type, memoryList]) => {
    if (selectedType !== "all" && type !== selectedType) return acc;
    
    const filtered = memoryList.filter(memory =>
      memory.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[type] = filtered;
    }
    return acc;
  }, {} as GroupedMemories);

  const totalMemories = Object.values(memories).reduce((sum, list) => sum + list.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI Memory Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage what the AI remembers about you ({totalMemories} memories)
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Memory
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="preference">Preferences</SelectItem>
                <SelectItem value="goal">Goals</SelectItem>
                <SelectItem value="skill">Skills</SelectItem>
                <SelectItem value="weakness">Weaknesses</SelectItem>
                <SelectItem value="context">Context</SelectItem>
                <SelectItem value="fact">Facts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Add Memory Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Memory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={newMemory.memoryType}
                onValueChange={(value) => setNewMemory(prev => ({ ...prev, memoryType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preference">Preference</SelectItem>
                  <SelectItem value="goal">Goal</SelectItem>
                  <SelectItem value="skill">Skill</SelectItem>
                  <SelectItem value="weakness">Weakness</SelectItem>
                  <SelectItem value="context">Context</SelectItem>
                  <SelectItem value="fact">Fact</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newMemory.importance.toString()}
                onValueChange={(value) => setNewMemory(prev => ({ ...prev, importance: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Importance {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Enter memory content..."
              value={newMemory.content}
              onChange={(e) => setNewMemory(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={addMemory} disabled={!newMemory.content.trim()}>
                <Save className="w-4 h-4 mr-2" />
                Save Memory
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memory Groups */}
      <div className="space-y-6">
        {Object.entries(filteredMemories).map(([type, memoryList]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                <Badge className={getMemoryTypeColor(type)}>
                  {type}s ({memoryList.length})
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memoryList
                  .sort((a, b) => b.importance - a.importance)
                  .map((memory) => (
                    <div
                      key={memory.id}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {editingMemory === memory.id ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => editMemory(memory.id, editContent)}
                                  disabled={!editContent.trim()}
                                >
                                  <Save className="w-3 h-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingMemory(null);
                                    setEditContent("");
                                  }}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-slate-900 mb-2">{memory.content}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>
                                  {getSourceIcon(memory.source)} {memory.source || "manual"}
                                </span>
                                <span>Importance: {memory.importance}/10</span>
                                <span>Confidence: {Math.round(memory.confidence * 100)}%</span>
                                <span>
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {new Date(memory.createdAt).toLocaleDateString()}
                                </span>
                                {memory.lastUsed && (
                                  <span>Last used: {new Date(memory.lastUsed).toLocaleDateString()}</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        
                        {editingMemory !== memory.id && (
                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateMemoryImportance(memory.id, "increase_importance")}
                              title="Increase importance"
                            >
                              <TrendingUp className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateMemoryImportance(memory.id, "decrease_importance")}
                              title="Decrease importance"
                            >
                              <TrendingDown className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingMemory(memory.id);
                                setEditContent(memory.content);
                              }}
                              title="Edit memory"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700"
                                  title="Delete memory"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Memory</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this memory? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMemory(memory.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {Object.keys(filteredMemories).length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No memories found</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery || selectedType !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Start a conversation with the AI to build memories, or add one manually"
                }
              </p>
              {!searchQuery && selectedType === "all" && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Memory
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}