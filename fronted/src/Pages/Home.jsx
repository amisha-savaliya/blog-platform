import Navbar from "../components/Navbar";
import HeroPosts from "../components/HeroPosts";
import Footer from "../components/Footer";
import PostsSection from "../components/PostsSection";
import RetroSection from "../components/RetroSection";
import About from "./About";
import Contact from "./Contact";

export default function Home() {
  return (
    <>
    
      <RetroSection />
      <PostsSection />
      <About />
      <Contact />
    </>
  );
}
