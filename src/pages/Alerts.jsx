import React from "react";
import { motion } from "framer-motion";
import FinancialAlertsPanel from "../components/alerts/FinancialAlertsPanel";

export default function Alerts() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold neuro-text-gradient mb-2">Financial Alerts</h1>
          <p className="text-gray-600 text-lg">AI-powered anomaly detection and financial monitoring</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <FinancialAlertsPanel />
      </motion.div>
    </div>
  );
}