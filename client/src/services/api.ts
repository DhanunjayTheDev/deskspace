import axios from "axios";
import type { Workspace } from "../types/workspace";
import type { LeadPayload } from "../types/lead";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export interface WorkspaceFilters {
  area?: string;
  minSeats?: number;
  maxBudget?: number;
  city?: string;
  featured?: boolean;
  type?: string;
}

export const workspaceApi = {
  getAll: (filters?: WorkspaceFilters) =>
    api.get<Workspace[]>("/workspaces", { params: filters }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Workspace>(`/workspaces/${id}`).then((r) => r.data),

  getFeatured: () =>
    api.get<Workspace[]>("/workspaces", { params: { featured: "true" } }).then((r) => r.data),
};

export const leadApi = {
  create: (data: LeadPayload) =>
    api.post("/leads", data).then((r) => r.data),
};

export const siteApi = {
  getTestimonials: () => api.get("/site/testimonials").then((r) => r.data),
  getPartners: () => api.get("/site/partners").then((r) => r.data),
  getFAQs: () => api.get("/site/faqs").then((r) => r.data),
  getTeam: () => api.get("/site/team").then((r) => r.data),
  getAwards: () => api.get("/site/awards").then((r) => r.data),
};
