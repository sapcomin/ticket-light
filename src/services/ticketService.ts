import { supabase } from '@/integrations/supabase/client';
import { Ticket, TicketRow, TicketHistoryRow, TicketHistoryEntry, CreateTicketData, TicketStatus } from '@/types/ticket';

// Helper function to convert database row to application type
const convertTicketRowToTicket = (ticketRow: TicketRow, history: TicketHistoryEntry[] = []): Ticket => {
  return {
    id: ticketRow.id,
    createdAt: ticketRow.created_at,
    updatedAt: ticketRow.updated_at,
    customerName: ticketRow.customer_name,
    contactNumber: ticketRow.contact_number,
    productCategory: ticketRow.product_category,
    productModel: ticketRow.product_model,
    serialNumber: ticketRow.serial_number,
    problem: ticketRow.problem,
    status: ticketRow.status,
    history
  };
};

// Helper function to convert application type to database insert type
const convertCreateTicketDataToInsert = (data: CreateTicketData) => {
  return {
    customer_name: data.customerName,
    contact_number: data.contactNumber,
    product_category: data.productCategory,
    product_model: data.productModel,
    serial_number: data.serialNumber,
    problem: data.problem,
    status: 'open' as TicketStatus
  };
};

// Helper function to convert history entry to database insert type
const convertHistoryEntryToInsert = (ticketId: string, entry: Omit<TicketHistoryEntry, 'id' | 'timestamp'>) => {
  return {
    ticket_id: ticketId,
    action: entry.action,
    description: entry.description,
    status: entry.status || null
  };
};

