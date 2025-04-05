
import { Customer } from "@/lib/schema";
import { CustomerDataPoint } from "../types";

export function processCustomerGrowth(customers: Customer[]): CustomerDataPoint[] {
  // Group customers by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  // Initialize data for the last 6 months
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    data.push({
      month: months[date.getMonth()],
      customers: 0,
      year: date.getFullYear()
    });
  }
  
  // Count customers by creation month
  customers.forEach(customer => {
    const creationDate = new Date(customer.created_at);
    const monthIndex = creationDate.getMonth();
    const year = creationDate.getFullYear();
    
    // Only consider data from current year
    if (year === currentYear) {
      const dataIndex = data.findIndex(item => item.month === months[monthIndex] && item.year === year);
      if (dataIndex !== -1) {
        data[dataIndex].customers++;
      }
    }
  });
  
  return data;
}

export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function formatPercentChange(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}
