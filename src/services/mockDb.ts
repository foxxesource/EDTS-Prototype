export interface B2BUser {
  email: string;
  companyName: string;
  applicationId: string;
  uatProgress: number[];
  agreementStatus: 'PENDING' | 'APPROVED' | 'AWAITING_SIGNATURE' | 'UPLOADED' | 'NEEDS_REVIEW';
  commercialTerms: {
    rateLimit: string;
    wholesaleMargin: string;
    sla: string;
  };
  agreementDocUrl?: string;
  signedDocUrl?: string;
  agreementVersion: number;
  negotiationHistory: Array<{
    id: number;
    sender: 'Franchisee' | 'Franchisor';
    text: string;
    time: string;
  }>;
}

// Initial mock data to populate the system
const INITIAL_USERS: Record<string, B2BUser> = {
  'user1@company.com': {
    email: 'user1@company.com',
    companyName: 'Acme Corp',
    applicationId: 'IND-12345',
    uatProgress: [1, 2],
    agreementStatus: 'APPROVED',
    commercialTerms: {
      rateLimit: '100 requests/sec',
      wholesaleMargin: '15%',
      sla: '99.9%',
    },
    agreementVersion: 1,
    negotiationHistory: [
      { id: 1, sender: 'Franchisee', text: 'The 50 TPS limit is slightly lower than our current projection for peak hours. Can we increase this to 100 TPS?', time: 'Oct 2, 10:15 AM' },
      { id: 2, sender: 'Franchisor', text: 'We can increase it to 75 TPS for the first 6 months as a trial period. Does that work?', time: 'Oct 2, 02:30 PM' },
      { id: 3, sender: 'Franchisee', text: '75 TPS should be sufficient for our initial launch. We accept this term.', time: 'Oct 3, 09:00 AM' },
    ],
  },
  'user2@company.com': {
    email: 'user2@company.com',
    companyName: 'Global Tech',
    applicationId: 'IND-67890',
    uatProgress: [1],
    agreementStatus: 'APPROVED',
    commercialTerms: {
      rateLimit: '500 requests/sec',
      wholesaleMargin: '10%',
      sla: '99.99%',
    },
    agreementVersion: 1,
    negotiationHistory: [],
  },
  'dummy1@company.com': {
    email: 'dummy1@company.com',
    companyName: 'Pixel Nexus Ltd',
    applicationId: 'IND-PX001',
    uatProgress: [1, 2, 3],
    agreementStatus: 'PENDING',
    commercialTerms: { rateLimit: '50 req/sec', wholesaleMargin: '5%', sla: '99.0%' },
    agreementVersion: 1,
    negotiationHistory: [
      { id: 1, sender: 'Franchisee', text: 'We would like to request a higher wholesale margin for the first year.', time: 'Oct 4, 09:00 AM' },
      { id: 2, sender: 'Franchisor', text: 'What margin are you looking for specifically?', time: 'Oct 4, 11:30 AM' },
      { id: 3, sender: 'Franchisee', text: 'We are aiming for 8% instead of 5% to cover our initial marketing costs.', time: 'Oct 4, 02:15 PM' },
    ],
  },
  'dummy2@company.com': {
    email: 'dummy2@company.com',
    companyName: 'Apex Digital',
    applicationId: 'IND-APX02',
    uatProgress: [1],
    agreementStatus: 'AWAITING_SIGNATURE',
    commercialTerms: { rateLimit: '100 req/sec', wholesaleMargin: '10%', sla: '99.9%' },
    agreementVersion: 2,
    negotiationHistory: [
      { id: 1, sender: 'Franchisee', text: 'Can we change the SLA from 99.9% to 99.95% for the core payments API?', time: 'Oct 1, 10:00 AM' },
      { id: 2, sender: 'Franchisor', text: 'We can accommodate this for Apex Digital given your volume projections.', time: 'Oct 1, 03:00 PM' },
    ],
  },
  'submitted1@company.com': {
    email: 'submitted1@company.com',
    companyName: 'Global Logistics Inc',
    applicationId: 'IND-GLO12',
    uatProgress: [1, 2, 3, 4],
    agreementStatus: 'UPLOADED',
    commercialTerms: { rateLimit: '100 req/sec', wholesaleMargin: '10%', sla: '99.9%' },
    agreementVersion: 2,
    agreementDocUrl: 'uploads/agreement_glo.pdf',
    signedDocUrl: 'uploads/signed_agreement_glo.pdf',
    negotiationHistory: [],
  },
  'submitted2@company.com': {
    email: 'submitted2@company.com',
    companyName: 'Nexus Retail Ltd',
    applicationId: 'IND-NEX45',
    uatProgress: [1, 2, 3, 4],
    agreementStatus: 'UPLOADED',
    commercialTerms: { rateLimit: '100 req/sec', wholesaleMargin: '10%', sla: '99.9%' },
    agreementVersion: 1,
    agreementDocUrl: 'uploads/agreement_nexus.pdf',
    signedDocUrl: 'uploads/signed_agreement_nexus.pdf',
    negotiationHistory: [],
  },
};

// Simple in-memory store
let users = { ...INITIAL_USERS };

export const mockDb = {
  getUser: (email: string): B2BUser | undefined => {
    return users[email];
  },

  createUser: (user: B2BUser) => {
    users[user.email] = user;
    return user;
  },

  updateUATProgress: (email: string, passedScenarioId: number) => {
    const user = users[email];
    if (user && !user.uatProgress.includes(passedScenarioId)) {
      user.uatProgress = [...user.uatProgress, passedScenarioId];
    }
    return user;
  },

  updateAgreementStatus: (email: string, status: B2BUser['agreementStatus']) => {
    const user = users[email];
    if (user) {
      user.agreementStatus = status;
    }
    return user;
  },

  updateAgreementDoc: (email: string, docUrl: string) => {
    const user = users[email];
    if (user) {
      user.agreementDocUrl = docUrl;
      user.agreementVersion += 1;
      user.agreementStatus = 'AWAITING_SIGNATURE';
    }
    return user;
  },

  uploadSignedDoc: (email: string, docUrl: string) => {
    const user = users[email];
    if (user) {
      user.signedDocUrl = docUrl;
      user.agreementStatus = 'UPLOADED';
    }
    return user;
  },

  addNegotiationMessage: (email: string, message: { sender: 'Franchisee' | 'Franchisor', text: string }) => {
    const user = users[email];
    if (user) {
      const newMessage = {
        id: user.negotiationHistory.length + 1,
        ...message,
        time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      user.negotiationHistory = [...user.negotiationHistory, newMessage];
    }
    return user;
  },

  getAllUsers: (): B2BUser[] => {
    return Object.values(users);
  },
};
