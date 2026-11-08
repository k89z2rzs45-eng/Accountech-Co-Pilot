
import React, { useState, useEffect } from "react";
import { Budget } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { Plus, Target } from "lucide-react"; // Added Target import
import { Button } from "@/components/ui/button";
import BudgetForm from "../components/budgets/BudgetForm";
import BudgetCard from "../components/budgets/BudgetCard";
import BudgetInsights from "../components/budgets/BudgetInsights";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

/**
 * Calculates the usage statistics for a given budget based on transactions.
 */
const calculateBudgetUsage = (budget, transactions) => {
  try {
    if (!budget || !Array.isArray(transactions)) {
      return { spent: 0, percentage: 0, remaining: budget?.amount || 0, status: 'safe' };
    }

    // Ensure dates are parsed correctly
    const budgetStart = new Date(budget.start_date);
    const budgetEnd = new Date(budget.end_date);
    
    const relevantExpenses = transactions.filter(t => {
      // Filter by type, category, and date range
      if (t.type !== 'expense' || t.category !== budget.category) return false;
      const transactionDate = new Date(t.date);
      // Ensure transaction date falls within the budget period (inclusive)
      return transactionDate >= budgetStart && transactionDate <= budgetEnd;
    });

    const spent = relevantExpenses.reduce((sum, t) => sum + (t.amount || 0), 0);
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    const remaining = budget.amount - spent;
    
    let status = 'safe';
    if (percentage >= 100) {
      status = 'exceeded';
    } else if (percentage >= (budget.alert_threshold || 80)) { // Use budget's alert_threshold or default to 80
      status = 'warning';
    }

    return { spent, percentage, remaining, status };
  } catch (error) {
    console.error('Error calculating budget usage:', error);
    // Return a default safe state in case of an error
    return { spent: 0, percentage: 0, remaining: budget?.amount || 0, status: 'safe' };
  }
};

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    loadData();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === 'true') {
      setShowForm(true);
    }
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [budgetData, transactionData] = await Promise.all([
        Budget.list('-created_date'),
        Transaction.list('-date', 200) // Fetch recent transactions for calculations
      ]);
      setBudgets(budgetData);
      setTransactions(transactionData);
    } catch (error) {
      console.error("Error loading budget data:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };
  
  const handleDelete = async (budget) => {
    if (confirm(`Are you sure you want to permanently delete the budget "${budget.name}"? This action cannot be undone.`)) {
      setIsLoading(true); // Indicate loading while deleting
      try {
        await Budget.delete(budget.id);
        setEditingBudget(null);
        setShowForm(false);
        await loadData(); // Reload all data after successful deletion
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Error deleting budget. Please try again.');
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (editingBudget) {
        await Budget.update(editingBudget.id, formData);
      } else {
        await Budget.create(formData);
      }
      setShowForm(false);
      setEditingBudget(null);
      await loadData();
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save budget. Please try again.");
    }
    setIsLoading(false);
  };

  // Enriched budgets with usage data calculated in one place
  // This derived state ensures BudgetCard and BudgetInsights receive consistent, calculated data.
  const enrichedBudgets = budgets.map(budget => ({
    ...budget,
    usage: calculateBudgetUsage(budget, transactions)
  }));

  return (
    <div className="min-h-screen budgets-page-container">
      <style jsx>{`
        /* REVOLUTIONARY BUDGETS PAGE STYLES */
        .budgets-page-container {
          background: linear-gradient(135deg, 
            #0f172a 0%,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%,
            #0f172a 100%
          );
          background-size: 400% 400%;
          animation: backgroundFlow 20s ease infinite;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          max-width: 7xl;
          margin: 0 auto;
        }
        
        @keyframes backgroundFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Budget Target Particles */
        .budget-particles {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .target-particle {
          position: absolute;
          border-radius: 50%;
          animation: floatTargetParticle 20s ease-in-out infinite;
        }
        
        .target-particle-1 {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          top: 25%;
          left: 15%;
          animation-delay: 0s;
          box-shadow: 0 0 40px rgba(34, 197, 94, 0.8);
        }
        
        .target-particle-2 {
          width: 14px;
          height: 14px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          top: 75%;
          left: 85%;
          animation-delay: 7s;
          box-shadow: 0 0 50px rgba(245, 158, 11, 0.9);
        }
        
        .target-particle-3 {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          top: 45%;
          left: 65%;
          animation-delay: 14s;
          box-shadow: 0 0 35px rgba(239, 68, 68, 0.7);
        }
        
        @keyframes floatTargetParticle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
            opacity: 0.8; 
          }
          33% { 
            transform: translateY(-80px) translateX(60px) rotate(120deg) scale(1.8); 
            opacity: 1; 
          }
          66% { 
            transform: translateY(-160px) translateX(-40px) rotate(240deg) scale(2.5); 
            opacity: 0.9; 
          }
        }
        
        /* Revolutionary Budget Cards */
        .budget-card-revolutionary {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 25%,
            rgba(51, 65, 85, 0.94) 50%,
            rgba(30, 41, 59, 0.96) 75%,
            rgba(15, 23, 42, 0.98) 100%
          );
          backdrop-filter: blur(40px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #22c55e, #f59e0b, #ef4444, #22c55e) 1;
          border-radius: 24px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 100px rgba(34, 197, 94, 0.3),
            0 0 200px rgba(245, 158, 11, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: budgetPulse 10s ease-in-out infinite;
        }
        
        @keyframes budgetPulse {
          0%, 100% {
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.4),
              0 0 100px rgba(34, 197, 94, 0.3),
              0 0 200px rgba(245, 158, 11, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.4),
              0 0 120px rgba(245, 158, 11, 0.4),
              0 0 240px rgba(34, 197, 94, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }
        }
        
        .budget-card-revolutionary:hover {
          transform: translateY(-12px) rotateX(3deg) scale(1.03);
          border-image: linear-gradient(45deg, #f59e0b, #ef4444, #22c55e, #f59e0b) 1;
          box-shadow: 
            0 40px 80px rgba(0, 0, 0, 0.5),
            0 0 150px rgba(34, 197, 94, 0.4),
            0 0 300px rgba(245, 158, 11, 0.3),
            0 0 450px rgba(239, 68, 68, 0.2);
        }
        
        /* Progress Bar Enhancement */
        .budget-progress-revolutionary {
          height: 12px;
          background: linear-gradient(90deg, 
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 100%
          );
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          position: relative;
        }
        
        .budget-progress-revolutionary::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: progressShimmer 3s ease-in-out infinite;
        }
        
        @keyframes progressShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Budget Status Colors */
        .budget-safe {
          border-image: linear-gradient(45deg, #22c55e, #16a34a, #22c55e, #16a34a) 1;
        }
        
        .budget-warning {
          border-image: linear-gradient(45deg, #f59e0b, #d97706, #f59e0b, #d97706) 1;
          animation: warningPulse 4s ease-in-out infinite;
        }
        
        .budget-exceeded {
          border-image: linear-gradient(45deg, #ef4444, #dc2626, #ef4444, #dc2626) 1;
          animation: exceededPulse 2s ease-in-out infinite;
        }
        
        @keyframes warningPulse {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(245, 158, 11, 0.3); 
          }
          50% { 
            box-shadow: 0 0 60px rgba(245, 158, 11, 0.6); 
          }
        }
        
        @keyframes exceededPulse {
          0%, 100% { 
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.4); 
          }
          50% { 
            box-shadow: 0 0 80px rgba(239, 68, 68, 0.8); 
          }
        }
      `}</style>

      {/* Floating Budget Particles */}
      <div className="budget-particles">
        <div className="target-particle target-particle-1"></div>
        <div className="target-particle target-particle-2"></div>
        <div className="target-particle target-particle-3"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-orange-400 to-red-400 tracking-tight">
            🎯 Revolutionary Budgets
          </h1>
          <p className="text-gray-400 mt-2 text-xl">Master your financial targets with cosmic precision</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300" onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Create Budget
        </Button>
      </motion.div>

      {showForm && (
        <BudgetForm
          budget={editingBudget}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingBudget(null);
          }}
          onDelete={handleDelete}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <p className="text-white text-center">Loading revolutionary budgets...</p>
          ) : enrichedBudgets.length > 0 ? (
            enrichedBudgets.map((budget, index) => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`budget-card-revolutionary ${
                  budget.usage.status === 'safe' ? 'budget-safe' :
                  budget.usage.status === 'warning' ? 'budget-warning' :
                  'budget-exceeded'
                }`}
              >
                <div className="p-6">
                  <BudgetCard budget={budget} onEdit={handleEdit} />
                </div>
              </motion.div>
            ))
          ) : (
            <Card className="budget-card-revolutionary">
              <div className="p-12 text-center text-gray-400">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-2xl font-semibold text-white mb-2">No Budgets Found</h3>
                <p className="text-lg">Create your first revolutionary budget to start tracking your cosmic spending.</p>
              </div>
            </Card>
          )}
        </div>
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="budget-card-revolutionary"
          >
            <div className="p-6">
              <BudgetInsights budgets={enrichedBudgets} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
