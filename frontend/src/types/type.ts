export type FormProps = {
  id: string;
  triggered?: string;
  save?: string;
  isOpen: boolean;
  onClose: () => void;
};

export type Testimonial = {
  text: string;
  imageSrc: string;
  name: string;
  username: string;
};

export type TestimonialCardProps = Testimonial;

export type InfiniteColumnProps = {
  items: Testimonial[];
  duration?: number;
};

export type OpenFormProps = {
  setId: React.Dispatch<React.SetStateAction<string>>;
  setSave?: React.Dispatch<React.SetStateAction<string>>;
  settriggerUrl?: React.Dispatch<React.SetStateAction<string>>;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
};

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

export type AdminDashBoardProps = {
  users: User[];
  loading: boolean;
  leads: Lead[];
  partialLeads: Lead[];
};
