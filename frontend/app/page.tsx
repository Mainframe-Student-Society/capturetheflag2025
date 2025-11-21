import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col justify-center items-center ">
        <div className="container mx-auto px-4 max-w-3xl ">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 ">
            Welcome to the Capture The Flag Platform
          </h1>
        </div>
      </section>

      <Footer />
    </>
  );
}
