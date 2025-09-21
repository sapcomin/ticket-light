import { Ticket } from '@/types/ticket';
import { format } from 'date-fns';

export const printTicket = (ticket: Ticket) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    console.error('Unable to open print window. Please check popup blockers.');
    return;
  }

  // A6 size: 105mm x 148mm (4.13" x 5.83")
  const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Ticket - ${ticket.id.slice(-6).toUpperCase()}</title>
        <style>
            @page {
                size: A6;
                margin: 8mm;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                font-size: 10px;
                line-height: 1.3;
                color: #000;
                background: white;
                width: 105mm;
                height: 148mm;
                padding: 5mm;
            }
            
            .ticket-header {
                text-align: center;
                border-bottom: 2px solid #000;
                padding-bottom: 3mm;
                margin-bottom: 4mm;
            }
            
            .ticket-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 2mm;
            }
            
            .ticket-id {
                font-size: 12px;
                font-weight: bold;
                color: #333;
            }
            
            .ticket-date {
                font-size: 9px;
                color: #666;
                margin-top: 1mm;
            }
            
            .section {
                margin-bottom: 3mm;
            }
            
            .section-title {
                font-size: 9px;
                font-weight: bold;
                text-transform: uppercase;
                border-bottom: 1px solid #ccc;
                padding-bottom: 1mm;
                margin-bottom: 2mm;
            }
            
            .field {
                display: flex;
                margin-bottom: 1mm;
            }
            
            .field-label {
                font-weight: bold;
                min-width: 25mm;
                font-size: 8px;
            }
            
            .field-value {
                flex: 1;
                font-size: 8px;
                word-break: break-word;
            }
            
            .status-badge {
                display: inline-block;
                padding: 1mm 2mm;
                border-radius: 2mm;
                font-size: 7px;
                font-weight: bold;
                text-transform: uppercase;
                margin-left: 2mm;
            }
            
            .status-open {
                background-color: #fef3c7;
                color: #92400e;
                border: 1px solid #f59e0b;
            }
            
            .status-in-progress {
                background-color: #dbeafe;
                color: #1e40af;
                border: 1px solid #3b82f6;
            }
            
            .status-closed {
                background-color: #d1fae5;
                color: #065f46;
                border: 1px solid #10b981;
            }
            
            .problem-description {
                background-color: #f9fafb;
                border: 1px solid #e5e7eb;
                padding: 2mm;
                border-radius: 1mm;
                font-size: 8px;
                line-height: 1.4;
                margin-top: 1mm;
            }
            
            .footer {
                position: absolute;
                bottom: 5mm;
                left: 5mm;
                right: 5mm;
                text-align: center;
                font-size: 7px;
                color: #666;
                border-top: 1px solid #ccc;
                padding-top: 2mm;
            }
            
            .qr-placeholder {
                width: 15mm;
                height: 15mm;
                border: 1px dashed #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 6px;
                color: #999;
                margin-left: auto;
            }
            
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        </style>
    </head>
    <body>
        <div class="ticket-header">
            <div class="ticket-title">SERVICE TICKET</div>
            <div class="ticket-id">#${ticket.id.slice(-6).toUpperCase()}</div>
            <div class="ticket-date">Created: ${format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm')}</div>
        </div>
        
        <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">${ticket.customerName}</div>
            </div>
            <div class="field">
                <div class="field-label">Contact:</div>
                <div class="field-value">${ticket.contactNumber}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Product Information</div>
            <div class="field">
                <div class="field-label">Category:</div>
                <div class="field-value">${ticket.productCategory}</div>
            </div>
            <div class="field">
                <div class="field-label">Model:</div>
                <div class="field-value">${ticket.productModel}</div>
            </div>
            <div class="field">
                <div class="field-label">Serial:</div>
                <div class="field-value">${ticket.serialNumber}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Issue Details</div>
            <div class="field">
                <div class="field-label">Status:</div>
                <div class="field-value">
                    ${ticket.status.replace('-', ' ').toUpperCase()}
                    <span class="status-badge status-${ticket.status}">${ticket.status}</span>
                </div>
            </div>
            <div class="field">
                <div class="field-label">Problem:</div>
                <div class="field-value">
                    <div class="problem-description">${ticket.problem}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Reference Information</div>
            <div class="field">
                <div class="field-label">Ticket ID:</div>
                <div class="field-value">${ticket.id}</div>
            </div>
            <div class="field">
                <div class="field-label">Last Updated:</div>
                <div class="field-value">${format(new Date(ticket.updatedAt), 'MMM dd, yyyy HH:mm')}</div>
            </div>
        </div>
        
        <div class="footer">
            <div>Keep this ticket for your records</div>
            <div>For support, contact us with ticket #${ticket.id.slice(-6).toUpperCase()}</div>
        </div>
    </body>
    </html>
  `;

  // Write content to the new window
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
};

// Alternative function for generating a PDF-friendly version
export const generateTicketPDF = (ticket: Ticket): string => {
  return `
    <div style="width: 105mm; height: 148mm; padding: 5mm; font-family: Arial, sans-serif; font-size: 10px; background: white;">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 3mm; margin-bottom: 4mm;">
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 2mm;">SERVICE TICKET</div>
        <div style="font-size: 12px; font-weight: bold; color: #333;">#${ticket.id.slice(-6).toUpperCase()}</div>
        <div style="font-size: 9px; color: #666; margin-top: 1mm;">Created: ${format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm')}</div>
      </div>
      
      <div style="margin-bottom: 3mm;">
        <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 1mm; margin-bottom: 2mm;">Customer Information</div>
        <div style="display: flex; margin-bottom: 1mm;">
          <div style="font-weight: bold; min-width: 25mm; font-size: 8px;">Name:</div>
          <div style="flex: 1; font-size: 8px;">${ticket.customerName}</div>
        </div>
        <div style="display: flex; margin-bottom: 1mm;">
          <div style="font-weight: bold; min-width: 25mm; font-size: 8px;">Contact:</div>
          <div style="flex: 1; font-size: 8px;">${ticket.contactNumber}</div>
        </div>
      </div>
      
      <div style="margin-bottom: 3mm;">
        <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 1mm; margin-bottom: 2mm;">Product Information</div>
        <div style="display: flex; margin-bottom: 1mm;">
          <div style="font-weight: bold; min-width: 25mm; font-size: 8px;">Category:</div>
          <div style="flex: 1; font-size: 8px;">${ticket.productCategory}</div>
        </div>
        <div style="display: flex; margin-bottom: 1mm;">
          <div style="font-weight: bold; min-width: 25mm; font-size: 8px;">Model:</div>
          <div style="flex: 1; font-size: 8px;">${ticket.productModel}</div>
        </div>
        <div style="display: flex; margin-bottom: 1mm;">
          <div style="font-weight: bold; min-width: 25mm; font-size: 8px;">Serial:</div>
          <div style="flex: 1; font-size: 8px;">${ticket.serialNumber}</div>
        </div>
      </div>
      
      <div style="margin-bottom: 3mm;">
        <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 1mm; margin-bottom: 2mm;">Issue Details</div>
        <div style="display: flex; margin-bottom: 1mm;">
          <div style="font-weight: bold; min-width: 25mm; font-size: 8px;">Status:</div>
          <div style="flex: 1; font-size: 8px;">${ticket.status.replace('-', ' ').toUpperCase()}</div>
        </div>
        <div style="margin-bottom: 1mm;">
          <div style="font-weight: bold; font-size: 8px; margin-bottom: 1mm;">Problem:</div>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 2mm; border-radius: 1mm; font-size: 8px; line-height: 1.4;">${ticket.problem}</div>
        </div>
      </div>
      
      <div style="position: absolute; bottom: 5mm; left: 5mm; right: 5mm; text-align: center; font-size: 7px; color: #666; border-top: 1px solid #ccc; padding-top: 2mm;">
        <div>Keep this ticket for your records</div>
        <div>For support, contact us with ticket #${ticket.id.slice(-6).toUpperCase()}</div>
      </div>
    </div>
  `;
};
