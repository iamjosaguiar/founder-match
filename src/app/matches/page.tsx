"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import Link from "next/link";

type Match = {
  id: string;
  matchedAt: string;
  user: {
    id: string;
    name: string;
    title: string;
    skills: string[];
    avatar: string;
    profileImage?: string;
    bio?: string;
  };
};

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Array<{sender: string; message: string; timestamp: string}> }>({});
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches');
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches);
        
        // Initialize mock messages for each match
        const mockMessages: { [key: string]: Array<{sender: string; message: string; timestamp: string}> } = {};
        data.matches.forEach((match: Match) => {
          mockMessages[match.user.id] = [
            { 
              sender: match.user.name, 
              message: `Hi! Great to connect. I'd love to discuss potential collaboration opportunities.`, 
              timestamp: "1 day ago" 
            }
          ];
        });
        setMessages(mockMessages);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedMatch) {
      const updatedMessages = {
        ...messages,
        [selectedMatch]: [
          ...(messages[selectedMatch] || []),
          { sender: "You", message: newMessage.trim(), timestamp: "just now" }
        ]
      };
      setMessages(updatedMessages);
      setNewMessage("");
    }
  };

  const selectedMatchData = matches.find(m => m.user.id === selectedMatch);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Connections</h1>
          <Button asChild variant="outline">
            <Link href="/discover">Continue Discovering</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Matches List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Connections ({matches.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>Loading your connections...</p>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No connections yet!</p>
                    <Button asChild className="mt-4" size="sm">
                      <Link href="/discover">Start Discovering</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {matches.map((match) => (
                      <div
                        key={match.user.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedMatch === match.user.id ? "bg-blue-50 border-r-4 border-r-blue-500" : ""
                        }`}
                        onClick={() => setSelectedMatch(match.user.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>{match.user.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{match.user.name}</h3>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{match.user.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              New mutual match! Start the conversation.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Matched {new Date(match.matchedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedMatch && selectedMatchData ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{selectedMatchData.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{selectedMatchData.user.name}</CardTitle>
                        <p className="text-sm text-gray-600">{selectedMatchData.user.title}</p>
                        <div className="flex gap-1 mt-1">
                          {selectedMatchData.user.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/founder/${selectedMatchData.user.id}`} className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {(messages[selectedMatch] || []).map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === "You"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === "You" ? "text-blue-100" : "text-gray-500"
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage}>Send</Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <h3 className="text-xl font-semibold mb-2">Select a match to start chatting</h3>
                  <p>Choose someone from your matches to begin the conversation</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/discover" className="text-blue-600 hover:underline">
            ← Back to Discover
          </Link>
        </div>
      </div>
    </div>
  );
}