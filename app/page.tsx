import {
  Hero,
  HowItWorks,
  WhatYouGet,
  TestsCarousel,
  PaidPlanSection,
  StatsBlock,
  AIChatBlock,
  Footer,
} from "@/app/components/landing";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box component="main" sx={{ minHeight: "100vh" }}>
      <Hero />
      <HowItWorks />
      <TestsCarousel />
      <PaidPlanSection />
      <StatsBlock />
      <WhatYouGet />
      <AIChatBlock />
      <Footer />
    </Box>
  );
}
