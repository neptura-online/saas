import { FaEnvelope } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="min-h-screen bg-zinc-100 flex flex-col">
      <header className="relative z-10 bg-zinc-900 flex items-center justify-between px-3 py-2 lg:px-16">
        <a href="/">
          <img
            src="/assets/logowhite.webp"
            alt="Logo"
            className="h-12 md:h-16 w-auto"
            loading="lazy"
          />
        </a>

        <div className="flex items-center gap-4">
          <a className="hidden md:flex items-center gap-2 rounded-xl border border-white/80 px-4 py-3 text-base text-white">
            <FaEnvelope />
            ID@e-marketing.io
          </a>
          <a className="flex items-center gap-2 rounded-xl bg-(--yellow-emarketing) px-4 py-3 text-sm lg:text-base font-semibold text-black">
            <FiPhone />
            +91-9602694444
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-[72px] sm:text-[96px] lg:text-[140px] font-extrabold leading-none">
            <span className="float text-zinc-900">4</span>
            <span className="float-delay text-(--yellow-emarketing)">0</span>
            <span className="float text-zinc-900">4</span>
          </h1>

          <p className="mt-4 text-xs sm:text-sm tracking-[0.35em] uppercase text-zinc-500">
            Page not found
          </p>

          <p className="mt-6 text-base sm:text-lg text-zinc-700">
            Sorry! The page you’re looking for doesn’t exist.
          </p>

          <Link
            to="/"
            className="
              inline-flex items-center
              mt-8
              rounded-full
              border border-zinc-300
             bg-(--yellow-emarketing)
              px-6 py-3
              text-sm sm:text-base
              font-medium text-zinc-900
              shadow-sm
              transition
              hover:scale-[1.03]
              hover:border-zinc-400
            "
          >
            ← Return home
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-900 px-2 py-4 flex justify-center w-screen">
        <div className="w-full max-w-350 flex flex-col-reverse xl:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-white/90">
            Copyright © {new Date().getFullYear()} | Powered by JAI MARKETING.
          </p>
          <div className="flex gap-6 text-xs sm:text-sm text-white/90">
            <a href="https://www.e-marketing.io/privacy-policy/">
              Privacy Policy
            </a>
            <a href="https://www.e-marketing.io/disclaimer/">Disclaimer</a>
            <a href="https://www.e-marketing.io/terms-of-use/">Terms of Use</a>
          </div>
        </div>
      </footer>

      {/* FLOAT ANIMATION */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .float {
          display: inline-block;
          animation: float 5s ease-in-out infinite;
        }

        .float-delay {
          display: inline-block;
          animation: float 5s ease-in-out infinite;
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
};

export default NotFound;
