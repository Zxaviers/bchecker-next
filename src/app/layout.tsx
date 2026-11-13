import type { Metadata } from "next";
import { Barlow_Condensed, Courier_Prime } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const typed = Courier_Prime({
  variable: "--font-typed",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BChecker | CPU and GPU bottleneck test report",
  description:
    "Pick a CPU, GPU, resolution and purpose and get a stamped test report showing which part is holding the other back. An estimate built from cited Blender Open Data benchmark scores.",
};

/** Design contract, emitted into the markup as an HTML comment. */
const CONTRACT = `
THESIS: BChecker is a laboratory test report you fill in and get stamped. The page is the form and the certificate; it refuses both the dark neon HUD and the white-card calculator.
OWN-WORLD: a sheet of cool security paper lying on a deep teal desk with a second sheet turned beneath it; teal-black ink, a guilloche border band and rosette seal, recessed ruled form boxes, typed (Courier Prime) entries, Barlow Condensed forms lettering, a graduated caliper scale for the percentage, a large red rubber verdict stamp. Soft cast shadows are the only elevation. Daytime desk.
STORY: pick two parts and a use; receive a stamped reading with its arithmetic and cited sources shown; believe it because every number traces to a public source; act by pressing Analyze.
FIRST VIEWPORT: guilloche band and masthead; left, the report title as a huge condensed headline; right, a ruled report-details table; below, the filled-in form (Items under test) already reachable with Analyze in view.
FORM: calibration certificate / laboratory test report, candidate 4 of 7 (seed 62697c40).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${typed.variable}`}>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: `<!--${CONTRACT}-->` }} />
        {children}
      </body>
    </html>
  );
}
