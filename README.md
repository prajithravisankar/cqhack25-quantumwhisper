# QuantumWhisper [🎥 Watch Demo Video](https://www.youtube.com/watch?v=-WGL136hOX8)


🔐 **A quantum cryptography demonstration app featuring secure key exchange and encrypted messaging**

## deployment link: https://cqhack25-quantumwhisper.vercel.app/

<!-- [![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://your-app-url.vercel.app)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb)](https://reactjs.org/)
[![Powered by Vite](https://img.shields.io/badge/Powered%20by-Vite-646cff)](https://vitejs.dev/) -->

## 🌟 Features

- **🔑 Quantum Key Exchange**: Generate and share quantum keys via audio file download/upload (WAV files)
- **🔒 Secure Messaging**: Encrypt and decrypt messages with quantum-derived AES-256 keys
- **📱 Modern UI**: Clean, professional design with responsive layout
- **📁 File-Based Transmission**: Audio key exchange through downloadable WAV files
- **📋 Copy/Paste Workflow**: Alternative key sharing and message exchange via clipboard
- **🛡️ Enterprise Security**: AES-256 encryption with unique initialization vectors
- **🌐 Cross-Platform**: Works on desktop and mobile browsers without microphone requirements

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern web browser
- File download/upload capability

### Installation

```bash
# Clone the repository
git clone https://github.com/prajithravisankar/cqhack25-quantumwhisper.git

# Navigate to project directory
cd quantumwhisper

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Start development server with HTTPS
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 🎯 How to Use

### Step 1: Quantum Key Exchange

1. **Navigate to Key Exchange page**
2. **Alice (Step 1 - Key Generator)**:
   - Click "Generate Quantum Key"
   - Click "Download Audio File" to save the quantum key as a WAV file
   - OR use "Copy Key" for manual sharing via copy/paste
3. **Bob (Step 2 - Key Receiver)**:
   - Click "Upload Audio File" and select the received WAV file
   - OR use "Paste Key" to input the copied quantum key
   - Verify key reception and matching status

### Step 2: Secure Messaging

1. **Navigate to Messaging page**
2. **Message Sender**:
   - Type your secret message
   - Click "Encrypt Message"
   - Copy the encrypted text
3. **Message Receiver**:
   - Paste the encrypted message
   - Click "Decrypt Message"
   - View the decrypted content

## 🏗️ Project Structure

```
quantumwhisper/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── AudioCommunication/
│   │   ├── Common/
│   │   ├── Layout/
│   │   ├── MessageTransmission/
│   │   └── QuantumKeyExchange/
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Main application pages
│   ├── utils/               # Utility functions
│   └── App.jsx              # Main application component
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router DOM
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 7
- **Audio Processing**: ggwave library
- **Encryption**: CryptoJS (AES-256)
- **Testing**: Vitest
- **Deployment**: Vercel

## 🔐 Security Features

- **AES-256 Encryption**: Industry-standard encryption algorithm
- **Quantum Key Distribution**: Simulated quantum key exchange protocol
- **Unique Initialization Vectors**: Each message uses a unique IV
- **Tamper-Proof Key Distribution**: Audio-based transmission with integrity checks
- **Client-Side Processing**: All encryption/decryption happens locally

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub account to Vercel
3. Import your repository
4. Deploy with these settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`


## 🔧 Configuration

### Environment Variables

No environment variables required for basic operation. The app works out of the box.


## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 💡 Inspiration

This project demonstrates quantum cryptography concepts in an accessible web application, making complex security protocols understandable through interactive visualization. The project is inspired from gibberlink project developed in the levenlabs hackathon.


## 🏆 Acknowledgments

- Built for CQHack25 Hackathon: https://cqhack25.devpost.com/project-gallery
- Inspired by quantum cryptography research
- Uses open-source libraries and tools

---

**Made with ❤️ for CQHack25 hackathon**
