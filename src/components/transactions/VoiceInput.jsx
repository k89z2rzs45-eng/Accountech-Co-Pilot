import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, X, Volume2 } from "lucide-react";

export default function VoiceInput({ onTranscription, onCancel }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert('Speech recognition is not supported in this browser');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscription(transcript.trim());
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="clay-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Voice Input</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-colors ${
              isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
            }`}>
              {isRecording ? (
                <Mic className="w-12 h-12 text-red-600" />
              ) : (
                <MicOff className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <p className="mt-4 text-lg font-medium text-gray-900">
              {isRecording ? 'Listening...' : 'Ready to record'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isRecording ? 'Speak your transaction details' : 'Click the button to start'}
            </p>
          </div>

          {transcript && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Volume2 className="w-4 h-4 text-gray-400 mt-1" />
                <p className="text-sm text-gray-700">{transcript}</p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            {!isRecording ? (
              <Button onClick={startRecording} className="clay-button text-white">
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="outline" className="clay-input">
                <MicOff className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onCancel} className="clay-input">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          {transcript && (
            <Button onClick={handleSubmit} className="clay-button text-white">
              Add Transaction
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}