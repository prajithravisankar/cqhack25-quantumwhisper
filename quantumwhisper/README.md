# 🎃 QuantumWhisper - Halloween Edition

A spooky quantum cryptography demonstration app featuring file-based quantum key exchange and secure messaging with a dark Halloween theme.

## 🌟 Features

- **File-Based Quantum Key Exchange**: Generate and share quantum keys via WAV file download/upload
- **Secure Message Encryption**: Copy/paste encrypted messages using quantum-derived keys
- **Halloween Dark Theme**: Spooky orange and black design with glowing effects
- **Multi-Page Navigation**: Separate pages for key exchange and messaging
- **Responsive Design**: Works on desktop and mobile devices
- **No Audio Transmission**: Pure file-based workflow for maximum compatibility

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Open https://localhost:4173
```

### Deployment

```bash
# Build the app
npm run build

# Deploy the dist/ folder to your hosting service
# Compatible with Vercel, Netlify, GitHub Pages, etc.
```

## 🎯 How to Use

### Step 1: Quantum Key Exchange

1. **Alice (Key Generator)**:
   - Go to the "Key Exchange" page
   - Click "Generate Quantum Key"
   - Download the generated WAV file
   - Share the WAV file with Bob via any method

2. **Bob (Key Receiver)**:
   - Go to the "Key Exchange" page
   - Click "Receive Quantum Key"
   - Upload the WAV file from Alice
   - The quantum key will be automatically decoded

### Step 2: Secure Messaging

1. **Sender**:
   - Go to the "Messaging" page
   - Enter your message
   - Paste the quantum key from Step 1
   - Click "Encrypt Message"
   - Copy the encrypted message and share it

2. **Receiver**:
   - Go to the "Messaging" page
   - Paste the encrypted message
   - Paste the quantum key from Step 1
   - Click "Decrypt Message"
   - Read the decrypted message

## 🔧 Technical Details

### Architecture

- **Frontend**: React 19 with Vite
- **Routing**: React Router v7
- **Styling**: Custom CSS with CSS variables
- **Audio Processing**: GGWave for encoding/decoding
- **Encryption**: AES-256 via CryptoJS
- **File Handling**: Web File API

### Key Components

- `KeyGenerator`: Creates quantum keys and encodes them into WAV files
- `KeyReceiver`: Uploads and decodes WAV files to extract quantum keys
- `MessageSender`: Encrypts messages using quantum keys
- `MessageReceiver`: Decrypts messages using quantum keys

### Security Features

- 256-character quantum key generation
- AES-256 encryption for messages
- No network transmission of keys or messages
- Manual copy/paste workflow for maximum security

## 🎨 Theme Customization

The Halloween theme uses CSS variables for easy customization:

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --accent-orange: #ff6b35;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
}
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Common/          # Reusable UI components
│   ├── Layout/          # Navigation and footer
│   ├── MessageTransmission/  # Messaging components
│   └── QuantumKeyExchange/   # Key exchange components
├── pages/               # Main application pages
├── utils/               # Utility functions
└── index.css           # Global styles and theme
```

## 🌐 Deployment Options

### Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### Self-Hosted
```bash
npm run build
# Serve dist/ folder with any static file server
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Dependencies

- **React 19**: Modern React with concurrent features
- **React Router v7**: Client-side routing
- **GGWave**: Audio encoding/decoding library
- **CryptoJS**: Cryptographic functions
- **Vite**: Fast build tool and dev server

## 🎃 Halloween Theme Features

- Dark gradient backgrounds with orange accents
- Glowing button effects on hover
- Flickering text animations
- Spooky card designs with subtle borders
- Orange progress indicators and status badges
- Responsive design with mobile-first approach

## 📖 Documentation

- [`FILE_WORKFLOW_GUIDE.md`](./FILE_WORKFLOW_GUIDE.md) - Detailed file workflow documentation
- [`SIMPLIFIED_MESSAGE_EXCHANGE.md`](./SIMPLIFIED_MESSAGE_EXCHANGE.md) - Message exchange guide
- [`HALLOWEEN_MULTIPAGE_GUIDE.md`](./HALLOWEEN_MULTIPAGE_GUIDE.md) - Theme and navigation guide

## 🔮 Future Enhancements

- Additional quantum key algorithms
- Batch message encryption/decryption
- Key expiration and rotation
- Enhanced mobile experience
- More Halloween animations and effects

## 📄 License

MIT License - feel free to use this project for educational and demonstration purposes.

---

Built with 💀 for CQHack25 - Where quantum meets spooky! 🎃
