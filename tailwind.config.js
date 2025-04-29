module.exports = {
  darkMode: 'class', 
  content: [
    './index.html',
    './src/**/*.{html,js}',  
  ],
  theme: {
    extend: {
      colors: {
        primary: '#222',
        accent: '#007bff',
        hoverAccent: '#0056b3',
        lightGray: '#f8f9fa',
        hoverGray: '#444',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        'md-light': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'md-dark': '0 2px 6px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
