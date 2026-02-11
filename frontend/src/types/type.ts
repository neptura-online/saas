export type Lead = {
  _id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: number;
  utm_source: string;
  leadType: string;
  [key: string]: any;
};

export type LeadDashboardProps = {
  isAdmin: boolean;
  loading: boolean;
  leads: Lead[];
  handleDelete: (id: string) => Promise<void>;
  handleBulkDelete?: (ids: string[]) => void;
};

export type LeadDetailsProps = {
  leads: Lead[];
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone: number;
  role: "admin" | "user" | "owner";
  createdAt?: string;
  roleAssignedBy: string;
};

export type LayoutContextType = {
  users: User[];
  leads: Lead[];
  partialLeads: Lead[];
  loading: boolean;
  handleDelete: (id: string) => void;
  handleBulkDelete: (ids: string[]) => void;
};
