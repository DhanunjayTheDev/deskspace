export interface Workspace {
  _id: string;
  title: string;
  address: string;
  city: string;
  area: string;
  floor: string;
  squareFeet: number;
  seats: number;
  pricePerSeat: number;
  amenities: string[];
  images: string[];
  type: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  workspaceId: {
    _id: string;
    title: string;
    area: string;
    city: string;
  } | null;
  workspaceName: string;
  workspaceType: string;
  seatsRequired: number;
  status: "new" | "contacted" | "converted";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalLeads: number;
  newLeadsToday: number;
  conversionRate: number;
  statusCounts: { new: number; contacted: number; converted: number };
  leadsByDay: { date: string; day: string; count: number }[];
  typeDistribution: { name: string; value: number }[];
  topWorkspaces: { name: string; leads: number }[];
}
