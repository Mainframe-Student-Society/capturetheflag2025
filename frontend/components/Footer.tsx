import { Social } from "@/Data/SocialSites";
import { NavLinks } from "@/Data/Navlinks";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="  py-12 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              MainFrame Student Society, UoW
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Get hands on experience on how to interact with the MainFrame
              system through capture the flag
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {NavLinks.map((link) => {
                return (
                  <a
                    key={link.title}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <span>{link.title}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <a
              href="mailto:masswlv@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5 inline-block mr-2" aria-hidden="true" />
              masswlv@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center max-w-7xl">
          <div>
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              Crafted with love by{" "}
              <a
                href="https://www.linkedin.com/in/razeevasnx/"
                className="underline text-blue-400"
              >
                Rajeev Puri
              </a>{" "}
              <span>and</span>{" "}
              <a
                href="https://www.linkedin.com/in/zubairidrisaweda/"
                className="underline text-blue-400"
              >
                Idris Aweda Zubair
              </a>
            </p>
          </div>
          <div>
            {" "}
            <div className="flex  flex-wrap gap-4">
              {Social.map((social) => {
                return (
                  <a
                    key={social.title}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                    title={social.title}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
