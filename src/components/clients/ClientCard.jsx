import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, MapPin, Edit, Trash2, User, Building2, Star, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export default function ClientCard({ client, onEdit, onDelete }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const statusColors = {
    active: { bg: "from-green-500/20 to-emerald-500/20", text: "text-green-300", border: "border-green-500/30" },
    inactive: { bg: "from-gray-500/20 to-slate-500/20", text: "text-gray-300", border: "border-gray-500/30" },
    archived: { bg: "from-red-500/20 to-rose-500/20", text: "text-red-300", border: "border-red-500/30" }
  };

  const statusColor = statusColors[client.status] || statusColors.active;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group"
    >
      <style jsx>{`
        /* REVOLUTIONARY CLIENT CARD STYLES */
        .client-card-container {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 25%,
            rgba(51, 65, 85, 0.94) 50%,
            rgba(30, 41, 59, 0.96) 75%,
            rgba(15, 23, 42, 0.98) 100%
          );
          backdrop-filter: blur(40px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #2563eb, #7c3aed, #f59e0b, #2563eb) 1;
          border-radius: 20px;
          box-shadow: 
            0 12px 32px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(37, 99, 235, 0.2),
            0 0 120px rgba(124, 58, 237, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          animation: cardPulse 6s ease-in-out infinite;
        }
        
        @keyframes cardPulse {
          0%, 100% {
            box-shadow: 
              0 12px 32px rgba(0, 0, 0, 0.4),
              0 0 60px rgba(37, 99, 235, 0.2),
              0 0 120px rgba(124, 58, 237, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 
              0 12px 32px rgba(0, 0, 0, 0.4),
              0 0 80px rgba(124, 58, 237, 0.3),
              0 0 160px rgba(245, 158, 11, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }
        }
        
        .client-card-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.06) 0%, transparent 50%);
          animation: backgroundShimmer 15s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        
        @keyframes backgroundShimmer {
          0%, 100% { 
            opacity: 0.5; 
            transform: scale(1) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.1) rotate(5deg); 
          }
        }
        
        .client-card-container:hover {
          border-image: linear-gradient(45deg, #f59e0b, #2563eb, #7c3aed, #f59e0b) 1;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 0 80px rgba(37, 99, 235, 0.4),
            0 0 160px rgba(124, 58, 237, 0.3),
            0 0 240px rgba(245, 158, 11, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transform: translateY(-8px) rotateX(5deg) scale(1.02);
        }
        
        .card-content {
          position: relative;
          z-index: 10;
          padding: 1.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        /* Avatar with Enhanced Effects */
        .client-avatar {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #f59e0b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          box-shadow: 
            0 8px 24px rgba(37, 99, 235, 0.3),
            0 0 0 3px rgba(255, 255, 255, 0.1),
            inset 0 2px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .client-avatar::before {
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
          transition: left 0.6s ease;
        }
        
        .client-card-container:hover .client-avatar::before {
          left: 100%;
        }
        
        .client-card-container:hover .client-avatar {
          transform: scale(1.1) rotateY(10deg);
          box-shadow: 
            0 12px 32px rgba(37, 99, 235, 0.4),
            0 0 0 4px rgba(255, 255, 255, 0.15),
            inset 0 2px 0 rgba(255, 255, 255, 0.3);
          animation: avatarGlow 2s ease-in-out infinite;
        }
        
        @keyframes avatarGlow {
          0%, 100% { 
            box-shadow: 
              0 12px 32px rgba(37, 99, 235, 0.4),
              0 0 0 4px rgba(255, 255, 255, 0.15),
              inset 0 2px 0 rgba(255, 255, 255, 0.3);
          }
          50% { 
            box-shadow: 
              0 16px 40px rgba(124, 58, 237, 0.5),
              0 0 0 6px rgba(255, 255, 255, 0.2),
              inset 0 2px 0 rgba(255, 255, 255, 0.4);
          }
        }
        
        /* Enhanced Status Badge */
        .status-badge {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.2) 0%, 
            rgba(5, 150, 105, 0.1) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
          transition: all 0.3s ease;
        }
        
        .client-card-container:hover .status-badge {
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.3) 0%, 
            rgba(5, 150, 105, 0.15) 100%
          );
          border: 1px solid rgba(16, 185, 129, 0.5);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        /* Enhanced Contact Information */
        .contact-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 8px;
          backdrop-filter: blur(5px);
        }
        
        .contact-info:hover {
          color: rgba(255, 255, 255, 1);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.05) 0%, 
            rgba(255, 255, 255, 0.02) 100%
          );
          transform: translateX(4px);
        }
        
        .contact-icon {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.15) 0%, 
            rgba(124, 58, 237, 0.1) 100%
          );
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .contact-info:hover .contact-icon {
          background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.25) 0%, 
            rgba(124, 58, 237, 0.2) 100%
          );
          border: 1px solid rgba(37, 99, 235, 0.4);
          transform: scale(1.1);
        }
        
        /* Enhanced Client Name */
        .client-name {
          background: linear-gradient(135deg, 
            #ffffff 0%, 
            #e2e8f0 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          font-size: 1.25rem;
          line-height: 1.3;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .client-card-container:hover .client-name {
          background: linear-gradient(135deg, 
            #ffffff 0%, 
            #cbd5e1 50%, 
            #94a3b8 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transform: scale(1.02);
        }
        
        /* Enhanced Notes Section */
        .client-notes {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          line-height: 1.5;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.05) 0%, 
            rgba(255, 255, 255, 0.02) 100%
          );
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 1rem;
          transition: all 0.3s ease;
        }
        
        .client-card-container:hover .client-notes {
          color: rgba(255, 255, 255, 0.9);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.04) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Enhanced Action Button */
        .action-button {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .action-button:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.08) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 1);
          transform: scale(1.05);
        }
        
        /* Floating Effect Particles */
        .card-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #2563eb;
          border-radius: 50%;
          opacity: 0.6;
          animation: floatParticle 8s ease-in-out infinite;
        }
        
        .particle-1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
          background: #2563eb;
        }
        
        .particle-2 {
          top: 70%;
          left: 80%;
          animation-delay: 3s;
          background: #7c3aed;
        }
        
        .particle-3 {
          top: 50%;
          left: 60%;
          animation-delay: 6s;
          background: #f59e0b;
        }
        
        @keyframes floatParticle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.4; 
          }
          50% { 
            transform: translateY(-20px) translateX(10px) scale(1.2); 
            opacity: 0.8; 
          }
        }
      `}</style>

      <Card className="client-card-container h-full">
        {/* Floating Particles */}
        <div className="card-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>

        <CardContent className="card-content">
          {/* Header with Avatar and Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="client-avatar">
                {getInitials(client.name)}
              </div>
              <div>
                <h3 className="client-name">{client.name}</h3>
                {client.contact_person && (
                  <p className="text-sm text-gray-300">
                    Contact: {client.contact_person}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-badge">
                {client.status || 'Active'}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="action-button w-8 h-8"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-slate-800 text-white border-slate-700"
                  align="end"
                >
                  <DropdownMenuItem 
                    onClick={() => onEdit?.(client)}
                    className="hover:bg-slate-700 text-white focus:bg-slate-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Client
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(client)}
                    className="hover:bg-red-600 text-red-200 focus:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Client
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Enhanced Contact Information */}
          <div className="space-y-3 mb-4">
            {client.email && (
              <div className="contact-info">
                <div className="contact-icon">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm truncate">{client.email}</span>
              </div>
            )}

            {client.phone && (
              <div className="contact-info">
                <div className="contact-icon">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm">{client.phone}</span>
              </div>
            )}

            {client.address && (
              <div className="contact-info">
                <div className="contact-icon">
                  <MapPin className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-sm">
                  {typeof client.address === 'string' 
                    ? client.address 
                    : `${client.address.city}, ${client.address.country}`
                  }
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Notes Section */}
          {client.notes && (
            <div className="client-notes">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                  Client Notes
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                {client.notes}
              </p>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div className="mt-auto pt-4">
            <Button
              onClick={() => onEdit?.(client)}
              className="w-full action-button flex items-center gap-2 py-3"
            >
              <Edit className="w-4 h-4" />
              <span className="font-semibold">Edit Client Details</span>
              <Zap className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}