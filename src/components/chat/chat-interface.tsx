"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/user-avatar";
import {
  MessageCircle,
  Send,
  Bot,
  Plus,
  History,
  Trash2,
  Settings,
  Loader2,
  Brain
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  metadata?: any;
};

type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  messageCount: number;
};

type ChatInterfaceProps = {
  initialConversationId?: string;
  className?: string;
};

export default function ChatInterface({ 
  initialConversationId, 
  className = "" 
}: ChatInterfaceProps) {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    initialConversationId || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Show sidebar by default on large screens
  useEffect(() => {
    const checkScreenSize = () => {
      setShowSidebar(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    if (session?.user) {
      loadConversations();
    }
  }, [session]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/chat/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.conversation.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newConv = data.conversation;
        setConversations(prev => [newConv, ...prev]);
        setCurrentConversation(newConv.id);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsSending(true);
    
    // Add user message to UI immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: messageContent,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          conversationId: currentConversation
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update current conversation ID if it was created
        if (!currentConversation) {
          setCurrentConversation(data.conversationId);
        }
        
        // Add AI response
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.response,
          createdAt: new Date().toISOString(),
          metadata: { ...data.usage, memoriesStored: data.memoriesStored }
        };
        
        setMessages(prev => [...prev.slice(0, -1), userMessage, aiMessage]);
        
        // Refresh conversations list to update lastMessage
        loadConversations();
        
      } else {
        const error = await response.json();
        // Remove the temporary user message on error
        setMessages(prev => prev.slice(0, -1));
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.slice(0, -1));
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;
    
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== conversationId));
        if (currentConversation === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`flex h-full bg-slate-50 ${className} relative`}>
      {/* Mobile Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:block ${showSidebar ? 'block' : 'hidden lg:block'}`}>
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">CoLaunchr</h2>
              <Button
                onClick={() => setShowSidebar(false)}
                variant="ghost"
                size="sm"
                className="lg:hidden"
              >
                ×
              </Button>
            </div>
            <div className="space-y-2">
              <Button
                onClick={createNewConversation}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open('/chat/memory', '_blank')}
              >
                <Brain className="w-4 h-4 mr-2" />
                Manage Memories
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    currentConversation === conv.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => setCurrentConversation(conv.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">
                        {conv.title}
                      </h4>
                      {conv.lastMessage && (
                        <p className="text-sm text-slate-600 truncate mt-1">
                          {conv.lastMessage.role === "user" ? "You: " : "AI: "}
                          {conv.lastMessage.content}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {formatTimeAgo(conv.updatedAt)}
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {conversations.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No conversations yet</p>
                  <p className="text-sm text-slate-500">Start a new conversation to get help with your startup journey</p>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showSidebar && (
                <Button
                  onClick={() => setShowSidebar(true)}
                  variant="ghost"
                  size="sm"
                >
                  <History className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">CoLaunchr</h3>
                  <p className="text-sm text-slate-600">Your personal business sidekick</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              Online
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-slate-600">Loading conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <Bot className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Welcome to CoLaunchr! 🚀
                </h3>
                <p className="text-slate-600 mb-6">
                  I'm your personal business sidekick. Think of me as your co-pilot for 
                  navigating startup challenges, making decisions, and growing your business.
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg text-left">
                    <p className="font-medium text-blue-900">💡 Try asking:</p>
                    <p className="text-blue-700">• "Help me validate my salon CRM idea"</p>
                    <p className="text-blue-700">• "What's my next step for fundraising?"</p>
                    <p className="text-blue-700">• "How should I price my SaaS product?"</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="p-2 bg-blue-100 rounded-full h-fit">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-2xl px-4 py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-600 text-white ml-12"
                        : "bg-white border border-slate-200 text-slate-900 mr-12"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="text-slate-700 leading-relaxed space-y-4">
                        {message.content
                          .split(/\n\n|\n/)
                          .filter(paragraph => paragraph.trim())
                          .map((paragraph, index) => {
                            // Handle bold text with **text**
                            const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
                            
                            return (
                              <div 
                                key={index} 
                                className="mb-4"
                                dangerouslySetInnerHTML={{ __html: formattedParagraph }}
                              />
                            );
                          })}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    )}
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user" ? "text-blue-100" : "text-slate-500"
                      }`}
                    >
                      {formatTimeAgo(message.createdAt)}
                      {message.metadata?.totalTokens && (
                        <span className="ml-2">• {message.metadata.totalTokens} tokens</span>
                      )}
                      {message.metadata?.memoriesStored > 0 && (
                        <span className="ml-2 text-green-600">
                          • {message.metadata.memoriesStored} memory stored
                        </span>
                      )}
                      {message.metadata?.contextUsed?.webSearchUsed && (
                        <span className="ml-2 text-blue-600">
                          • web search used
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {message.role === "user" && session?.user && (
                    <UserAvatar
                      size="md"
                      user={{
                        name: session.user.name || "",
                        email: session.user.email || "",
                        image: session.user.image
                      }}
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your business - strategy, growth, problems, decisions..."
                  className="resize-none border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  disabled={isSending}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">
                    Enter to send • Shift+Enter for new line
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {isSending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}