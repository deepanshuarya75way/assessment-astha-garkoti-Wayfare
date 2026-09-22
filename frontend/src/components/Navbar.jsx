import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import Icon from "./Icon.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Navbar() {
  const { user, logout } = useBooking();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleBecomeHost() {
    if (!user) {
      navigate("/login", { state: { from: "/host/apply" } });
      return;
    }

    if (user.role === "host" || user.role === "admin") {
      navigate("/admin/listings/new");
      return;
    }

    navigate("/host/apply");
  }

  function Disputes(){
    navigate("/dispute");
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-parchment/90 backdrop-blur border-b border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-parchmentDim transition-colors"
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-marigold font-display italic text-lg">
                w
              </span>
              <span className="font-display italic text-2xl tracking-tight text-ink">
                Wayfare
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-body text-sm text-ink/70">
            <Link to="/explore" className="hover:text-ink transition-colors">
              Stays
            </Link>

            <Link to="/favorites" className="hover:text-ink transition-colors">
              Favorites
            </Link>
           

            <button
              onClick={Disputes}
              className="hover:text-ink transition-colors"
            >
              Dispute
            </button>

            <button
              onClick={handleBecomeHost}
              className="hover:text-ink transition-colors"
            >
              Become a host
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:block text-sm text-ink/70 font-mono">
                  {user.name}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-sm px-4 py-2 rounded-full border border-line hover:border-ink/40 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm px-4 py-2 rounded-full hover:bg-parchmentDim transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm px-4 py-2 rounded-full bg-teal text-parchment hover:bg-teal-light transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}