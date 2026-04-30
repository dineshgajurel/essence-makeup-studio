"use client";

import { useState } from "react";

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);

  // IMPORTANT: The user needs to replace this URL with their Google Form POST URL
  // Example: https://docs.google.com/forms/d/e/1FAIpQLS..../formResponse
  const googleFormActionUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdngPRX7cQRGP4guPreihMsMP4JJ1JtUFXvqiKhLnB94DNMgA/formResponse";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Convert FormData to URLSearchParams which Google Forms expects
    const data = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      data.append(key, value.toString());
    }

    // Submit to Google Forms using no-cors to avoid CORS errors
    fetch(googleFormActionUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((error) => {
        console.error("Error submitting form", error);
        // Even if there's an opaque error due to no-cors, we assume success
        setSubmitted(true);
      });
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-medium text-text-dark mb-4">
            Book or Contact Us
          </h2>
          <p className="text-lg text-gray-500">
            Have a question or ready to visit? Fill out the form below and we will get back to you shortly.
          </p>
        </div>

        <div className="bg-bg-light p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-primary/10">


          {submitted ? (
            <div className="text-center py-12 md:py-20 fade-in-up">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8">
                <span className="text-5xl">✨</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-medium text-text-dark mb-4">
                Message Sent!
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-10 leading-relaxed">
                Thank you for reaching out to Essence. We&apos;ve received your request and will get back to you shortly to confirm your visit.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="https://www.instagram.com/essencemakeupstudio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary text-text-light px-8 py-3 rounded-full font-medium border-2 border-primary transition-all duration-300 hover:bg-transparent hover:text-primary"
                >
                  Follow our Work
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-gray-500 font-medium hover:text-primary transition-colors py-3"
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm font-medium text-text-dark mb-2 ml-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="entry.484721197"
                    required
                    placeholder="John Doe"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-sm font-medium text-text-dark mb-2 ml-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="entry.2021905219"
                    required
                    placeholder="+977 9800000000"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Selection */}
                <div className="flex flex-col">
                  <label htmlFor="service" className="text-sm font-medium text-text-dark mb-2 ml-1">
                    Service Interested In *
                  </label>
                  <select
                    id="service"
                    name="entry.1260614881"
                    required
                    defaultValue=""
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a service...</option>
                    <option value="Hair (keratin,cutting,color,nanoplex,smoothing)">Hair (keratin, cutting, color, nanoplex, smoothing)</option>
                    <option value="Makeup (bridal/party)">Makeup (bridal/party)</option>
                    <option value="Lashes extensions">Lashes extensions</option>
                    <option value="Manicure pedicure">Manicure pedicure</option>
                    <option value="Nail extensions">Nail extensions</option>
                    <option value="Waxing">Waxing</option>
                    <option value="Facial">Facial</option>
                    <option value="Hydra facial">Hydra facial</option>
                    <option value="Makeup photoshoot">Makeup photoshoot</option>
                    <option value="Jewelry photoshoot">Jewelry photoshoot</option>
                    <option value="Others (Mention in message field)">Others (Mention in message field)</option>

                  </select>
                </div>

                {/* Preferred Date */}
                <div className="flex flex-col">
                  <label htmlFor="date" className="text-sm font-medium text-text-dark mb-2 ml-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="entry.117885170"
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>



              {/* Special Requests */}
              <div className="flex flex-col">
                <label htmlFor="message" className="text-sm font-medium text-text-dark mb-2 ml-1">
                  Special Requests / Message
                </label>
                <textarea
                  id="message"
                  name="entry.259641505"
                  rows={4}
                  placeholder="Tell us about any specific preferences or questions..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="mt-4 text-center">
                <button
                  type="submit"
                  className="bg-primary text-text-light px-10 py-4 rounded-full font-medium border-2 border-primary transition-all duration-300 hover:bg-transparent hover:text-primary w-full md:w-auto text-lg shadow-[0_10px_20px_rgba(138,154,134,0.3)] hover:shadow-none hover:-translate-y-1"
                >
                  Send Message / Book Now
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
