# Problem 2: Fancy Form - Currency Swap

A beautiful and intuitive currency swap form built with **React**, **TypeScript**, and **Vite**.

## ✨ Features

### Core Functionality

- **Currency Selection**: Choose from 6 popular cryptocurrencies (BTC, ETH, USDT, USDC, BNB, SOL)
- **Real-time Exchange Rate Calculation**: Automatic conversion based on mock token prices
- **Token Swap**: Quick swap between "from" and "to" currencies with smooth animation
- **Form Validation**: Input validation with clear error messages
- **Loading States**: Visual feedback during swap operations (2-second simulated delay)

### User Experience

- **Intuitive Interface**: Clean, modern design with visual hierarchy
- **Real-time Feedback**:
  - Live USD value display for both amounts
  - Exchange rate information
  - Input validation messages
- **Smooth Animations**:
  - Rotating icon when swapping currencies
  - Button hover effects
  - Loading spinner during submission
- **Accessibility**:
  - Proper labels and ARIA attributes
  - Keyboard navigation support
  - Disabled states for loading operations

### Visual Design

- **Modern UI**: Gradient background with glassmorphism effect
- **Token Icons**: SVG icons from cryptocurrency-icons repository
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Adapts to system preference
- **Color Palette**: Purple/violet gradient theme

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Implementation Details

### Technologies Used

- **React 19** with TypeScript for type safety
- **Vite** for fast development and optimized builds (bonus points!)
- **CSS3** with modern features (gradients, backdrop-filter, animations)
- **No external UI libraries** - pure custom implementation

### Mock Data

- Token prices are hardcoded for demonstration
- Exchange rates calculated from price ratios
- API calls simulated with `setTimeout`

### Token Price API (Mock)

```typescript
const tokens = [
  { symbol: "ETH", price: 2500.0 },
  { symbol: "BTC", price: 45000.0 },
  { symbol: "USDT", price: 1.0 },
  // ... etc
];
```

### Validation Rules

- Amount must be a valid number
- Amount must be greater than 0
- Cannot swap the same currency
- All fields required before submission

## 📁 Project Structure

```
problem2/
├── src/
│   ├── App.tsx          # Main swap component
│   ├── App.css          # Component styles
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
└── README.md           # This file
```

## 🎨 Design Decisions

1. **Glassmorphism**: Used semi-transparent backgrounds with backdrop blur for modern aesthetic
2. **Visual Hierarchy**: Clear separation between input sections, swap button, and submit button
3. **Color Psychology**: Purple gradient conveys trust and innovation (common in fintech)
4. **Micro-interactions**: Hover effects, loading states, and animations provide feedback
5. **Responsive Typography**: Scales appropriately on different screen sizes

## 🔒 Security Note

This is a frontend demo with mock data. In a production environment, you would:

- Validate inputs server-side
- Use real API for token prices
- Implement proper authentication
- Add slippage protection
- Include transaction confirmation

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Meeting Requirements

✅ Currency swap form functionality  
✅ Intuitive usage  
✅ Visually attractive design  
✅ Input validation and error messages  
✅ Mock backend interactions with loading states  
✅ Token images from SVG repository  
✅ Exchange rate calculation based on prices  
✅ **Bonus**: Built with Vite

---

**Duration**: Implementation completed within estimated timeframe
**Focus**: Frontend development skills, UX design, and attention to detail
