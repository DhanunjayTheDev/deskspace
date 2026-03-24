require("dotenv").config();
const mongoose = require("mongoose");
const Workspace = require("./models/Workspace");
const Admin = require("./models/Admin");
const Testimonial = require("./models/Testimonial");
const Partner = require("./models/Partner");
const FAQ = require("./models/FAQ");
const TeamMember = require("./models/TeamMember");
const Award = require("./models/Award");
const connectDB = require("./config/db");

const sampleWorkspaces = [
  {
    title: "Skyline Hub – Premium Coworking",
    address: "4th Floor, Skyline Towers",
    city: "Hyderabad",
    area: "Gachibowli",
    floor: "4th",
    squareFeet: 5000,
    seats: 80,
    pricePerSeat: 7500,
    type: ["Private Office", "Dedicated Desks"],
    amenities: ["WiFi", "Cafeteria", "Parking", "Power Backup", "Security", "Printer"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&h=800&fit=crop",
    ],
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "Mindspace Business Lounge",
    address: "2nd Floor, Mindspace IT Park",
    city: "Hyderabad",
    area: "Madhapur",
    floor: "2nd",
    squareFeet: 3500,
    seats: 50,
    pricePerSeat: 8500,
    type: ["Dedicated Desks", "Meeting Rooms"],
    amenities: ["WiFi", "Cafeteria", "Parking", "Power Backup", "Monitor"],
    images: [
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=800&fit=crop",
    ],
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "LaunchPad – Startup Office",
    address: "1st Floor, IIIT Campus Road",
    city: "Hyderabad",
    area: "Kondapur",
    floor: "1st",
    squareFeet: 2000,
    seats: 30,
    pricePerSeat: 5500,
    type: ["Dedicated Desks", "Virtual Office"],
    amenities: ["WiFi", "Power Backup", "Security"],
    images: [
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&h=800&fit=crop",
    ],
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "The Hive – Co-Work Studio",
    address: "3rd Floor, Boulevard Plaza",
    city: "Hyderabad",
    area: "Jubilee Hills",
    floor: "3rd",
    squareFeet: 4000,
    seats: 60,
    pricePerSeat: 9000,
    type: ["Meeting Rooms", "Training Room"],
    amenities: ["WiFi", "Cafeteria", "Parking", "Power Backup", "Security", "Monitor", "Printer"],
    images: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&h=800&fit=crop",
    ],
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "CubeWork – Budget Workspace",
    address: "Ground Floor, NH Tech Park",
    city: "Hyderabad",
    area: "Kukatpally",
    floor: "Ground",
    squareFeet: 1500,
    seats: 20,
    pricePerSeat: 4000,
    type: ["Dedicated Desks"],
    amenities: ["WiFi", "Power Backup"],
    images: [
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&h=800&fit=crop",
    ],
    isAvailable: true,
    isFeatured: false,
  },
  {
    title: "Nexus Square – Enterprise Office",
    address: "8th Floor, Nexus Tower",
    city: "Hyderabad",
    area: "HITEC City",
    floor: "8th",
    squareFeet: 8000,
    seats: 120,
    pricePerSeat: 10000,
    type: ["Private Office", "Meeting Rooms", "Training Room"],
    amenities: ["WiFi", "Cafeteria", "Parking", "Power Backup", "Security", "Monitor", "Printer"],
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=800&fit=crop",
    ],
    isAvailable: true,
    isFeatured: true,
  },
];

const sampleTestimonials = [
  {
    name: "Vikram Sharma",
    role: "Founder",
    company: "TechStart India",
    quote: "DeskSpace made finding the right workspace effortless. From inquiry to booking within 24 hours!",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 5,
    isActive: true,
    order: 1,
  },
  {
    name: "Priya Kapoor",
    role: "Marketing Lead",
    company: "Digital Innovations",
    quote: "Great variety of spaces and excellent customer support. Would definitely recommend!",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    rating: 5,
    isActive: true,
    order: 2,
  },
  {
    name: "Rajesh Patel",
    role: "CEO",
    company: "Cloud Solutions Ltd",
    quote: "Professional spaces with all modern amenities. Perfect for hosting client meetings.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    rating: 4,
    isActive: true,
    order: 3,
  },
];

const samplePartners = [
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    website: "https://www.microsoft.com",
    isActive: true,
    order: 1,
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    website: "https://www.google.com",
    isActive: true,
    order: 2,
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website: "https://www.amazon.com",
    isActive: true,
    order: 3,
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    website: "https://www.ibm.com",
    isActive: true,
    order: 4,
  },
];

