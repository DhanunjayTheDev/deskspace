import type { Workspace } from "../types/workspace";
import { workspaces } from "../data/workspaces";

export interface WorkspaceFilters {
  /** Free text, matched against name, locality, address and city. */
  q?: string;
  area?: string;
  city?: string;
  type?: string;
  minSeats?: number;
  maxBudget?: number;
  featured?: boolean;
}

function matchesFilters(workspace: Workspace, filters: WorkspaceFilters): boolean {
  if (filters.q) {
    const needle = filters.q.trim().toLowerCase();
    const haystack = [
      workspace.title,
      workspace.area,
      workspace.address,
      workspace.city,
      ...workspace.type,
    ]
      .join(" ")
      .toLowerCase();
    if (needle && !haystack.includes(needle)) return false;
  }
  if (filters.area && !workspace.area.toLowerCase().includes(filters.area.toLowerCase())) {
    return false;
  }
  if (filters.city && workspace.city !== filters.city) {
    return false;
  }
  if (filters.type && workspace.type && !workspace.type.includes(filters.type)) {
    return false;
  }
  if (filters.minSeats && workspace.seats < filters.minSeats) {
    return false;
  }
  if (filters.maxBudget && workspace.pricePerSeat > filters.maxBudget) {
    return false;
  }
  if (filters.featured && !workspace.isFeatured) {
    return false;
  }
  return true;
}

// Everything here is bundled JSON — there is no network. These used to resolve
// behind a 100ms setTimeout, which meant every page showed skeletons and ran an
// extra render pass for a lookup that costs microseconds. Resolving immediately
// removes that artificial stall.
export const workspaceApi = {
  getAll: (filters?: WorkspaceFilters): Promise<Workspace[]> =>
    Promise.resolve(workspaces.filter((w) => matchesFilters(w, filters || {}))),

  getById: (id: string): Promise<Workspace | null> =>
    Promise.resolve(workspaces.find((w) => w._id === id) || null),

  getFeatured: (): Promise<Workspace[]> =>
    Promise.resolve(workspaces.filter((w) => w.isFeatured)),
};

export interface Partner { _id: string; name: string; logo: string; website: string; }
export interface Testimonial { _id: string; name: string; role: string; company: string; photo: string; quote: string; rating: number; }
export interface FAQ { _id: string; question: string; answer: string; }
export interface TeamMember { _id: string; name: string; role: string; photo: string; bio: string; }
export interface Award { _id: string; title: string; year: string; description: string; image?: string; icon?: string; }

const staticPartners: Partner[] = [
  { _id: "p1", name: "WeWork", logo: "https://images.unsplash.com/photo-1560179707-f00d4ca29e4a?w=200&h=100&fit=crop", website: "https://wework.com" },
  { _id: "p2", name: "Awfis", logo: "https://images.unsplash.com/photo-1560179707-f00d4ca29e4a?w=200&h=100&fit=crop", website: "https://awfis.com" },
  { _id: "p3", name: "91springboard", logo: "https://images.unsplash.com/photo-1560179707-f00d4ca29e4a?w=200&h=100&fit=crop", website: "https://91springboard.com" },
  { _id: "p4", name: "Innov8", logo: "https://images.unsplash.com/photo-1560179707-f00d4ca29e4a?w=200&h=100&fit=crop", website: "https://innov8.com" },
  { _id: "p5", name: "CoWrks", logo: "https://images.unsplash.com/photo-1560179707-f00d4ca29e4a?w=200&h=100&fit=crop", website: "https://cowrks.com" },
  { _id: "p6", name: "BHIVE", logo: "https://images.unsplash.com/photo-1560179707-f00d4ca29e4a?w=200&h=100&fit=crop", website: "https://bhiveworkspace.com" },
];

