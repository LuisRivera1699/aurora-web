/** Documento en Firestore (misma forma que `submitContactLead`). */
export type ContactLeadRecord = {
  id: string;
  name: string;
  email: string;
  message: string;
  company: string;
  phone: string;
  requirementType: string;
  userAgent: string;
  source: string;
  createdAt: string;
};
