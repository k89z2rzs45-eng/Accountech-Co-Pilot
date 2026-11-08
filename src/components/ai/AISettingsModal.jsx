import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Sparkles, Check, AlertCircle, RefreshCw, Key, Server, Cpu } from "lucide-react";
import { getAIConfig, saveAIConfig, testAIConnection } from "@/api/aiService";

export default function AISettingsModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(getAIConfig());
  const [testStatus, setTestStatus] = useState(null); // { type: 'success'|'error', message: '' }
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getAIConfig());
      setTestStatus(null);
    }
  }, [isOpen]);

  const handleTest = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      const result = await testAIConnection(config);
      setTestStatus({
        type: result.success ? 'success' : 'error',
        message: result.message
      });
    } catch (e) {
      setTestStatus({ type: 'error', message: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    saveAIConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            <DialogTitle className="text-xl font-bold">AI Brain Configuration</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400 text-sm">
            Choose your AI provider. You can switch between cloud models and 100% offline local AI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label className="text-slate-300">AI Provider</Label>
            <Select 
              value={config.provider} 
              onValueChange={(val) => {
                setConfig(prev => ({ ...prev, provider: val }));
                setTestStatus(null);
              }}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select AI Provider" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="gemini">✨ Google Gemini (Recommended)</SelectItem>
                <SelectItem value="openai">🧠 OpenAI (GPT-4o / GPT-4o-mini)</SelectItem>
                <SelectItem value="ollama">💻 Ollama (100% Offline & Private)</SelectItem>
                <SelectItem value="builtin">📊 Built-in Offline Financial Engine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gemini Settings */}
          {config.provider === 'gemini' && (
            <div className="space-y-3 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              <div className="space-y-1">
                <Label className="text-xs text-slate-300 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-cyan-400" /> Gemini API Key
                </Label>
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  value={config.geminiApiKey || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                  className="bg-slate-900 border-slate-700 text-white text-sm"
                />
                <p className="text-[11px] text-slate-400">
                  Get a free key from Google AI Studio (aistudio.google.com).
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Model</Label>
                <Select 
                  value={config.geminiModel} 
                  onValueChange={(val) => setConfig(prev => ({ ...prev, geminiModel: val }))}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="gemini-1.5-flash">gemini-1.5-flash (Fast & Economical)</SelectItem>
                    <SelectItem value="gemini-2.0-flash">gemini-2.0-flash (Latest & Smartest)</SelectItem>
                    <SelectItem value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* OpenAI Settings */}
          {config.provider === 'openai' && (
            <div className="space-y-3 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              <div className="space-y-1">
                <Label className="text-xs text-slate-300 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-emerald-400" /> OpenAI API Key
                </Label>
                <Input
                  type="password"
                  placeholder="sk-proj-..."
                  value={config.openaiApiKey || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                  className="bg-slate-900 border-slate-700 text-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Model</Label>
                <Select 
                  value={config.openaiModel} 
                  onValueChange={(val) => setConfig(prev => ({ ...prev, openaiModel: val }))}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="gpt-4o-mini">gpt-4o-mini (Fast & Efficient)</SelectItem>
                    <SelectItem value="gpt-4o">gpt-4o (Most Capable)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Ollama Settings */}
          {config.provider === 'ollama' && (
            <div className="space-y-3 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              <div className="space-y-1">
                <Label className="text-xs text-slate-300 flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 text-purple-400" /> Ollama Endpoint
                </Label>
                <Input
                  placeholder="http://localhost:11434"
                  value={config.ollamaUrl || 'http://localhost:11434'}
                  onChange={(e) => setConfig(prev => ({ ...prev, ollamaUrl: e.target.value }))}
                  className="bg-slate-900 border-slate-700 text-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" /> Model Name
                </Label>
                <Input
                  placeholder="llama3:latest or mistral"
                  value={config.ollamaModel || 'llama3:latest'}
                  onChange={(e) => setConfig(prev => ({ ...prev, ollamaModel: e.target.value }))}
                  className="bg-slate-900 border-slate-700 text-white text-sm"
                />
                <p className="text-[11px] text-slate-400">
                  Runs 100% offline on your PC hardware without any internet or fees.
                </p>
              </div>
            </div>
          )}

          {/* Built-in Notice */}
          {config.provider === 'builtin' && (
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-emerald-400">Zero Setup Required</p>
              <p className="text-slate-400">
                Uses our integrated rules engine to compute real income, expenses, profit margins, and pending invoices directly from your ledger.
              </p>
            </div>
          )}

          {/* Test Status Feedback */}
          {testStatus && (
            <div className={`p-2.5 rounded text-xs flex items-center gap-2 ${
              testStatus.type === 'success' 
                ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-300' 
                : 'bg-red-950/80 border border-red-600 text-red-300'
            }`}>
              {testStatus.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{testStatus.message}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={isTesting}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
            Test Connection
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-500 text-white">
              {isSaving ? 'Saving...' : 'Save AI Settings'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
