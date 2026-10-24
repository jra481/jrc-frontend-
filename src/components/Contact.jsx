import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import "./../Contact.css"
import { BUSINESS_ADDRESS, BUSINESS_MAP_IMAGE, BUSINESS_MAP_URL, getWhatsappUrl } from "../config/business";
import Seo from "./Seo";

const ContactUs = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const topic = searchParams.get("topic");
    const initialSubject = topic === "export-supply" ? "Export & Supply Enquiry" : topic === "bulk-supply" ? "Bulk Supply Enquiry" : "";
    const [formData, setFormData] = useState(() => ({
        name: "",
        email: "",
        phone: "",
        subject: initialSubject,
        message: "",
    }));

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const sendWhatsApp = (e) => {
        e.preventDefault();

        const { name, email, phone, subject, message } = formData;

        if (!name || !email || !phone || !subject || !message) {
            alert("Please fill in all fields.");
            return;
        }

        const text = `Hello Jamal Rafeeq Team,

Name: ${name}

Email: ${email}

Phone: ${phone}

Subject: ${subject}

Message:
${message}

Thank you.`;

        const whatsappUrl = getWhatsappUrl(text);
        if (!whatsappUrl) {
            alert("WhatsApp contact is not configured.");
            return;
        }

        const messageWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        if (messageWindow) messageWindow.opener = null;
    };

    return (<>
        {location.pathname.toLowerCase() === "/contact" && <Seo
            title="Contact Jamal Rafeeq Auto Parts Trading LLC | Dubai"
            description="Contact Jamal Rafeeq Auto Parts Trading LLC in Deira, Dubai for automotive parts, sourcing, export, and supply enquiries."
            path="/contact"
        />}
        <div className="contact-page">

            <div className="contact-header">

                <span className="contact-tag">
                    CONTACT US
                </span>

                <h1>
                    We'd Love To Hear From You
                </h1>

                <p>
                    Have a question about our automotive range,
                    an export or supply requirement, or a shipment?
                    Fill out the form below and send us
                    a message directly on WhatsApp.
                </p>

            </div>

            <div className="contact-container">

                {/* Left */}

                <div className="contact-info">

                    <h2>Get In Touch</h2>

                    <div className="info-box">

                        <h4>Business Hours</h4>

                        <div className="business-hours">
                            <p>
                                <span>Monday - Friday</span>
                                <strong>9:00 AM - 8:00 PM</strong>
                            </p>

                            <p>
                                <span>Saturday</span>
                                <strong>9:00 AM - 6:00 PM</strong>
                            </p>

                            <p>
                                <span>Sunday</span>
                                <strong>Closed</strong>
                            </p>
                        </div>

                    </div>

                    <div className="info-box">

                        <h4>Response Time</h4>

                        <p>
                            We usually reply within a few hours on WhatsApp.
                        </p>

                    </div>

                    <div className="info-box">

                        <h4>Need Immediate Help?</h4>

                        <p>
                            Send us a WhatsApp message and our team will assist you as soon as possible.
                        </p>

                    </div>

                </div>

                {/* Right */}

                <form
                    className="contact-form"
                    onSubmit={sendWhatsApp}
                >

                    <div className="input-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />



                    </div>

                    <div className="input-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Subject
                        </label>

                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select a Subject
                            </option>

                            <option>
                                Product Enquiry
                            </option>

                            <option>
                                Export &amp; Supply Enquiry
                            </option>

                            <option>
                                Bulk Supply Enquiry
                            </option>

                            <option>
                                Order Status
                            </option>

                            <option>
                                Returns & Exchanges
                            </option>

                            <option>
                                Payment Issue
                            </option>

                            <option>
                                Size & Fit Assistance
                            </option>

                            <option>
                                General Enquiry
                            </option>

                            <option>
                                Collaboration
                            </option>

                            <option>
                                Feedback & Suggestions
                            </option>

                        </select>

                    </div>

                    <div className="input-group">

                        <label>
                            Message
                        </label>

                        <textarea
                            rows="6"
                            name="message"
                            placeholder="Write your message..."
                            value={formData.message}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        className="whatsapp-btn"
                        type="submit"
                    >

                        Send via WhatsApp →

                    </button>

                </form>

            </div>

            <section className="contact-map" aria-labelledby="contact-map-title">
                <div className="contact-map-copy">
                    <span className="contact-tag">FIND US</span>
                    <h2 id="contact-map-title">Visit Our Location</h2>
                    <p>{BUSINESS_ADDRESS}</p>
                    <a className="contact-map-link" href={BUSINESS_MAP_URL} target="_blank" rel="noopener noreferrer">
                        Open location in Google Maps →
                    </a>
                </div>
                <div className="contact-map-frame">
                    <img
                        title="Jamal Rafeeq Auto Parts Trading LLC location map"
                        src={BUSINESS_MAP_IMAGE}
                        alt="Map showing Jamal Rafeeq Auto Parts Trading LLC in Deira, Dubai"
                        loading="lazy"
                    />
                    <a className="contact-map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
                        Map data © OpenStreetMap contributors
                    </a>
                </div>
            </section>

        </div>
    </>);
};

export default ContactUs;
