import React, { useState, useEffect } from "react";
import { Client } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, Building2, Mail, Phone, MapPin, Star, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

import ClientForm from "../components/clients/ClientForm";
import ClientCard from "../components/clients/ClientCard";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const clientData = await Client.list('-created_date', 200);
      setClients(clientData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (clientData) => {
    try {
      if (editingClient) {
        await Client.update(editingClient.id, clientData);
      } else {
        await Client.create(clientData);
      }
      setShowForm(false);
      setEditingClient(null);
      loadClients();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client. Please try again.');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };
  
  const handleDelete = async (client) => {
    if (confirm(`Are you sure you want to permanently delete client "${client.name}"? This will not delete their invoices, but the client record will be gone.`)) {
      try {
        await Client.delete(client.id);
        setEditingClient(null);
        setShowForm(false);
        await loadClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error deleting client. Please try again.');
      }
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.contact_person && client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <style jsx>{`
        /* REVOLUTIONARY CLIENT MANAGEMENT STYLES */
        .clients-container {
          background: linear-gradient(135deg, 
            #f8fafc 0%,
            #e2e8f0 25%,
            #cbd5e1 50%,
            #e2e8f0 75%,
            #f8fafc 100%
          );
          background-size: 400% 400%;
          animation: backgroundFlow 20s ease infinite;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }
        
        @keyframes backgroundFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Floating Light Rays */
        .light-ray {
          position: absolute;
          width: 2px;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .light-ray-1 {
          background: linear-gradient(to bottom, 
            transparent, 
            rgba(37, 99, 235, 0.6), 
            transparent
          );
          left: 20%;
          animation: lightFlow1 15s linear infinite;
        }
        
        .light-ray-2 {
          background: linear-gradient(to bottom, 
            transparent, 
            rgba(124, 58, 237, 0.5), 
            transparent
          );
          left: 60%;
          animation: lightFlow2 20s linear infinite;
          animation-delay: -5s;
        }
        
        .light-ray-3 {
          background: linear-gradient(to bottom, 
            transparent, 
            rgba(245, 158, 11, 0.4), 
            transparent
          );
          left: 80%;
          animation: lightFlow3 18s linear infinite;
          animation-delay: -10s;
        }
        
        @keyframes lightFlow1 {
          0% { transform: translateY(-100%) rotate(15deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(15deg); opacity: 0; }
        }
        
        @keyframes lightFlow2 {
          0% { transform: translateY(-100%) rotate(-10deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(-10deg); opacity: 0; }
        }
        
        @keyframes lightFlow3 {
          0% { transform: translateY(-100%) rotate(20deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(20deg); opacity: 0; }
        }
        
        /* Floating Particles */
        .particle {
          position: absolute;
          pointer-events: none;
          z-index: 1;
          border-radius: 50%;
          animation: floatParticle 25s ease-in-out infinite;
        }
        
        .particle-1 {
          width: 4px;
          height: 4px;
          background: #2563eb;
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .particle-2 {
          width: 6px;
          height: 6px;
          background: #7c3aed;
          top: 70%;
          left: 85%;
          animation-delay: 8s;
        }
        
        .particle-3 {
          width: 3px;
          height: 3px;
          background: #f59e0b;
          top: 40%;
          left: 75%;
          animation-delay: 16s;
        }
        
        @keyframes floatParticle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.4; 
          }
          25% { 
            transform: translateY(-40px) translateX(20px) rotate(90deg); 
            opacity: 1; 
          }
          50% { 
            transform: translateY(-80px) translateX(-15px) rotate(180deg); 
            opacity: 0.8; 
          }
          75% { 
            transform: translateY(-40px) translateX(25px) rotate(270deg); 
            opacity: 0.6; 
          }
        }
        
        /* Enhanced Header */
        .clients-header {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 250, 252, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(37, 99, 235, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          position: relative;
          overflow: hidden;
          z-index: 10;
        }
        
        .clients-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(37, 99, 235, 0.08),
            transparent
          );
          transition: left 0.8s ease;
        }
        
        .clients-header:hover::before {
          left: 100%;
        }
        
        .header-title {
          background: linear-gradient(135deg, 
            #1e293b 0%,
            #3730a3 50%,
            #1e293b 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 2;
        }
        
        .header-subtitle {
          color: #64748b;
          font-weight: 500;
          position: relative;
          z-index: 2;
        }
        
        .stats-container {
          display: flex;
          align-items: center;
          gap: 2rem;
          position: relative;
          z-index: 2;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.1) 0%,
            rgba(124, 58, 237, 0.05) 100%
          );
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(37, 99, 235, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .stat-item:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.15) 0%,
            rgba(124, 58, 237, 0.08) 100%
          );
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
        }
        
        /* Enhanced Search Bar */
        .search-container {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 250, 252, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 20px;
          box-shadow: 
            0 8px 32px rgba(37, 99, 235, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
          z-index: 10;
        }
        
        .search-container::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            #2563eb, 
            #7c3aed, 
            #f59e0b, 
            #2563eb
          );
          background-size: 200% 100%;
          animation: searchGlow 4s ease infinite;
        }
        
        @keyframes searchGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .search-input {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          padding: 1.25rem 1rem 1.25rem 3rem;
          font-size: 1rem;
          color: #1e293b;
          position: relative;
          z-index: 2;
        }
        
        .search-input::placeholder {
          color: #64748b;
          font-weight: 500;
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 2;
          transition: all 0.3s ease;
        }
        
        .search-container:hover .search-icon {
          color: #2563eb;
          transform: translateY(-50%) scale(1.1);
        }
        
        .results-badge {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          z-index: 2;
          animation: badgePulse 3s ease-in-out infinite;
        }
        
        @keyframes badgePulse {
          0%, 100% { 
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); 
            transform: translateY(-50%) scale(1);
          }
          50% { 
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5); 
            transform: translateY(-50%) scale(1.05);
          }
        }
        
        /* Enhanced Add Button */
        .add-client-btn {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #f59e0b 100%);
          border: none;
          color: white;
          padding: 1rem 2rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 
            0 8px 24px rgba(37, 99, 235, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          z-index: 10;
          cursor: pointer;
        }
        
        .add-client-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.3), 
            transparent
          );
          transition: left 0.5s ease;
        }
        
        .add-client-btn:hover::before {
          left: 100%;
        }
        
        .add-client-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 12px 32px rgba(37, 99, 235, 0.4),
            0 0 60px rgba(124, 58, 237, 0.3);
        }
        
        .add-client-btn:active {
          transform: translateY(0px) scale(0.98);
        }
        
        /* Empty State Enhancement */
        .empty-state {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 250, 252, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(37, 99, 235, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .empty-state::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(124, 58, 237, 0.06) 0%, transparent 50%);
          animation: emptyStateGlow 8s ease-in-out infinite;
        }
        
        @keyframes emptyStateGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .empty-icon {
          background: linear-gradient(135deg, #2563eb, #7c3aed, #f59e0b);
          border-radius: 50%;
          padding: 1.5rem;
          margin: 0 auto 1.5rem;
          width: fit-content;
          animation: emptyIconFloat 6s ease-in-out infinite;
        }
        
        @keyframes emptyIconFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        /* Loading Shimmer Enhancement */
        .loading-shimmer {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.9) 0%,
            rgba(248, 250, 252, 0.8) 100%
          );
          border: 1px solid rgba(37, 99, 235, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(15px);
          position: relative;
          overflow: hidden;
        }
        
        .loading-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(37, 99, 235, 0.1), 
            transparent
          );
          animation: shimmer 2s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* Quick Stats Cards */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 250, 252, 0.9) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 
            0 4px 16px rgba(37, 99, 235, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(37, 99, 235, 0.05), 
            transparent
          );
          transition: left 0.6s ease;
        }
        
        .stat-card:hover::before {
          left: 100%;
        }
        
        .stat-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            0 8px 24px rgba(37, 99, 235, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <div className="clients-container">
        {/* Floating Light Rays */}
        <div className="light-ray light-ray-1"></div>
        <div className="light-ray light-ray-2"></div>
        <div className="light-ray light-ray-3"></div>
        
        {/* Floating Particles */}
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>

        <div className="p-8 space-y-8 max-w-7xl mx-auto relative z-10">
          {/* Revolutionary Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="clients-header p-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <h1 className="header-title text-5xl font-black tracking-tight">
                  Client Management
                  <Sparkles className="inline-block w-8 h-8 ml-3 text-yellow-500" />
                </h1>
                <p className="header-subtitle text-xl">
                  Your central hub for all client relationships
                </p>
                <div className="stats-container">
                  <div className="stat-item">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{clients.length} Total Clients</span>
                  </div>
                  <div className="stat-item">
                    <Building2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">{clients.filter(c => c.status === 'active').length} Active</span>
                  </div>
                  <div className="stat-item">
                    <Star className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">Premium Service</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowForm(true)} 
                className="add-client-btn flex items-center gap-3"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Client</span>
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
          
          {/* Revolutionary Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="search-container"
          >
            <div className="relative">
              <Search className="search-icon w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients by name, contact person, or email address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="results-badge">
                {filteredClients.length} results
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          {clients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="quick-stats"
            >
              <div className="stat-card">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{clients.length}</h3>
                <p className="text-sm text-gray-600">Total Clients</p>
              </div>

              <div className="stat-card">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'active').length}</h3>
                <p className="text-sm text-gray-600">Active Clients</p>
              </div>

              <div className="stat-card">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{clients.filter(c => c.email).length}</h3>
                <p className="text-sm text-gray-600">With Email</p>
              </div>

              <div className="stat-card">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{clients.filter(c => c.phone).length}</h3>
                <p className="text-sm text-gray-600">With Phone</p>
              </div>
            </motion.div>
          )}

          {/* Enhanced Client Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="loading-shimmer p-6">
                  <div className="space-y-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-32" />
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <ClientCard client={client} onEdit={handleEdit} />
                </motion.div>
              ))
            ) : (
              <div className="xl:col-span-3 md:col-span-2">
                <div className="empty-state p-16 text-center">
                  <div className="empty-icon">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {searchTerm ? 'No Clients Found' : 'No Clients Yet'}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                      : 'Add your first client to start building strong business relationships and managing your customer base effectively.'
                    }
                  </p>
                  {!searchTerm && (
                    <button 
                      onClick={() => setShowForm(true)} 
                      className="add-client-btn"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Client
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Enhanced Client Form Modal */}
          {showForm && (
            <ClientForm
              client={editingClient}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingClient(null);
              }}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}