-- Create custom types
CREATE TYPE ticket_status AS ENUM ('open', 'in-progress', 'closed');

-- Create tickets table
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Customer Information
  customer_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  
  -- Product Information
  product_category TEXT NOT NULL,
  product_model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  
  -- Issue Information
  problem TEXT NOT NULL,
  status ticket_status DEFAULT 'open' NOT NULL
);

-- Create ticket_history table
CREATE TABLE ticket_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  status ticket_status
);

-- Create indexes for better performance
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_customer_name ON tickets(customer_name);
CREATE INDEX idx_tickets_serial_number ON tickets(serial_number);
CREATE INDEX idx_ticket_history_ticket_id ON ticket_history(ticket_id);
CREATE INDEX idx_ticket_history_timestamp ON ticket_history(timestamp);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tickets_updated_at 
    BEFORE UPDATE ON tickets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can modify these based on your auth requirements)
CREATE POLICY "Allow all operations on tickets" ON tickets
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on ticket_history" ON ticket_history
    FOR ALL USING (true) WITH CHECK (true);
