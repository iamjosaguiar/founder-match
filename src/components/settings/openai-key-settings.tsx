"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react";

export default function OpenAIKeySettings() {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [keyPreview, setKeyPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    checkExistingKey();
  }, []);

  const checkExistingKey = async () => {
    try {
      const response = await fetch('/api/user/openai-key');
      if (response.ok) {
        const data = await response.json();
        setHasKey(data.hasKey);
        setKeyPreview(data.keyPreview);
      }
    } catch (error) {
      console.error('Error checking API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key");
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setError("Invalid API key format. OpenAI keys start with 'sk-'");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/user/openai-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("API key saved successfully!");
        setHasKey(true);
        setKeyPreview(data.keyPreview);
        setApiKey("");
        setShowKey(false);
      } else {
        setError(data.error || "Failed to save API key");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const removeApiKey = async () => {
    if (!confirm("Are you sure you want to remove your OpenAI API key? You won't be able to use the chat feature without it.")) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/user/openai-key', {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess("API key removed successfully");
        setHasKey(false);
        setKeyPreview(null);
        setApiKey("");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to remove API key");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            OpenAI API Key
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          OpenAI API Key
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add your personal OpenAI API key to use the AI chat feature
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {hasKey ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">API Key Configured</span>
              </div>
              <span className="text-sm text-green-600 font-mono">{keyPreview}</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowKey(!showKey)}
                className="flex-1"
              >
                {showKey ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                Update Key
              </Button>
              <Button
                variant="destructive"
                onClick={removeApiKey}
                disabled={saving}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Chat feature disabled:</strong> Add your OpenAI API key to enable AI-powered conversations.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">To get your API key:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">OpenAI Platform <ExternalLink className="w-3 h-3" /></a></li>
                <li>Create a new secret key</li>
                <li>Copy and paste it below</li>
              </ol>
            </div>
            <Button onClick={() => setShowKey(true)} variant="outline" className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Add API Key
            </Button>
          </div>
        )}

        {(showKey || !hasKey) && showKey && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium">OpenAI API Key</label>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={saveApiKey}
                disabled={saving || !apiKey.trim()}
                className="flex-1"
              >
                {saving ? "Saving..." : "Save API Key"}
              </Button>
              {hasKey && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowKey(false);
                    setApiKey("");
                    setError("");
                    setSuccess("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground p-3 bg-gray-50 rounded">
          <p><strong>Privacy:</strong> Your API key is encrypted and stored securely. Only you can use it, and it&apos;s never shared with other users.</p>
        </div>
      </CardContent>
    </Card>
  );
}