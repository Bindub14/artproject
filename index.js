import { HeroBanner } from "../components/HeroBanner";
import { Merchandise } from "../components/HomePageComponents/Merchandise";
import { Container } from "@mui/material";
import { WhyArtisan } from "../components/HomePageComponents/WhyArtisan";
import { ArtisanServices } from "../components/HomePageComponents/ArtisanServices";
import { Products } from "../components/HomePageComponents/Products";
import { useSelector } from "react-redux";
import { HeaderV2 } from "components/HeaderV2";

const Index = () => {
  const theme = useSelector((state) => state.theme);
  const userInfo = useSelector((state) => state?.user);
  return (
    <>
      <div style={{ backgroundColor: theme.bgcolor }}>
        <HeaderV2 />
      </div>
      <HeroBanner />
      {userInfo?.isValid ? (
        <Container maxWidth="xl" component="main">
          <Merchandise />
          {/* <SimpleSlider /> */}
          <WhyArtisan />
          <ArtisanServices />
          <Products />
        </Container>
      ) : null}
      {/* <div style={{ position: "relative", bottom: "-34px" }}>
        <Footer />
      </div> */}
    </>
  );
};

export default Index;
