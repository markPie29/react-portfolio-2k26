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
  honors: "DOST-SEI S&T Undergraduate Scholar",
};

export const certificatesData: CertificateItem[] = [
  {
    id: "cert-1",
    title: "Full Stack Web Development",
    issuer: "Tech Academy / Online Certification",
    date: "2025",
    badgeTag: "WEB DEV",
  },
  {
    id: "cert-2",
    title: "UI/UX & Visual Design Fundamentals",
    issuer: "Creative Design Institute",
    date: "2024",
    badgeTag: "UI/UX",
  },
  {
    id: "cert-3",
    title: "Graphic Design & Digital Publishing",
    issuer: "AP Global IT Solutions Training",
    date: "2023",
    badgeTag: "GRAPHICS",
  },
  {
    id: "cert-4",
    title: "DOST-SEI Undergraduate Merit Scholarship",
    issuer: "Department of Science and Technology",
    date: "2023 - Present",
    badgeTag: "SCHOLARSHIP",
  },
];
