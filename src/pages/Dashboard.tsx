import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketCard } from "@/components/TicketCard";
import { Ticket, TicketStatus } from "@/types/ticket";
import { getAllTickets, searchAndFilterTickets } from "@/services/ticketService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]); // For stats calculation
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadTicketsData();
  }, []);

  const loadTicketsData = async () => {
    try {
      setLoading(true);
      const data = await getAllTickets();
      setAllTickets(data); // Keep all tickets for stats
      setTickets(data); // Initial display
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load tickets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // For now, we'll skip import functionality as it would require
        // implementing bulk insert in Supabase
        toast({
          title: "Import Not Available",
          description: "Import functionality will be available in a future update.",
          variant: "destructive"
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import data. Please check the file format.",
          variant: "destructive"
        });
      }
    }
  };

  // Handle search and filter
  useEffect(() => {
    const filterTickets = async () => {
      try {
        setLoading(true);
        // Use combined search and filter function
        const filteredData = await searchAndFilterTickets(searchQuery, statusFilter);
        setTickets(filteredData);
      } catch (error) {
        console.error('Error filtering tickets:', error);
        toast({
          title: "Error",
          description: "Failed to filter tickets. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      filterTickets();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, toast]);

  const filteredTickets = tickets;

  const getStatusCounts = () => {
    // Use allTickets for stats, not filtered tickets
    return {
      total: allTickets.length,
      open: allTickets.filter(t => t.status === 'open').length,
      inProgress: allTickets.filter(t => t.status === 'in-progress').length,
      closed: allTickets.filter(t => t.status === 'closed').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Service Tickets
            </h1>
            <p className="text-muted-foreground mt-1">Manage and track service requests</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                // Export functionality can be implemented later
                toast({
                  title: "Export Not Available",
                  description: "Export functionality will be available in a future update.",
                  variant: "destructive"
                });
              }}
              variant="outline"
              size="sm"
              title="Export all tickets"
            >
              <Download className="h-4 w-4" />
            </Button>
            <label className="cursor-pointer">
              <Button 
                variant="outline"
                size="sm"
                asChild
                title="Import tickets"
              >
                <span>
                  <Upload className="h-4 w-4" />
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <Button 
              onClick={() => navigate('/create-ticket')}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-card p-4 rounded-lg border shadow-card">
            <div className="text-2xl font-bold text-foreground">{statusCounts.total}</div>
            <div className="text-sm text-muted-foreground">Total Tickets</div>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border shadow-card">
            <div className="text-2xl font-bold text-muted-foreground">{statusCounts.open}</div>
            <div className="text-sm text-muted-foreground">Open</div>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border shadow-card">
            <div className="text-2xl font-bold text-primary">{statusCounts.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border shadow-card">
            <div className="text-2xl font-bold text-success">{statusCounts.closed}</div>
            <div className="text-sm text-muted-foreground">Closed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets by customer, model, or serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground mb-4">Loading tickets...</div>
            </div>
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground mb-4">
                {allTickets.length === 0 ? "No tickets created yet" : "No tickets match your filters"}
              </div>
              {allTickets.length === 0 && (
                <Button 
                  onClick={() => navigate('/create-ticket')}
                  variant="outline"
                >
                  Create Your First Ticket
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}