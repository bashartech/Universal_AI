# Universal AI Chatbot

A fully functional, embeddable AI chatbot solution that can be deployed on any website or digital platform. Built with React, TypeScript, Tailwind CSS, Firebase, and Mistral AI.

## 🌐 Live Demo

**[View Live Demo](https://universal-ai-roan.vercel.app/)**

Experience the chatbot in action with a fully functional demo deployment.

## 🚀 Features

- **AI-Powered Conversations**: Uses Mistral AI for intelligent, context-aware responses
- **Lead Capture System**: Automatically captures and stores customer information
- **Human Escalation**: Seamlessly escalates complex queries to human representatives
- **Email Notifications**: Real-time notifications via EmailJS
- **Admin Dashboard**: Comprehensive panel to manage conversations, leads, and escalations
- **Multi-Platform Support**: Works on WordPress, Wix, Webflow, Shopify, and custom sites
- **Mobile Responsive**: Optimized for all devices
- **Easy Configuration**: JSON-based configuration for quick customization

## 📋 Prerequisites

- Node.js (v18 or higher)
- Firebase account
- Mistral AI API key
- EmailJS account

## 🛠️ Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**

The `.env` file is already configured with:
- Mistral AI API key
- EmailJS credentials
- Firebase credentials

3. **Configure your business details**

Edit `src/config/businessConfig.json` to customize for your business.

## 🚀 Development

### Run Demo Site
```bash
npm run dev
```
Opens the demo page at `http://localhost:5173/demo.html`

### Run Admin Panel
```bash
npm run dev:admin
```
Opens the admin panel at `http://localhost:5173/admin.html`

**Default Admin Credentials:**
- Username: `admin`
- Password: `demo123`

## 📦 Build for Production

### Build Everything
```bash
npm run build
```

### Build Widget Only
```bash
npm run build:widget
```
Output: `dist/widget/chatbot.js`

### Build Admin Panel Only
```bash
npm run build:admin
```
Output: `dist/admin/`

## 🌐 Deployment

### Widget Deployment

1. Build the widget:
```bash
npm run build:widget
```

2. Upload `dist/widget/chatbot.js` to your CDN or hosting

3. Add to any website:
```html
<!-- Universal AI Chatbot - Embed Code -->
<script src="https://universal-ai-roan.vercel.app/chatbot.js"></script>
```

**For custom deployment**, replace the URL with your own hosting:
```html
<script src="https://your-domain.com/chatbot.js"></script>
```

## 📱 Platform-Specific Integration

### WordPress
Add the embed code to `footer.php` before `</body>`

### Wix
Settings → Custom Code → Add the embed code

### Shopify
Edit `theme.liquid` and add before `</body>`

### Webflow
Project Settings → Custom Code → Footer Code

## 🗂️ Project Structure

```
src/
├── components/          # UI components
├── services/           # API integrations
├── store/              # State management
├── types/              # TypeScript types
├── utils/              # Utilities
├── config/             # Configuration
├── embed/              # Widget embed
└── admin/              # Admin panel
```

## 📊 Admin Panel Features

- **Dashboard**: Overview of conversations, leads, and escalations
- **Conversations**: View all chat transcripts
- **Leads**: Manage captured leads
- **Escalations**: Handle human requests

## 🔐 Security

- Environment variables for sensitive data
- Firebase security rules
- Input validation

## 📝 Technologies

- React 19
- TypeScript
- Tailwind CSS 4
- Firebase Firestore
- Mistral AI
- EmailJS
- Zustand (State Management)
- React Router

---

Built with ❤️ for Aykays Assist
