
import { Customer } from "@/types/customer";

export const sampleCustomers: Customer[] = [
  {
    id: 1,
    userId: "14545807",
    efin: "123456",
    company: "Azteca Tax Systems",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    businessPhone: "(555) 123-4567",
    cellPhone: "(555) 987-6543",
    portalReady: true,
    bankAppSubmitted: true,
    softwarePaid: true,
  },
  {
    id: 2,
    userId: "14545808",
    efin: "234567",
    company: "Global Tax Solutions",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    businessPhone: "(555) 222-3333",
    cellPhone: "(555) 444-5555",
    portalReady: false,
    bankAppSubmitted: true,
    softwarePaid: true,
  },
  {
    id: 3,
    userId: "14545809",
    efin: "345678",
    company: "Premier Tax Services",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.j@example.com",
    businessPhone: "(555) 666-7777",
    cellPhone: "(555) 888-9999",
    portalReady: true,
    bankAppSubmitted: false,
    softwarePaid: false,
  },
  {
    id: 4,
    userId: "14545810",
    efin: "456789",
    company: "Advanced Tax Pros",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.g@example.com",
    businessPhone: "(555) 111-2222",
    cellPhone: "(555) 333-4444",
    portalReady: false,
    bankAppSubmitted: false,
    softwarePaid: true,
  },
];
