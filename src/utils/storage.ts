import { Ticket } from "@/types/ticket";

const STORAGE_KEY = "serviceTickets";
const BACKUP_KEY = "serviceTickets_backup";

export const saveTickets = (tickets: Ticket[]) => {
  try {
    const data = JSON.stringify(tickets);
    localStorage.setItem(STORAGE_KEY, data);
    // Create a backup
    localStorage.setItem(BACKUP_KEY, data);
    // Also save to sessionStorage as additional backup
    sessionStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error("Failed to save tickets:", error);
  }
};

export const loadTickets = (): Ticket[] => {
  try {
    // Try localStorage first
    let data = localStorage.getItem(STORAGE_KEY);
    
    // If not found, try backup
    if (!data) {
      data = localStorage.getItem(BACKUP_KEY);
    }
    
    // If still not found, try sessionStorage
    if (!data) {
      data = sessionStorage.getItem(STORAGE_KEY);
    }
    
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load tickets:", error);
    return [];
  }
};

export const exportData = () => {
  const tickets = loadTickets();
  const dataStr = JSON.stringify(tickets, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `service-tickets-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<Ticket[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const tickets = JSON.parse(e.target?.result as string);
        saveTickets(tickets);
        resolve(tickets);
      } catch (error) {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};