const sampleFAQs = [
  {
    question: "How can I book a workspace on DeskSpace?",
    answer: "Browse workspaces, filter by location & type, select your preferred space, and submit an inquiry. Our team will connect you with the workspace owner within 24 hours.",
    isActive: true,
    order: 1,
  },
  {
    question: "What are the payment options?",
    answer: "We accept multiple payment methods including credit cards, debit cards, bank transfers, and digital wallets. Payment terms can be negotiated directly with workspace owners.",
    isActive: true,
    order: 2,
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, cancellation policies vary by workspace owner. Most workspaces offer flexible cancellation within 7-14 days. Check the specific terms before booking.",
    isActive: true,
    order: 3,
  },
  {
    question: "Do all workspaces include internet?",
    answer: "Most featured workspaces include high-speed WiFi. You can filter workspaces by amenities to find exactly what you need.",
    isActive: true,
    order: 4,
  },
  {
    question: "Is there a long-term discount?",
    answer: "Many workspace owners offer discounts for monthly or quarterly bookings. Contact the workspace directly to negotiate bulk rates.",
    isActive: true,
    order: 5,
  },
];

const sampleTeamMembers = [
  {
    name: "Arjun Verma",
    role: "CEO & Co-Founder",
    bio: "Visionary entrepreneur with 15+ years in workplace solutions. Built DeskSpace to revolutionize workspace booking.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    isActive: true,
    order: 1,
  },
  {
    name: "Neha Singh",
    role: "COO & Co-Founder",
    bio: "Operations expert ensuring seamless experience. 12+ years managing enterprise platforms.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    isActive: true,
    order: 2,
  },
  {
    name: "Amit Kumar",
    role: "Head of Product",
    bio: "User-centric product strategist. Passionate about building tools that solve real problems.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    isActive: true,
    order: 3,
  },
  {
    name: "Ananya Desai",
    role: "Lead Designer",
    bio: "Creative design lead crafting intuitive user experiences. Award-winning UI/UX designer.",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    isActive: true,
    order: 4,
  },
];

const sampleAwards = [
  {
    title: "Best Workspace Booking Platform",
    year: "2024",
    description: "Recognized as the most user-friendly workspace booking solution in India.",
    image: "https://images.unsplash.com/photo-1553531088-189a28e88f30?w=200&h=200&fit=crop",
    isActive: true,
    order: 1,
  },
  {
    title: "Tech Innovation Award",
    year: "2024",
    description: "Awarded for innovative use of technology in solving workspace management challenges.",
    image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b3?w=200&h=200&fit=crop",
    isActive: true,
    order: 2,
  },
  {
    title: "Best Startup of the Year",
    year: "2023",
    description: "Recognized by TechIndia Foundation for exceptional growth and impact.",
    image: "https://images.unsplash.com/photo-1506762046566-a7c31dd5ee14?w=200&h=200&fit=crop",
    isActive: true,
    order: 3,
  },
];

async function seed() {
  await connectDB();

  // Clear all collections
  await Workspace.deleteMany({});
  await Testimonial.deleteMany({});
  await Partner.deleteMany({});
  await FAQ.deleteMany({});
  await TeamMember.deleteMany({});
  await Award.deleteMany({});
  await Admin.deleteMany({});

  // Seed workspaces
  const workspaces = await Workspace.insertMany(sampleWorkspaces);
  console.log(`✓ Seeded ${workspaces.length} workspaces`);

  // Seed testimonials
  const testimonials = await Testimonial.insertMany(sampleTestimonials);
  console.log(`✓ Seeded ${testimonials.length} testimonials`);

  // Seed partners
  const partners = await Partner.insertMany(samplePartners);
  console.log(`✓ Seeded ${partners.length} partners`);

  // Seed FAQs
  const faqs = await FAQ.insertMany(sampleFAQs);
  console.log(`✓ Seeded ${faqs.length} FAQs`);

  // Seed team members
  const teamMembers = await TeamMember.insertMany(sampleTeamMembers);
  console.log(`✓ Seeded ${teamMembers.length} team members`);

  // Seed awards
  const awards = await Award.insertMany(sampleAwards);
  console.log(`✓ Seeded ${awards.length} awards`);

  // Create default admin
  await Admin.create({ email: "admin@deskspace.in", password: "admin123" });
  console.log("✓ Default admin created: admin@deskspace.in / admin123");

  console.log("\n✅ Database seeding completed successfully!");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
