export default function Footer() {
  return (
    <footer className=" text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Mainframe Student Society</h3>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CTF 2025. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6"></div>
        </div>
      </div>
    </footer>
  );
}
