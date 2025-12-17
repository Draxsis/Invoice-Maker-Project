export interface LineItem {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type ColorTheme = 'slate' | 'blue' | 'indigo' | 'violet' | 'emerald' | 'rose' | 'amber' | 'cyan';
export type IconStyle = 'modern' | 'minimal' | 'solid';

export interface InvoiceTheme {
  color: ColorTheme;
  iconStyle: IconStyle;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  sellerName: string;
  sellerTitle: string;
  sellerContact: string;
  customerName: string;
  customerCompany: string;
  customerContact: string;
  items: LineItem[];
  taxRate: number; // Percentage
  note: string;
  theme: InvoiceTheme;
}

export interface GeneratedContent {
  title: string;
  description: string;
}