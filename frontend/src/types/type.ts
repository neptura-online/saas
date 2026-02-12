/* =========================
   LEAD TYPE (Backend Aligned)
========================= */

export type Lead = {
  _id: string;
  createdAt: string;
  updatedAt?: string;

  name: string;
  email?: string;
  phone: string;

  leadType: "MAIN" | "PARTIAL";

  message?: string;

  // Marketing fields (all optional)
  utm_source?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_campaign?: string;
  utm_content?: string;
  adgroupid?: string;
  gclid?: string;
  lpurl?: string;
  formID?: string;

  customFields?: Record<string, any>;

  companyId: string;
};

/* =========================
   USER TYPE
========================= */

export type CurrentUser = {
  id: string;
  name: string;
  role: "SUPER_ADMIN" | "owner" | "admin" | "user";
  companyId?: string;
};

export type Company = {
  _id: string;
  name: string;
  totalLeads: number;
  todayLeads: number;
  usersCount: number;
  status: "active" | "suspended";
};

export type Overview = {
  totalCompanies: number;
  totalUsers: number;
  totalLeads: number;
  todayLeads: number;
  companies: Company[];
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone: number;

  role: "SUPER_ADMIN" | "owner" | "admin" | "user";

  companyId?: string;
  roleAssignedBy: string;

  createdAt?: string;
  updatedAt?: string;
};

export type LayoutContextType = {
  currentUser: CurrentUser | null;
  users: User[];
  leads: Lead[];
  partialLeads: Lead[];
  loading: boolean;
  companies: Company[];
  handleCreateUser: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "admin" | "user";
  }) => Promise<void>;
  handleDeleteUser: (id: string) => Promise<void>;
  handleRoleChange: (id: string, role: "admin" | "user") => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleBulkDelete: (ids: string[]) => Promise<void>;
};

export type LeadDetailsProps = {
  leads: Lead[];
};
