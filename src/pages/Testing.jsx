import React from "react";
import { motion } from "framer-motion";
import TestDataGenerator from "../components/testing/TestDataGenerator";

export default function Testing() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🧪 AccounTech Testing Lab
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive testing dashboard for all app functionality, data flows, and integrations.
          Verify that everything works smoothly across all features.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TestDataGenerator />
      </motion.div>
    </div>
  );
}