export const staticTestimonials: Testimonial[] = [
  { _id: "t1", name: "Rahul Sharma", role: "Founder", company: "TechStart Labs", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face", quote: "DeskPlace found us a 40-seat office in HITEC City within four days. The team actually understood what a growing engineering team needs.", rating: 5 },
  { _id: "t2", name: "Priya Patel", role: "CEO", company: "GrowthLabs", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face", quote: "Best way to hunt workspace in Hyderabad. Verified listings saved us weeks of site visits, and the pricing was transparent from day one.", rating: 5 },
  { _id: "t3", name: "Amit Kumar", role: "Operations Head", company: "ScaleUp", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face", quote: "We moved into Gachibowli through DeskPlace. Smooth process, and support walked us through every step of the shift.", rating: 5 },
  { _id: "t4", name: "Sneha Reddy", role: "Co-founder", company: "Kraft Studio", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face", quote: "Started with four hot desks in Kondapur and scaled to a private cabin without changing buildings. That flexibility is the whole point.", rating: 5 },
  { _id: "t5", name: "Vikas Rao", role: "Director", company: "Northline Consulting", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=face", quote: "Power backup and the meeting rooms in Banjara Hills sold it for us. Six months in, not a single day of downtime.", rating: 5 },
];

const staticFAQs: FAQ[] = [
  { _id: "f1", question: "How does DeskPlace work?", answer: "DeskPlace is a platform that connects you with verified workspace providers. Browse listings, compare options, and connect directly with owners to book your space." },
  { _id: "f2", question: "Are all listings verified?", answer: "Yes, every workspace on DeskPlace is personally verified for quality, amenities, and authenticity before being listed." },
  { _id: "f3", question: "Can I book a meeting room for a few hours?", answer: "Absolutely! Many of our spaces offer hourly meeting room bookings with instant confirmation." },
  { _id: "f4", question: "What's included in the price?", answer: "Prices typically include high-speed WiFi, meeting room access, 24/7 entry, reception, and utilities. Check individual listings for exact inclusions." },
  { _id: "f5", question: "Is there a minimum commitment?", answer: "We offer flexible terms from hourly bookings to monthly contracts. No long-term commitments required for most spaces." },
];

export const staticTeam: TeamMember[] = [
  { _id: "tm1", name: "Arjun Mehta", role: "Founder & CEO", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", bio: "Serial entrepreneur with 15+ years in commercial real estate and proptech." },
  { _id: "tm2", name: "Neha Singh", role: "COO", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face", bio: "Operations leader with expertise in scaling marketplace platforms across India." },
  { _id: "tm3", name: "Vikram Patel", role: "CTO", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", bio: "Tech visionary building scalable solutions for the future of work." },
];

export const staticAwards: Award[] = [
  { _id: "a1", title: "Best PropTech Startup", year: "2024", description: "Awarded by NASSCOM for innovation in workspace technology", icon: "🏆" },
  { _id: "a2", title: "Top 10 Workspace Platforms", year: "2024", description: "Recognized by Economic Times for market leadership", icon: "🥇" },
  { _id: "a3", title: "Customer Choice Award", year: "2023", description: "Voted #1 by workspace seekers across India", icon: "⭐" },
];

export const siteApi = {
  getPartners: (): Promise<Partner[]> => Promise.resolve(staticPartners),
  getTestimonials: (): Promise<Testimonial[]> => Promise.resolve(staticTestimonials),
  getFAQs: (): Promise<FAQ[]> => Promise.resolve(staticFAQs),
  getTeam: (): Promise<TeamMember[]> => Promise.resolve(staticTeam),
  getAwards: (): Promise<Award[]> => Promise.resolve(staticAwards),
};

export interface LeadPayload {
  name: string;
  email?: string;
  phone: string;
  workspaceId?: string;
  workspaceName?: string;
  workspaceType?: string;
  seatsRequired?: number;
  message?: string;
}

export const leadApi = {
  create: (data: LeadPayload): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Lead created:", data);
        resolve({ success: true, message: "Lead submitted successfully" });
      }, 500);
    });
  },
};