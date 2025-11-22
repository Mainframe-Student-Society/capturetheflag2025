import { Social } from "@/Data/SocialSites";
import { NavLinks } from "@/Data/Navlinks";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 mt-auto border-t border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              MainFrame Student Society, UoW
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Get hands-on experience on how to interact with mainframe systems
              through interactive challenges and learning opportunities
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              {NavLinks.map((link) => {
                return (
                  <a
                    key={link.title}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                  >
                    <span>{link.title}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">
              Get in Touch
            </h4>
            <a
              href="mailto:masswlv@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-5 h-5 inline-block mr-2" aria-hidden="true" />
              masswlv@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-muted-foreground text-sm text-center md:text-left">
              Crafted with love by{" "}
              <a
                href="https://www.linkedin.com/in/razeevasnx/"
                className="underline text-primary hover:text-primary/80"
              >
                Rajeev Puri
              </a>{" "}
              <span>and</span>{" "}
              <a
                href="https://www.linkedin.com/in/zubairidrisaweda/"
                className="underline text-primary hover:text-primary/80"
              >
                Idris Aweda Zubair
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            {Social.map((social) => {
              return (
                <a
                  key={social.title}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                  title={social.title}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
