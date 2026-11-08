import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, Image, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadFile, ExtractDataFromUploadedFile } from "@/api/integrations";
import { Transaction } from "@/api/entities";

export default function ReceiptUpload({ onComplete, onCancel, defaultCurrency = "USD" }) {
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, processing, completed, error
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setError("Please upload a JPG, PNG, or PDF file");
        return;
      }

      if (file.size > maxSize) {
        setError("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const processReceipt = async () => {
    if (!selectedFile) return;

    try {
      setUploadState('uploading');
      setError("");

      // Upload file first
      const { file_url } = await UploadFile({ file: selectedFile });

      setUploadState('processing');

      // Extract data from receipt
      const extractionResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            vendor: { type: "string", description: "Merchant or vendor name" },
            amount: { type: "number", description: "Total amount" },
            date: { type: "string", description: "Transaction date in YYYY-MM-DD format" },
            items: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  description: { type: "string" },
                  amount: { type: "number" }
                }
              }
            },
            category: { type: "string", description: "Expense category" },
            tax_amount: { type: "number", description: "Tax amount if visible" }
          }
        }
      });

      if (extractionResult.status === 'success') {
        const data = extractionResult.output;
        setExtractedData({
          ...data,
          receipt_url: file_url,
          currency: defaultCurrency,
          type: 'expense',
          status: 'pending'
        });
        setUploadState('completed');
      } else {
        throw new Error(extractionResult.details || 'Failed to extract data from receipt');
      }

    } catch (error) {
      console.error('Receipt processing error:', error);
      setError(error.message || 'Failed to process receipt');
      setUploadState('error');
    }
  };

  const saveTransaction = async () => {
    if (!extractedData) return;

    try {
      await Transaction.create(extractedData);
      onComplete && onComplete();
    } catch (error) {
      console.error('Transaction save error:', error);
      setError('Failed to save transaction');
    }
  };

  const renderContent = () => {
    switch (uploadState) {
      case 'idle':
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-200">Upload Receipt</p>
                <p className="text-gray-400">Drag & drop or click to select</p>
                <p className="text-xs text-gray-500">Supports JPG, PNG, PDF (max 10MB)</p>
              </div>
              <Input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="receipt-upload"
              />
              <Button
                asChild
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  {selectedFile.type.startsWith('image/') ? (
                    <Image className="w-8 h-8 text-blue-400" />
                  ) : (
                    <FileText className="w-8 h-8 text-red-400" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-200">{selectedFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    variant="ghost"
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={processReceipt}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                >
                  Process Receipt
                </Button>
              </motion.div>
            )}
          </div>
        );

      case 'uploading':
        return (
          <div className="text-center py-8">
            <Loader className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
            <p className="text-lg font-medium text-gray-200">Uploading Receipt...</p>
            <p className="text-gray-400">Please wait while we upload your file</p>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center py-8">
            <Loader className="w-12 h-12 text-green-400 mx-auto mb-4 animate-spin" />
            <p className="text-lg font-medium text-gray-200">Processing Receipt...</p>
            <p className="text-gray-400">AI is extracting transaction data</p>
          </div>
        );

      case 'completed':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-200">Receipt Processed!</p>
              <p className="text-gray-400">Review the extracted data below</p>
            </div>

            {extractedData && (
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-300">Vendor</Label>
                    <p className="text-gray-200">{extractedData.vendor || 'Unknown'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-300">Amount</Label>
                    <p className="text-gray-200 font-bold">
                      {defaultCurrency} {extractedData.amount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-300">Date</Label>
                    <p className="text-gray-200">{extractedData.date || 'Today'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-300">Category</Label>
                    <p className="text-gray-200">{extractedData.category || 'Other'}</p>
                  </div>
                </div>

                {extractedData.items && extractedData.items.length > 0 && (
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">Items</Label>
                    <div className="space-y-1">
                      {extractedData.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-300">{item.description}</span>
                          <span className="text-gray-400">{defaultCurrency} {item.amount?.toFixed(2)}</span>
                        </div>
                      ))}
                      {extractedData.items.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{extractedData.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={saveTransaction}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Save Transaction
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-200">Processing Failed</p>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button
              onClick={() => {
                setUploadState('idle');
                setError("");
                setSelectedFile(null);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent className="revolutionary-upload-modal max-w-2xl">
          <style jsx>{`
            .revolutionary-upload-modal {
              background: linear-gradient(145deg, 
                rgba(15, 23, 42, 0.98) 0%,
                rgba(30, 41, 59, 0.96) 50%,
                rgba(51, 65, 85, 0.94) 100%
              );
              border: 2px solid transparent;
              border-image: linear-gradient(45deg, #3b82f6, #10b981, #8b5cf6) 1;
              border-radius: 24px;
              backdrop-filter: blur(30px);
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.5),
                0 0 80px rgba(59, 130, 246, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
          `}</style>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              AI Receipt Processing
            </DialogTitle>
          </DialogHeader>

          <motion.div
            key={uploadState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="min-h-64"
          >
            {renderContent()}
          </motion.div>

          {error && uploadState === 'idle' && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={onCancel}
              variant="outline"
              className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}