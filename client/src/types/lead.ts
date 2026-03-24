export interface Lead {
  _id: string;
  name: string;
  phone: string;
  workspaceId: string;
  workspaceName: string;
  workspaceType: string;
  seatsRequired: number;
  status: "new" | "contacted" | "converted";
  createdAt: string;
  updatedAt: string;
}

export interface LeadPayload {
  name: string;
  phone: string;
  workspaceId: string;
  workspaceName: string;
  workspaceType: string;
  seatsRequired: number;
}
