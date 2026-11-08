import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Check, X, Loader2 } from "lucide-react";
import { smartCategorizer } from "@/api/functions";

export default function SmartCategoryButton({ 
  transaction, 
  onCategoryUpdate, 
  currentCategory = "other" 
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleSmartCategorization = async () => {
    setIsAnalyzing(true);
    try {
      const response = await smartCategorizer({
        description: transaction.description || '',
        vendor: transaction.vendor || '',
        amount: transaction.amount || 0,
        type: transaction.type || 'expense'
      });

      if (response.data && response.data.success !== false) {
        setSuggestion(response.data.data);
        setShowSuggestion(true);
      }
    } catch (error) {
      console.error('Smart categorization failed:', error);
    }
    setIsAnalyzing(false);
  };

  const acceptSuggestion = () => {
    if (suggestion && onCategoryUpdate) {
      onCategoryUpdate(suggestion.suggested_category);
      setShowSuggestion(false);
    }
  };

  const rejectSuggestion = () => {
    setShowSuggestion(false);
    setSuggestion(null);
  };

  if (showSuggestion && suggestion) {
    return (
      <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <Zap className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-blue-800">
          AI suggests: <strong>{suggestion.suggested_category.replace(/_/g, ' ')}</strong>
        </span>
        <Badge variant="outline" className="text-xs">
          {suggestion.confidence_score}% confidence
        </Badge>
        <Button 
          size="sm" 
          onClick={acceptSuggestion}
          className="bg-green-600 hover:bg-green-700 h-6 px-2"
        >
          <Check className="w-3 h-3" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={rejectSuggestion}
          className="h-6 px-2"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleSmartCategorization}
      disabled={isAnalyzing}
      className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
    >
      {isAnalyzing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Zap className="w-4 h-4" />
      )}
      {isAnalyzing ? 'Analyzing...' : 'AI Categorize'}
    </Button>
  );
}