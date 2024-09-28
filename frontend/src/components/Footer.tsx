import "./Footer.css";
import "@rainbow-me/rainbowkit/styles.css";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="footerContainer">
      <div className="footerParagraph">Made with ❤️ by FIL-Builder</div>
      <div className="icons">
        <FaXTwitter className="icon xIcon" />
        <FaInstagram className="icon instagramIcon" />
        <FaYoutube className="icon youtubeIcon" />
        <FaLinkedin className="icon linkedinIcon" />
      </div>
    </div>
  );
};

export default Footer;
