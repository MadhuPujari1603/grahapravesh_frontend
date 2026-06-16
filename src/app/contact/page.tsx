"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.CONTACT_SUBMIT, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: [
          formData.subject ? `Subject: ${formData.subject}` : null,
          formData.phone ? `Phone: ${formData.phone}` : null,
          formData.message.trim(),
        ].filter(Boolean).join("\n"),
      });
      toast.success("Thank you! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-light">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-emerald-dark to-brand-emerald text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            <Link href="/" className="absolute left-0 top-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white text-sm font-medium group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Get in Touch</h1>
            <p className="text-sm text-emerald-100 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Our team is here to help
              make your home dreams a reality.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Cards */}
            <div className="rounded-xl border p-6 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-brand-emerald" />
              </div>
              <h3 className="text-base font-semibold text-brand-charcoal mb-2">Phone</h3>
              <a href="tel:+918762625888" className="text-sm text-brand-emerald hover:underline font-medium block mb-1">
                +91 87626 25888
              </a>
              <p className="text-xs text-brand-charcoal-light mb-3">Mon-Sat, 10AM - 7PM IST</p>
              <a
                href="https://wa.me/918762625888?text=Hi%2C%20I%20have%20a%20query%20about%20Graha%20Pravesh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all"
                style={{ background: "rgba(37,211,102,0.90)" }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            <div className="rounded-xl border p-6 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-brand-emerald" />
              </div>
              <h3 className="text-base font-semibold text-brand-charcoal mb-2">Email</h3>
              <a href="mailto:grahapravesh21@gmail.com" className="text-sm text-brand-emerald hover:underline font-medium block mb-1">
                grahapravesh21@gmail.com
              </a>
              <p className="text-xs text-brand-charcoal-light mb-3">We'll respond within 24 hours</p>
              <a
                href="mailto:grahapravesh21@gmail.com?subject=Enquiry from Graha Pravesh Website"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all"
                style={{ background: "rgba(10,61,46,0.90)" }}
              >
                <Mail className="w-3.5 h-3.5" />
                Send Email
              </a>
            </div>

            <div className="rounded-xl border p-6 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-brand-emerald" />
              </div>
              <h3 className="text-base font-semibold text-brand-charcoal mb-2">
                Visit Us
              </h3>
              <p className="text-sm text-brand-charcoal-medium mb-1">
                C-209, M.T SAGAR INDUSTRIAL ESTATE
              </p>
              <p className="text-sm text-brand-charcoal-medium mb-1">
                GOKUL ROAD, Hubli
              </p>
              <p className="text-sm text-brand-charcoal-medium">
                KARNATAKA, 580030
              </p>
            </div>

            <div className="bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 rounded-xl border border-brand-gold/20 p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-gold-dark mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-brand-charcoal mb-2">
                    Business Hours
                  </h4>
                  <div className="space-y-1 text-xs text-brand-charcoal-medium">
                    <p>Monday - Friday: 10:00 AM - 7:00 PM</p>
                    <p>Saturday: 11:00 AM - 6:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border p-8 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-emerald flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brand-charcoal">
                    Send us a Message
                  </h2>
                  <p className="text-xs text-brand-charcoal-light">
                    Fill out the form below and we'll get back to you soon
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="input-premium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="input-premium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 87626 25888"
                      className="input-premium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-premium"
                    >
                      <option value="">Select a subject</option>
                      <option value="product">Product Inquiry</option>
                      <option value="order">Order Status</option>
                      <option value="support">Customer Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-charcoal mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="input-premium resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-brand-charcoal-light">
                    * Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-6 bg-gradient-to-r from-brand-emerald/5 to-transparent rounded-xl border border-brand-emerald/10 p-6">
              <h3 className="text-sm font-semibold text-brand-charcoal mb-3">
                Why Choose Graha Pravesh?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-emerald/10 flex items-center justify-center shrink-0">
                    <span className="text-brand-emerald text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-brand-charcoal">Premium Quality</p>
                    <p className="text-2xs text-brand-charcoal-light mt-0.5">
                      Curated collection
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-emerald/10 flex items-center justify-center shrink-0">
                    <span className="text-brand-emerald text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-brand-charcoal">Fast Delivery</p>
                    <p className="text-2xs text-brand-charcoal-light mt-0.5">
                      Nationwide shipping
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-emerald/10 flex items-center justify-center shrink-0">
                    <span className="text-brand-emerald text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-brand-charcoal">24/7 Support</p>
                    <p className="text-2xs text-brand-charcoal-light mt-0.5">
                      Always here to help
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
