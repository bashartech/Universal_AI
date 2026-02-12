Universal Chatbot by Aykays Assist – Developer Task Brief
Objective
Build a fully functional Universal AI Chatbot that can be deployed on any website or digital platform (WordPress, Wix, Webflow, Shopify, custom PHP/HTML, SaaS dashboards, landing pages) to handle customer inquiries, lead generation, support questions, and follow-ups across any industry (education, real estate, healthcare, e-commerce, services, SaaS, fitness, clinics, etc.).
The initial version will use generic industry-agnostic data for demonstration purposes and must be easily configurable for industry- and business-specific use cases via a JSON configuration file.
The solution must be fully frontend-based, built with React, using Supabase / Firebase / Google Sheets for data storage, and Mistral API for AI processing.
 ❌ No Node.js or backend deployment required on the client’s server.

Core Features
1. Website Chat Widget
Lightweight, fast, responsive React-based chat widget


Deployable via a single <script> tag


Works seamlessly on:


WordPress


Wix


Webflow


Shopify


Custom PHP / HTML sites


UI Features:


Welcome message:
 “Hi, I’m your AI Assistant. How can I help you today?”


Industry-aware quick reply buttons (configurable), e.g.:


Pricing


Services


Book Appointment


Contact Support


Smooth animations, mobile-first design


Supports multiple concurrent users


Optional:


WhatsApp integration (secure API, no user login required)


Floating button + minimized chat state



2. AI Knowledge Base (Industry-Agnostic)
Pre-trained on generic business conversations, adaptable to:


Education


Real Estate


Healthcare


Fitness


E-commerce


SaaS


Professional services


Handles:


Pricing / plans


Services or products


Business hours


Contact information


FAQs


Booking / inquiry flows


Uses Mistral API for intent detection and response generation


Smart fallback handling:


 “I’m not fully sure about that, but I can connect you with a human representative.”




3. Lead Capture System
Automatically captures leads through conversational flow


Customizable fields per industry:


Name


Phone / Email


Company (optional)


Service/Product of interest


Preferred contact time


Notes or message


Stores leads securely in:


Supabase


Firebase


Google Sheets


Designed for CRM-ready data structure


Future-ready for:


CRM sync


Sales pipelines


Automation workflows



4. Follow-ups & Notifications
Automated follow-ups for:


Incomplete conversations


Abandoned lead capture


Notification triggers:


New lead submission


Human escalation request


Notification channels:


Email


WhatsApp API (optional)


Configurable per business



5. Human Escalation System
Detects:


Low-confidence AI responses


Complex or sensitive queries


Shows CTA:
 “Talk to a Human”


Forwards:


Conversation transcript


User contact details


Sends alert to admin via:


Email


WhatsApp


Ensures trust and reliability



6. Admin Panel (Demo / Internal Use)
Simple React-based dashboard


Login with fixed demo credentials


View:


Chat conversations


Captured leads


Escalation requests


Filters by:


Date


Status


Source website


Purpose:


Demo


QA testing


Internal validation



7. Configuration System (JSON-Based)
Each business is configured via a single JSON file, no code changes required.
{
  "business_name": "Demo Business",
  "industry": "Real Estate",
  "services": ["Buy Property", "Sell Property", "Rent"],
  "pricing": "Starting from PKR 5,000",
  "business_hours": "9am - 6pm",
  "contact_email": "info@demo.com",
  "contact_phone": "+92XXXXXXXXXX",
  "quick_replies": ["Pricing", "Services", "Book Appointment"]
}

This allows one chatbot engine to serve unlimited businesses.

8. Security & Privacy
No login credentials required from clients


No sensitive or regulated data stored in demo


Secure storage rules for leads and chat logs


Industry-neutral compliance-ready structure



Technical Requirements
Frontend: React (widget + admin panel)


AI Engine: Mistral API


Data Storage: Supabase / Firebase / Google Sheets


Deployment:


Hosted on Aykays Assist servers


Client embeds via <script> tag


Scalability:


One core system


Multi-business, multi-industry support


No client-side backend required



Deliverables
Fully functional Universal AI Chatbot widget


Demo deployment on a sample website


Generic multi-industry knowledge base


Lead capture system with secure storage


Demo admin panel


Embed script + deployment documentation


JSON-based configuration template



Notes
Initial release is generic but production-grade


Must be fast, trustworthy, and visually clean


Designed as a white-label AI product


No per-client backend customization


Future-ready for:


Paid plans


CRM integrations


Analytics


Multi-language support

