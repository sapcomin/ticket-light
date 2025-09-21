export type TicketStatus = 'open' | 'in-progress' | 'closed';

// Supabase database types
export interface TicketRow {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  contact_number: string;
  product_category: string;
  product_model: string;
  serial_number: string;
  problem: string;
  status: TicketStatus;
}

export interface TicketHistoryRow {
  id: string;
  ticket_id: string;
  timestamp: string;
  action: string;
  description: string;
  status: TicketStatus | null;
}

// Application types (for UI components)
export interface Ticket {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  // Customer Information
  customerName: string;
  contactNumber: string;
  
  // Product Information
  productCategory: string;
  productModel: string;
  serialNumber: string;
  
  // Issue Information
  problem: string;
  status: TicketStatus;
  
  // History tracking
  history: TicketHistoryEntry[];
}

export interface TicketHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  status?: TicketStatus;
}

export interface CreateTicketData {
  customerName: string;
  contactNumber: string;
  productCategory: string;
  productModel: string;
  serialNumber: string;
  problem: string;
}