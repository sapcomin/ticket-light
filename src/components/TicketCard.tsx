import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Ticket } from "@/types/ticket";
import { Clock, User, Wrench, Phone, Printer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { printTicket } from "@/utils/printTicket";

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-elevated transition-all duration-200 bg-gradient-card border-border/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">#{ticket.id.slice(-6).toUpperCase()}</h3>
            <p className="text-sm text-muted-foreground">{ticket.productCategory} - {ticket.productModel}</p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{ticket.customerName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{ticket.contactNumber}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground line-clamp-1">{ticket.problem}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              SN: {ticket.serialNumber}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                printTicket(ticket);
              }}
              className="h-6 w-6 p-0"
              title="Print ticket"
            >
              <Printer className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}