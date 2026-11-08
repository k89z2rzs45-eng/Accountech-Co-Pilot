import { createLocalEntityManager, localUser } from './localStore';

export const Transaction = createLocalEntityManager('Transaction');
export const Invoice = createLocalEntityManager('Invoice');
export const TaxReport = createLocalEntityManager('TaxReport');
export const Budget = createLocalEntityManager('Budget');
export const Employee = createLocalEntityManager('Employee');
export const Payroll = createLocalEntityManager('Payroll');
export const Company = createLocalEntityManager('Company');
export const ForecastReport = createLocalEntityManager('ForecastReport');
export const AnalyticsReport = createLocalEntityManager('AnalyticsReport');
export const Workflow = createLocalEntityManager('Workflow');
export const WorkflowExecution = createLocalEntityManager('WorkflowExecution');
export const Client = createLocalEntityManager('Client');
export const Product = createLocalEntityManager('Product');
export const InventoryMovement = createLocalEntityManager('InventoryMovement');
export const PurchaseOrder = createLocalEntityManager('PurchaseOrder');
export const InventoryAlert = createLocalEntityManager('InventoryAlert');
export const FinancialAlert = createLocalEntityManager('FinancialAlert');
export const Expense = createLocalEntityManager('Expense');
export const TaxDeduction = createLocalEntityManager('TaxDeduction');
export const TaxCompliance = createLocalEntityManager('TaxCompliance');
export const Lead = createLocalEntityManager('Lead');
export const Deal = createLocalEntityManager('Deal');
export const Contact = createLocalEntityManager('Contact');
export const Activity = createLocalEntityManager('Activity');
export const Campaign = createLocalEntityManager('Campaign');
export const Task = createLocalEntityManager('Task');
export const Note = createLocalEntityManager('Note');
export const Document = createLocalEntityManager('Document');
export const TimeTracking = createLocalEntityManager('TimeTracking');
export const LeaveRequest = createLocalEntityManager('LeaveRequest');
export const PerformanceReview = createLocalEntityManager('PerformanceReview');

// Auth / User
export const User = localUser;