export const safeFormatDate = (dateString, formatPattern = 'MMM d, yyyy') => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    // Simple date formatting without external library dependency
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount, currency = 'USD') => {
  try {
    if (typeof amount !== 'number') return `${currency} 0.00`;
    return `${currency} ${amount.toFixed(2)}`;
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency} 0.00`;
  }
};