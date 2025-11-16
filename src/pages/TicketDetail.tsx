import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, User, Package, Wrench, MessageSquare, CheckCircle2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Ticket, TicketStatus, TicketHistoryEntry } from "@/types/ticket";
import { getTicketById, updateTicket } from "@/services/ticketService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { printTicket } from "@/utils/printTicket";
import { printLabel } from "@/utils/printLabel";

export default function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [updateNote, setUpdateNote] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus>("open");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  const loadTicket = async () => {
    if (!ticketId) return;
    
    try {
      setLoading(true);
      const ticketData = await getTicketById(ticketId);
      if (ticketData) {
        setTicket(ticketData);
        setNewStatus(ticketData.status);
      }
    } catch (error) {
      console.error('Error loading ticket:', error);
      toast({
        title: "Error",
        description: "Failed to load ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    if (!ticket || (!updateNote.trim() && newStatus === ticket.status)) {
      toast({
        title: "No Changes",
        description: "Please add a note or change the status to update the ticket.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);

    try {
      // Update ticket using Supabase service
      const updatedTicket = await updateTicket(ticket.id, {
        status: newStatus !== ticket.status ? newStatus : undefined,
        note: updateNote.trim() || undefined
      });

      setTicket(updatedTicket);
      setUpdateNote("");
      
      toast({
        title: "Ticket Updated",
        description: "The ticket has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Ticket...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the ticket details.</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Ticket Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested ticket could not be found.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-1">
              <h1 className="text-2xl font-bold text-foreground">
                Ticket #{ticket.id.slice(-6).toUpperCase()}
              </h1>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="text-muted-foreground">
              Created {format(new Date(ticket.createdAt), "PPp")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => printTicket(ticket)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Ticket
            </Button>
            <Button 
              onClick={() => printLabel(ticket)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Label
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{ticket.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{ticket.contactNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{ticket.productCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{ticket.productModel}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Serial Number</p>
                  <Badge variant="outline" className="mt-1">{ticket.serialNumber}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Problem Description */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Problem Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{ticket.problem}</p>
              </CardContent>
            </Card>

            {/* Update Ticket */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Update Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as TicketStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Note</label>
                  <Textarea
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    placeholder="Add a note about this update..."
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleUpdateTicket}
                  disabled={isUpdating}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-200"
                >
                  {isUpdating ? "Updating..." : "Update Ticket"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - History */}
          <div className="space-y-6">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Ticket History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticket.history
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((entry) => (
                      <div key={entry.id} className="border-l-2 border-primary/20 pl-4 pb-4 last:pb-0">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{entry.action}</p>
                            <p className="text-muted-foreground text-xs mt-1">
                              {format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                            {entry.description && entry.description !== entry.action && (
                              <p className="text-sm mt-2 text-foreground">{entry.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}