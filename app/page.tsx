import { Box } from "@mui/material";
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

const styles = { main: { minHeight: "100vh" } };

const Home = () => (
  <Box component="main" sx={styles.main}>
    <Hero />
    <WhatYouGet />
    <HowItWorks />
    <TestsCarousel />
    <PaidPlanSection />
    <StatsBlock />
    <AIChatBlock />
    <Footer />
  </Box>
);

export default Home;
