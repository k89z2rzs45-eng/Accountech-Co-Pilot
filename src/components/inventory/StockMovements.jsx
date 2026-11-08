
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Repeat, Truck, XCircle, Package, ArrowLeftRight } from 'lucide-react';
import { safeFormatDate } from '@/components/utils/formatters'; // Import the safe formatter

export default function StockMovements({ movements, products = [] }) {
  const movementTypes = {
    purchase: { icon: <ArrowDown className="w-4 h-4 text-green-500" />, label: "Purchase", color: "bg-green-100 text-green-800" },
    sale: { icon: <ArrowUp className="w-4 h-4 text-red-500" />, label: "Sale", color: "bg-red-100 text-red-800" },
    adjustment: { icon: <Repeat className="w-4 h-4 text-blue-500" />, label: "Adjustment", color: "bg-blue-100 text-blue-800" },
    transfer: { icon: <ArrowLeftRight className="w-4 h-4 text-purple-500" />, label: "Transfer", color: "bg-purple-100 text-purple-800" },
    return: { icon: <XCircle className="w-4 h-4 text-orange-500" />, label: "Return", color: "bg-orange-100 text-orange-800" },
    waste: { icon: <XCircle className="w-4 h-4 text-red-500" />, label: "Waste", color: "bg-red-100 text-red-800" },
    production: { icon: <Package className="w-4 h-4 text-green-500" />, label: "Production", color: "bg-green-100 text-green-800" }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Stock Movements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No stock movements recorded yet</p>
            </div>
          ) : (
            movements.slice(0, 20).map((movement, index) => {
              const product = products.find(p => p.sku === movement.product_sku);
              const movementType = movementTypes[movement.movement_type] || movementTypes.adjustment;

              return (
                <div key={movement.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                      {movementType.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {product?.name || movement.product_sku}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {movement.reason || `${movementType.label} movement`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {safeFormatDate(movement.created_date, 'MMM d, yyyy HH:mm')} 
                        {movement.location_from && movement.location_to && 
                          ` • ${movement.location_from} → ${movement.location_to}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={movementType.color}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </Badge>
                    {movement.total_cost && (
                      <p className="text-sm text-gray-600 mt-1">
                        {movement.currency || 'USD'} {movement.total_cost.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
