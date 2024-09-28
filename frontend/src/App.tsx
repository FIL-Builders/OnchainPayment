import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";

const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default App;
