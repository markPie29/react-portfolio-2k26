export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  badgeTag: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  honors: string;
}

export const educationData: EducationItem = {
  institution: "University of Rizal System - Antipolo Campus",
  degree: "BS in Computer Engineering",
  period: "2023 – Present",
  honors: "DOST-SEI S&T Undergraduate Scholar (R.A. 7687)",
};

export const certificatesData: CertificateItem[] = [
  {
    id: "cert-1",
    title: "DOST-SEI Undergraduate R.A. 7687 Scholarship",
    issuer: "Department of Science and Technology (DOST-SEI)",
    date: "2023 – Present",
    badgeTag: "SCHOLARSHIP",
  },
  {
    id: "cert-2",
    title: "AP Global Internship Certification",
    issuer: "AP Global IT Solutions Inc.",
    date: "2023",
    badgeTag: "INTERNSHIP",
  },
  {
    id: "cert-3",
    title: "Nexvision Innovations Internship Certification",
    issuer: "Nexvision Innovations",
    date: "2026",
    badgeTag: "INTERNSHIP",
  },
];
