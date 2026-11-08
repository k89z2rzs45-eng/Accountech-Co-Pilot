
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InventoryAlerts({ alerts, products = [], onAutoReorder, onRefresh }) {
  const priorityStyles = {
    critical: {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      card: "bg-red-50 border-l-4 border-red-500",
      text: "text-red-800"
    },
    high: {
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      card: "bg-orange-50 border-l-4 border-orange-500",
      text: "text-orange-800"
    },
    medium: {
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      card: "bg-yellow-50 border-l-4 border-yellow-500",
      text: "text-yellow-800"
    },
    low: {
      icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
      card: "bg-blue-50 border-l-4 border-blue-500",
      text: "text-blue-800"
    },
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');

  if (activeAlerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">All Clear!</h3>
          <p className="text-gray-600">No active inventory alerts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activeAlerts.map(alert => {
        const product = products.find(p => p.sku === alert.product_sku);
        const styles = priorityStyles[alert.priority] || priorityStyles.low;
        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={styles.card}>
              <CardContent className={`p-4 flex items-center justify-between ${styles.text}`}>
                <div className="flex items-center gap-4">
                  {styles.icon}
                  <div>
                    <p className="font-bold">{alert.message}</p>
                    <p className="text-sm opacity-80">{alert.suggested_action}</p>
                  </div>
                </div>
                {alert.auto_action_available && product && (
                  <Button size="sm" onClick={() => onAutoReorder(product)}>
                    <Zap className="w-4 h-4 mr-2" />
                    Auto-Resolve
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
