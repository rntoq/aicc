import { Box } from "@mui/material";
import {
  Hero,
  HowItWorks,
  WhatYouGet,
  TestsCarousel,
  PaidPlanSection,
  StatsBlock,
  AIChatBlock,
} from "@/app/components/landing";
import { Header, Footer } from "./components/layout";

const styles = { main: { minHeight: "100vh", pt: { xs: 7, sm: 8 } } };

const Home = () => (

  <>
    <Header onLanding={true} />
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
  </>
);

export default Home;
