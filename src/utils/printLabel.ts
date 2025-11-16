import { Ticket } from '@/types/ticket';
import { format } from 'date-fns';

export const printLabel = (ticket: Ticket) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=400,height=300');
  
  if (!printWindow) {
    console.error('Unable to open print window. Please check popup blockers.');
    return;
  }

  // Label size: 100mm x 50mm (3.94" x 1.97")
  const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Label - ${ticket.id.slice(-6).toUpperCase()}</title>
        <style>
            @page {
                size: 100mm 50mm;
                margin: 2mm;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                font-size: 8px;
                line-height: 1.2;
                color: #000;
                background: white;
                width: 100mm;
                height: 50mm;
                padding: 3mm;
                display: flex;
                flex-direction: column;
            }
            
            .label-header {
                text-align: center;
                border-bottom: 1px solid #000;
                padding-bottom: 2mm;
                margin-bottom: 2mm;
            }
            
            .label-title {
                font-size: 10px;
                font-weight: bold;
            }
            
            .ticket-id {
                font-size: 14px;
                font-weight: bold;
                margin: 1mm 0;
            }
            
            .label-body {
                display: flex;
                flex-direction: column;
                gap: 1mm;
                flex: 1;
            }
            
            .info-row {
                display: flex;
                align-items: flex-start;
            }
            
            .info-label {
                font-weight: bold;
                min-width: 18mm;
                font-size: 7px;
            }
            
            .info-value {
                flex: 1;
                font-size: 7px;
                word-break: break-word;
            }
            
            .status-badge {
                display: inline-block;
                padding: 0.5mm 1.5mm;
                border-radius: 1mm;
                font-size: 6px;
                font-weight: bold;
                text-transform: uppercase;
                margin-left: 1mm;
            }
            
            .status-open {
                background-color: #fef3c7;
                color: #92400e;
                border: 0.5px solid #f59e0b;
            }
            
            .status-in-progress {
                background-color: #dbeafe;
                color: #1e40af;
                border: 0.5px solid #3b82f6;
            }
            
            .status-closed {
                background-color: #d1fae5;
                color: #065f46;
                border: 0.5px solid #10b981;
            }
            
            .label-footer {
                border-top: 1px solid #ccc;
                padding-top: 1mm;
                text-align: center;
                font-size: 6px;
                color: #666;
                margin-top: auto;
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
        <div class="label-header">
            <div class="label-title">SERVICE LABEL</div>
            <div class="ticket-id">#${ticket.id.slice(-6).toUpperCase()}</div>
        </div>
        
        <div class="label-body">
            <div class="info-row">
                <div class="info-label">Customer:</div>
                <div class="info-value">${ticket.customerName}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Contact:</div>
                <div class="info-value">${ticket.contactNumber}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Category:</div>
                <div class="info-value">${ticket.productCategory}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Model:</div>
                <div class="info-value">${ticket.productModel}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Serial:</div>
                <div class="info-value">${ticket.serialNumber}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Status:</div>
                <div class="info-value">
                    <span class="status-badge status-${ticket.status}">${ticket.status.toUpperCase()}</span>
                </div>
            </div>
        </div>
        
        <div class="label-footer">
            <div>Date: ${format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</div>
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
