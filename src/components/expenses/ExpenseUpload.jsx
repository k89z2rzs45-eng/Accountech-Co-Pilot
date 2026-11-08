import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadFile, ExtractDataFromUploadedFile } from "@/api/integrations";
import { Upload, Camera, X, Loader2, FileText } from "lucide-react";
import { User } from "@/api/entities";
import { Expense } from "@/api/entities";
import { detectDefaultCurrency } from "@/components/utils/currency";

export default function ExpenseUpload({ onComplete, onCancel, defaultCurrency: defaultCurrencyProp }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState(defaultCurrencyProp || "USD");
  const [processingStatus, setProcessingStatus] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await User.me().catch(() => null);
        const auto = detectDefaultCurrency({
          userCountry: me?.country,
          userPreferred: me?.preferred_currency
        });
        setDefaultCurrency(defaultCurrencyProp || auto || "USD");
      } catch {
        setDefaultCurrency(defaultCurrencyProp || "USD");
      }
    })();
  }, [defaultCurrencyProp]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = async (files) => {
    setIsProcessing(true);
    setProcessingStatus("Uploading files...");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingStatus(`Processing file ${i + 1} of ${files.length}: ${file.name}`);

        // Upload file
        const { file_url } = await UploadFile({ file });
        
        setProcessingStatus(`Extracting data from ${file.name}...`);
        
        // Extract expense data from the file
        const result = await ExtractDataFromUploadedFile({
          file_url,
          json_schema: {
            type: "object",
            properties: {
              amount: { type: "number" },
              vendor: { type: "string" },
              date: { type: "string" },
              description: { type: "string" },
              category: { type: "string" },
              tax_deductible: { type: "boolean" },
              tax_amount: { type: "number" },
              payment_method: { type: "string" },
              location: { type: "string" }
            }
          }
        });

        if (result.status === "success" && result.output) {
          setProcessingStatus(`Creating expense from ${file.name}...`);
          
          // Create expense with extracted data
          const expenseData = {
            ...result.output,
            currency: defaultCurrency,
            status: "pending",
            receipt_urls: [file_url],
            // Ensure required fields have defaults
            description: result.output.description || `Expense from ${file.name}`,
            date: result.output.date || new Date().toISOString().split('T')[0],
            amount: result.output.amount || 0,
            category: result.output.category || "other"
          };

          await Expense.create(expenseData);
        } else {
          // If extraction fails, create a basic expense with the receipt
          setProcessingStatus(`Creating basic expense for ${file.name}...`);
          
          await Expense.create({
            description: `Expense from uploaded receipt: ${file.name}`,
            amount: 0, // User will need to edit this
            currency: defaultCurrency,
            status: "pending",
            category: "other",
            date: new Date().toISOString().split('T')[0],
            receipt_urls: [file_url],
            notes: "Please review and update expense details - auto-extraction was not successful"
          });
        }
      }

      setProcessingStatus("Complete! Expenses created successfully.");
      setTimeout(() => {
        onComplete();
      }, 1000);

    } catch (error) {
      console.error('Error processing receipts:', error);
      setProcessingStatus("Error processing receipts. Please try again.");
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStatus("");
      }, 3000);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Upload className="w-6 h-6 text-red-600" />
            Upload Expense Receipts
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isProcessing ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 mx-auto text-red-600 animate-spin" />
                <div>
                  <p className="text-gray-600 font-medium">Processing receipts...</p>
                  <p className="text-sm text-gray-500 mt-2">{processingStatus}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Upload Expense Receipts</p>
                  <p className="text-sm text-gray-500 mt-1">
                    AI will automatically extract expense details
                  </p>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileInput}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('receipt-upload').click()}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                  <p className="text-xs text-gray-400">
                    Supports JPG, PNG, PDF • Multiple files allowed
                  </p>
                </div>

                {/* Features List */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    What we'll extract:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Amount and currency</li>
                    <li>• Vendor/supplier name</li>
                    <li>• Date and description</li>
                    <li>• Auto-categorization</li>
                    <li>• Tax information</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {!isProcessing && (
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}