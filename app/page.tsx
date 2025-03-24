'use client';
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Head>
        <title>SWC - Smart Garbage Collection Management</title>
        <meta
          name="description"
          content="Admin portal for efficient garbage collection management"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header
        className={`fixed w-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="text-2xl font-bold text-gray-800">SWC </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Contact
            </a>
          </nav>
          <div>
            <Link href="/login">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
                Login
              </button>
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Smart Waste Management
              <span className="text-green-600"> Simplified</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Streamline your garbage collection operations with our
              comprehensive admin dashboard. Optimize routes, track vehicles,
              and manage schedules all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </Link>
              <Link href="#demo">
                <button className="bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-8 rounded-lg text-lg transition-colors border-2 border-green-600 shadow-lg hover:shadow-xl">
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="/images/1.png"
              alt="Dashboard Preview"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage waste collection operations
              efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Route Optimization
              </h3>
              <p className="text-gray-600">
                Optimize collection routes to save fuel and time while improving
                service efficiency.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Task Management
              </h3>
              <p className="text-gray-600">
                Assign, track, and manage collection tasks with real-time status
                updates.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600">
                Make data-driven decisions with comprehensive analytics and
                reporting tools.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                GPS Fleet Tracking
              </h3>
              <p className="text-gray-600">
                Track vehicle locations in real-time and monitor driver
                performance.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Incident Reporting
              </h3>
              <p className="text-gray-600">
                Log and manage incidents or service disruptions quickly and
                efficiently.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Team Management
              </h3>
              <p className="text-gray-600">
                Manage staff schedules, performance, and certifications in one
                place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-green-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform streamlines every aspect of waste management
              operations
            </p>
          </div>

          <div className="flex flex-col space-y-12">

            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12">
                <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Login to Your Dashboard
                </h3>
                <p className="text-lg text-gray-600">
                  Access your secure admin portal with personalized views based
                  on your role and responsibilities.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/images/login.svg"
                  alt="Dashboard Login"
                  style={{ height: "200px", width: "auto" }}
                  className="rounded-lg "
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-12">
                <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Schedule and Assign Routes
                </h3>
                <p className="text-lg text-gray-600">
                  Plan collection routes, assign vehicles and staff, and
                  optimize for efficiency with our intelligent routing system.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/images/route.svg"
                  alt="Route Planning"
                  style={{ height: "200px", width: "auto" }}
                  className="rounded-lg "
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12">
                <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Monitor Operations in Real-time
                </h3>
                <p className="text-lg text-gray-600">
                  Track collection progress, vehicle locations, and team
                  performance with live updates and alerts.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/images/monitor.svg"
                  alt="Real-time Monitoring"
                  style={{ height: "200px", width: "auto" }}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cities and waste management companies trust WasteWise to optimize
              their operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-xl">SK</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">KAVIN</h4>
                  <p className="text-gray-600 text-sm">
                    Operations Director, GreenCity Waste
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "SWC has transformed how we manage our fleet. We've
                reduced fuel costs by 27% and improved collection efficiency by
                over 30% in just six months."
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-xl">RN</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">NIRUSHAN</h4>
                  <p className="text-gray-600 text-sm">
                    City Manager, Westlake
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The reporting and analytics capabilities have given us
                unprecedented insights into our waste management operations,
                helping us justify budget allocations and improve services."
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-xl">SV</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">SUTHARSAN</h4>
                  <p className="text-gray-600 text-sm">
                    CEO, Urban Sanitation Services
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Implementation was seamless and the customer support is
                exceptional. Our team adapted quickly and the results speak for
                themselves - more efficient routes and happier customers."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Waste Management Operations?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of municipalities and companies already optimizing
            their garbage collection services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login">
              <button className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl">
                Start Free Trial
              </button>
            </Link>
            <Link href="#contact">
              <button className="bg-transparent hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors border-2 border-white shadow-lg hover:shadow-xl">
                Contact Sales
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? Our team is here to help you get started.
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="bg-green-50 p-8 rounded-xl h-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600 mt-1 mr-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-bold text-gray-800">Address</h4>
                      <p className="text-gray-600">
                        Pointpedro Road, Nallur
                        <br />
                       Jaffna
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600 mt-1 mr-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-bold text-gray-800">Phone</h4>
                      <p className="text-gray-600">+94 (78) 770-0000</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600 mt-1 mr-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-bold text-gray-800">Email</h4>
                      <p className="text-gray-600">info@smartwaste.example</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600 mt-1 mr-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-bold text-gray-800">Hours</h4>
                      <p className="text-gray-600">
                        Monday - Friday: 9AM - 5PM
                        <br />
                        Weekend: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="text-2xl font-bold">SWC</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transforming waste management operations with smart technology
                solutions.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Waste Collection
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Recycling Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Smart Bins
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Analytics Platform
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Consulting
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Our Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    News & Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Pointpedro Road, Nallur
                        
                       Jaffna</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+94 (78) 770-0000</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>info@smartwaste.com</span>
                </li>
              </ul>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">
                  Subscribe to our newsletter
                </h4>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-4 py-2 bg-gray-700 text-white rounded-l focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-r transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} SWC. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