// Get all tickets with their history
export const getAllTickets = async (): Promise<Ticket[]> => {
  try {
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .order('updated_at', { ascending: false });

    if (ticketsError) throw ticketsError;

    // Get history for all tickets
    const { data: history, error: historyError } = await supabase
      .from('ticket_history')
      .select('*')
      .order('timestamp', { ascending: false });

    if (historyError) throw historyError;

    // Group history by ticket_id
    const historyByTicket = history.reduce((acc, entry) => {
      if (!acc[entry.ticket_id]) {
        acc[entry.ticket_id] = [];
      }
      acc[entry.ticket_id].push({
        id: entry.id,
        timestamp: entry.timestamp,
        action: entry.action,
        description: entry.description,
        status: entry.status || undefined
      });
      return acc;
    }, {} as Record<string, TicketHistoryEntry[]>);

    // Convert to application types
    return tickets.map(ticket => 
      convertTicketRowToTicket(ticket, historyByTicket[ticket.id] || [])
    );
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// Get a single ticket by ID
export const getTicketById = async (id: string): Promise<Ticket | null> => {
  try {
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (ticketError) {
      if (ticketError.code === 'PGRST116') return null; // No rows found
      throw ticketError;
    }

    // Get ticket history
    const { data: history, error: historyError } = await supabase
      .from('ticket_history')
      .select('*')
      .eq('ticket_id', id)
      .order('timestamp', { ascending: false });

    if (historyError) throw historyError;

    const historyEntries: TicketHistoryEntry[] = history.map(entry => ({
      id: entry.id,
      timestamp: entry.timestamp,
      action: entry.action,
      description: entry.description,
      status: entry.status || undefined
    }));

    return convertTicketRowToTicket(ticket, historyEntries);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

// Create a new ticket
export const createTicket = async (data: CreateTicketData): Promise<Ticket> => {
  try {
    // Insert ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert(convertCreateTicketDataToInsert(data))
      .select()
      .single();

    if (ticketError) throw ticketError;

    // Create initial history entry
    const historyEntry = {
      ticket_id: ticket.id,
      action: 'Created',
      description: 'Ticket created by customer service',
      status: 'open' as TicketStatus
    };

    const { error: historyError } = await supabase
      .from('ticket_history')
      .insert(historyEntry);

    if (historyError) throw historyError;

    // Return the created ticket with history
    return convertTicketRowToTicket(ticket, [{
      id: `temp_${Date.now()}`,
      timestamp: ticket.created_at,
      action: 'Created',
      description: 'Ticket created by customer service',
      status: 'open'
    }]);
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

// Update ticket status and add history entry
export const updateTicket = async (
  id: string, 
  updates: { status?: TicketStatus; note?: string }
): Promise<Ticket> => {
  try {
    // Get current ticket
    const currentTicket = await getTicketById(id);
    if (!currentTicket) throw new Error('Ticket not found');

    const { status, note } = updates;
    const newStatus = status || currentTicket.status;

    // Update ticket if status changed
    let updatedTicket = currentTicket;
    if (status && status !== currentTicket.status) {
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (ticketError) throw ticketError;
      updatedTicket = convertTicketRowToTicket(ticket, currentTicket.history);
    }

    // Add history entry if there's a note or status change
    if (note || (status && status !== currentTicket.status)) {
      const action = status && status !== currentTicket.status 
        ? `Status changed to ${status}` 
        : 'Updated';
      
      const description = note || 'Ticket updated';

      const historyEntry = {
        ticket_id: id,
        action,
        description,
        status: status || null
      };

      const { error: historyError } = await supabase
        .from('ticket_history')
        .insert(historyEntry);

      if (historyError) throw historyError;

      // Add to local history for immediate UI update
      const newHistoryEntry: TicketHistoryEntry = {
        id: `temp_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action,
        description,
        status: status || undefined
      };

      updatedTicket.history = [newHistoryEntry, ...updatedTicket.history];
    }

    return updatedTicket;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

// Delete a ticket
export const deleteTicket = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

// Search tickets
export const searchTickets = async (query: string): Promise<Ticket[]> => {
  try {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .or(`customer_name.ilike.%${query}%,product_model.ilike.%${query}%,serial_number.ilike.%${query}%,id.ilike.%${query}%`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Get history for found tickets
    const ticketIds = tickets.map(t => t.id);
    const { data: history, error: historyError } = await supabase
      .from('ticket_history')
      .select('*')
      .in('ticket_id', ticketIds)
      .order('timestamp', { ascending: false });

    if (historyError) throw historyError;

    // Group history by ticket_id
    const historyByTicket = history.reduce((acc, entry) => {
      if (!acc[entry.ticket_id]) {
        acc[entry.ticket_id] = [];
      }
      acc[entry.ticket_id].push({
        id: entry.id,
        timestamp: entry.timestamp,
        action: entry.action,
        description: entry.description,
        status: entry.status || undefined
      });
      return acc;
    }, {} as Record<string, TicketHistoryEntry[]>);

    return tickets.map(ticket => 
      convertTicketRowToTicket(ticket, historyByTicket[ticket.id] || [])
    );
  } catch (error) {
    console.error('Error searching tickets:', error);
    throw error;
  }
};

// Get tickets by status
export const getTicketsByStatus = async (status: TicketStatus | 'all'): Promise<Ticket[]> => {
  try {
    let query = supabase
      .from('tickets')
      .select('*')
      .order('updated_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: tickets, error } = await query;

    if (error) throw error;

    // Get history for all tickets
    const ticketIds = tickets.map(t => t.id);
    const { data: history, error: historyError } = await supabase
      .from('ticket_history')
      .select('*')
      .in('ticket_id', ticketIds)
      .order('timestamp', { ascending: false });

    if (historyError) throw historyError;

    // Group history by ticket_id
    const historyByTicket = history.reduce((acc, entry) => {
      if (!acc[entry.ticket_id]) {
        acc[entry.ticket_id] = [];
      }
      acc[entry.ticket_id].push({
        id: entry.id,
        timestamp: entry.timestamp,
        action: entry.action,
        description: entry.description,
        status: entry.status || undefined
      });
      return acc;
    }, {} as Record<string, TicketHistoryEntry[]>);

    return tickets.map(ticket => 
      convertTicketRowToTicket(ticket, historyByTicket[ticket.id] || [])
    );
  } catch (error) {
    console.error('Error fetching tickets by status:', error);
    throw error;
  }
};
