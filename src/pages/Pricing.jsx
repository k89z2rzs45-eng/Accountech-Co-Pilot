
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User } from '@/api/entities';
import { Company } from '@/api/entities';
import {
  Check,
  X,
  Zap,
  Crown,
  Rocket,
  Star,
  Sparkles,
  Shield,
  Users,
  Database,
  Brain,
  Globe,
  Infinity,
  TrendingUp,
  Award,
  Target,
  Layers,
  Bot,
  Lock,
  Smartphone,
  Cloud,
  HeadphonesIcon,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('professional');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const companies = await Company.list();
      const userCompany = companies[0] || null;
      setCompany(userCompany);
      
      if (userCompany?.subscription_tier) {
        setSelectedPlan(userCompany.subscription_tier);
      }
    } catch (error) {
      console.log('User not authenticated');
    }
  };

  // 🚀 SUBSCRIPTION PLANS WITH IRRESISTIBLE PRICING
  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      subtitle: 'Perfect for Solo Entrepreneurs',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      glowColor: 'shadow-blue-500/25',
      popular: false,
      monthlyPrice: 29,
      yearlyPrice: 290, // 2 months free
      savings: '$58/year',
      description: 'Everything you need to start your business journey',
      features: [
        { name: 'Core Financial Management', included: true, highlight: false },
        { name: 'Transaction Tracking (Up to 1,000/month)', included: true, highlight: false },
        { name: 'Invoice Creation & Sending', included: true, highlight: false },
        { name: 'Basic Tax Reports', included: true, highlight: false },
        { name: 'Expense Management', included: true, highlight: false },
        { name: 'Mobile App Access', included: true, highlight: false },
        { name: 'Email Support', included: true, highlight: false },
        { name: '1 User Account', included: true, highlight: false },
        { name: 'Basic Analytics', included: true, highlight: false },
        { name: 'Data Export (PDF/CSV)', included: true, highlight: false },
        { name: 'CRM System', included: false, highlight: false },
        { name: 'HR Management', included: false, highlight: false },
        { name: 'AI Assistant', included: false, highlight: false },
        { name: 'Advanced Analytics', included: false, highlight: false },
        { name: 'Custom Workflows', included: false, highlight: false }
      ],
      cta: 'Start Free Trial',
      trialDays: 14
    },
    {
      id: 'professional',
      name: 'Professional',
      subtitle: 'Most Popular for Growing Businesses',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      glowColor: 'shadow-purple-500/35',
      popular: true,
      monthlyPrice: 79,
      yearlyPrice: 790, // 2 months free
      savings: '$158/year',
      description: 'Complete business management with AI power',
      features: [
        { name: 'Everything in Starter', included: true, highlight: false },
        { name: 'Unlimited Transactions', included: true, highlight: true },
        { name: 'Advanced Tax Compliance', included: true, highlight: true },
        { name: 'Full CRM System', included: true, highlight: true },
        { name: 'Basic HR Management', included: true, highlight: true },
        { name: 'AI-Powered Insights', included: true, highlight: true },
        { name: 'Inventory Management', included: true, highlight: false },
        { name: 'Up to 5 Users', included: true, highlight: false },
        { name: 'Advanced Analytics & Forecasting', included: true, highlight: true },
        { name: 'Custom Branding', included: true, highlight: false },
        { name: 'Priority Support', included: true, highlight: false },
        { name: 'API Access', included: true, highlight: false },
        { name: 'Workflow Automation', included: true, highlight: true },
        { name: 'Advanced Integrations', included: true, highlight: false },
        { name: 'Multi-Currency Support', included: true, highlight: false }
      ],
      cta: 'Start Free Trial',
      trialDays: 14
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      subtitle: 'Ultimate Business Command Center',
      icon: Rocket,
      color: 'from-orange-500 to-red-500',
      glowColor: 'shadow-orange-500/35',
      popular: false,
      monthlyPrice: 199,
      yearlyPrice: 1990, // 2 months free
      savings: '$398/year',
      description: 'Everything + unlimited scale & premium features',
      features: [
        { name: 'Everything in Professional', included: true, highlight: false },
        { name: 'Unlimited Users & Companies', included: true, highlight: true },
        { name: 'Full HR Suite + Payroll', included: true, highlight: true },
        { name: 'Advanced AI Assistant (Jarvis)', included: true, highlight: true },
        { name: 'Business Intelligence Dashboard', included: true, highlight: true },
        { name: 'Advanced Security & Compliance', included: true, highlight: true },
        { name: 'Custom Workflows & Automation', included: true, highlight: true },
        { name: 'White-Label Solution', included: true, highlight: true },
        { name: 'Dedicated Account Manager', included: true, highlight: false },
        { name: '24/7 Phone Support', included: true, highlight: false },
        { name: 'Custom Integrations', included: true, highlight: false },
        { name: 'Advanced Reporting Suite', included: true, highlight: false },
        { name: 'Multi-Location Support', included: true, highlight: false },
        { name: 'Enterprise SSO', included: true, highlight: false },
        { name: 'Priority Feature Requests', included: true, highlight: false }
      ],
      cta: 'Contact Sales',
      trialDays: 30
    }
  ];

  const handlePlanSelection = async (planId) => {
    setSelectedPlan(planId);
    
    // TODO: Integrate with payment processor (Stripe)
    if (planId === 'enterprise') {
      // Redirect to contact sales
      window.open('mailto:sales@accountech.com?subject=Enterprise Plan Inquiry', '_blank');
    } else {
      // Redirect to checkout
      console.log(`Starting checkout for ${planId} plan`);
      // TODO: Implement Stripe checkout
    }
  };

  return (
    <div className="pricing-future-container">
      <style jsx>{`
        .pricing-future-container {
          background: linear-gradient(135deg, 
            #0a0a0a 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f0f23 75%,
            #000000 100%
          );
          background-size: 400% 400%;
          animation: cosmicPricingFlow 20s ease infinite;
          position: relative;
          overflow: hidden;
          padding: 4rem 2rem;
          min-height: 100vh;
        }
        
        @keyframes cosmicPricingFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .pricing-future-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 0, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 90%, rgba(0, 255, 0, 0.04) 0%, transparent 50%);
          animation: pricingParticles 25s linear infinite;
          z-index: 1;
          pointer-events: none;
        }
        
        @keyframes pricingParticles {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          100% { transform: translate(-50px, -50px) rotate(360deg) scale(1.1); }
        }
        
        .pricing-title {
          background: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00, #ffff00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 4rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 1rem;
          position: relative;
          z-index: 10;
          animation: titlePulse 4s ease-in-out infinite;
        }
        
        @keyframes titlePulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(1deg); }
        }
        
        .pricing-subtitle {
          color: #94a3b8;
          text-align: center;
          font-size: 1.5rem;
          margin-bottom: 3rem;
          position: relative;
          z-index: 10;
        }
        
        .plan-card {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 100%
          );
          backdrop-filter: blur(30px);
          border: 2px solid transparent;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          transform: translateZ(0);
          will-change: transform;
        }
        
        .plan-card:hover {
          transform: translateY(-12px) scale(1.02) translateZ(0);
        }
        
        .plan-card.popular {
          border-image: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff) 1;
          animation: popularPulse 3s ease-in-out infinite;
        }
        
        @keyframes popularPulse {
          0%, 100% {
            box-shadow: 
              0 25px 50px rgba(255, 0, 255, 0.3),
              0 0 80px rgba(0, 255, 255, 0.2);
          }
          50% {
            box-shadow: 
              0 35px 70px rgba(255, 0, 255, 0.5),
              0 0 120px rgba(0, 255, 255, 0.4);
          }
        }
        
        .plan-card.starter {
          border-image: linear-gradient(45deg, #00ffff, #0080ff) 1;
        }
        
        .plan-card.starter:hover {
          box-shadow: 
            0 25px 50px rgba(0, 128, 255, 0.3),
            0 0 80px rgba(0, 255, 255, 0.2);
        }
        
        .plan-card.enterprise {
          border-image: linear-gradient(45deg, #ff4500, #ff6b35) 1;
        }
        
        .plan-card.enterprise:hover {
          box-shadow: 
            0 25px 50px rgba(255, 69, 0, 0.3),
            0 0 80px rgba(255, 107, 53, 0.2);
        }
        
        .plan-header {
          position: relative;
          padding: 2rem;
          text-align: center;
        }
        
        .plan-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          padding: 1rem;
          border-radius: 16px;
          backdrop-filter: blur(15px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .plan-name {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .plan-subtitle {
          color: #94a3b8;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        
        .plan-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .price-currency {
          font-size: 1.5rem;
          font-weight: 700;
          color: #00ffff;
        }
        
        .price-amount {
          font-size: 4rem;
          font-weight: 900;
          color: #ffffff;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
          margin: 0 0.5rem;
        }
        
        .price-period {
          font-size: 1.2rem;
          color: #94a3b8;
          font-weight: 600;
        }
        
        .savings-badge {
          background: linear-gradient(135deg, #00ff88, #00ffaa);
          color: #000000;
          font-weight: 800;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          display: inline-block;
        }
        
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ff00ff, #00ffff);
          color: #000000;
          font-weight: 900;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-size: 0.875rem;
          z-index: 20;
          animation: badgePulse 2s ease-in-out infinite;
        }
        
        @keyframes badgePulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
        }
        
        .feature-list {
          padding: 0 2rem 2rem;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .feature-item:last-child {
          border-bottom: none;
        }
        
        .feature-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }
        
        .feature-icon.included {
          color: #00ff88;
        }
        
        .feature-icon.not-included {
          color: #ff4444;
        }
        
        .feature-text {
          color: #ffffff;
          font-weight: 500;
          flex: 1;
        }
        
        .feature-text.not-included {
          color: #64748b;
          text-decoration: line-through;
        }
        
        .feature-text.highlight {
          color: #00ffff;
          font-weight: 700;
        }
        
        .plan-cta {
          padding: 0 2rem 2rem;
        }
        
        .cta-button {
          width: 100%;
          padding: 1rem 2rem;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 700;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .cta-button.starter {
          background: linear-gradient(135deg, #00ffff, #0080ff);
          color: #000000;
        }
        
        .cta-button.professional {
          background: linear-gradient(135deg, #ff00ff, #00ffff);
          color: #000000;
        }
        
        .cta-button.enterprise {
          background: linear-gradient(135deg, #ff4500, #ff6b35);
          color: #ffffff;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .yearly-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          position: relative;
          z-index: 10;
        }
        
        .toggle-label {
          color: #ffffff;
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .toggle-label.active {
          color: #00ffff;
        }
        
        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .pricing-title {
            font-size: 2.5rem;
          }
          
          .plan-card {
            margin-bottom: 2rem;
          }
          
          .price-amount {
            font-size: 3rem;
          }
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="pricing-title">
          💎 Choose Your Power Level
        </h1>
        <p className="pricing-subtitle">
          Transform your business with the ultimate management platform
        </p>
        
        {/* Yearly Toggle */}
        <div className="yearly-toggle">
          <span className={`toggle-label ${!isYearly ? 'active' : ''}`}>Monthly</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-cyan-500"
          />
          <span className={`toggle-label ${isYearly ? 'active' : ''}`}>
            Yearly 
            <Badge className="ml-2 bg-green-500 text-black font-bold">Save 20%</Badge>
          </span>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`plan-card ${plan.id} ${plan.popular ? 'popular' : ''}`}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            {plan.popular && (
              <div className="popular-badge">
                🔥 MOST POPULAR
              </div>
            )}
            
            {/* Plan Header */}
            <div className="plan-header">
              <div className={`plan-icon bg-gradient-to-br ${plan.color}`}>
                <plan.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-subtitle">{plan.subtitle}</p>
              
              <div className="plan-price">
                <span className="price-currency">$</span>
                <span className="price-amount">
                  {isYearly ? Math.floor(plan.yearlyPrice / 12) : plan.monthlyPrice}
                </span>
                <span className="price-period">/mo</span>
              </div>
              
              {isYearly && (
                <div className="savings-badge">
                  💰 Save {plan.savings}
                </div>
              )}
              
              <p className="text-gray-300 text-sm mt-3">{plan.description}</p>
            </div>

            {/* Features List */}
            <div className="feature-list">
              {plan.features.map((feature, featureIndex) => (
                <motion.div
                  key={featureIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.2) + (featureIndex * 0.05) }}
                  className="feature-item"
                >
                  {feature.included ? (
                    <Check className="feature-icon included" />
                  ) : (
                    <X className="feature-icon not-included" />
                  )}
                  <span className={`feature-text ${feature.included ? '' : 'not-included'} ${feature.highlight ? 'highlight' : ''}`}>
                    {feature.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="plan-cta">
              <Button
                onClick={() => handlePlanSelection(plan.id)}
                className={`cta-button ${plan.id}`}
                size="lg"
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <p className="text-center text-gray-400 text-sm mt-3">
                {plan.trialDays}-day free trial • No credit card required
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enterprise Features Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-8">
          🚀 Why AccounTech is the Ultimate Business Platform
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Brain, title: 'AI-Powered', desc: 'Smart automation & insights' },
            { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption' },
            { icon: Smartphone, title: 'Mobile First', desc: 'Work from anywhere' },
            { icon: Infinity, title: 'Unlimited Scale', desc: 'Grows with your business' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
            >
              <feature.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Money Back Guarantee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center mt-16 p-8 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-2xl border border-green-500/30 max-w-4xl mx-auto"
      >
        <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">💰 30-Day Money-Back Guarantee</h3>
        <p className="text-gray-300">
          Not satisfied? Get a full refund within 30 days. No questions asked. 
          We're so confident you'll love AccounTech, we put our money where our mouth is.
        </p>
      </motion.div>
    </div>
  );
}
