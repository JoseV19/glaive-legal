import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Glaive Legal | Plataforma Juridica Avanzada para Abogados en Guatemala",
  description:
    "Analiza casos laborales, gestiona expedientes, consulta 5 codigos legales y redacta documentos notariales. La plataforma legal mas avanzada de Guatemala.",
  keywords: [
    "abogados guatemala",
    "tecnologia legal",
    "codigo de trabajo guatemala",
    "gestion de expedientes",
    "analisis laboral automatizado",
    "software legal guatemala",
    "plataforma juridica",
    "notario guatemala",
  ],
  openGraph: {
    title: "Glaive Legal | Tecnologia Juridica para Abogados Guatemaltecos",
    description:
      "La plataforma legal avanzada para profesionales del derecho en Guatemala. Analisis laboral, gestion de casos y biblioteca de codigos.",
    url: "https://glaive.legal/landing",
    siteName: "Glaive Legal",
    locale: "es_GT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glaive Legal | Tecnologia Legal para Guatemala",
    description:
      "Analisis laboral avanzado, gestion de expedientes y biblioteca de codigos legales guatemaltecos.",
  },
  robots: "index, follow",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
