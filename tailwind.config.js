/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontSize: {
        'base': ['1rem', '1.5rem'],      // 16px with 24px line height
        'lg': ['1.125rem', '1.75rem'],   // 18px with 28px line height
        'xl': ['1.25rem', '1.875rem'],   // 20px with 30px line height
        '2xl': ['1.5rem', '2rem'],       // 24px with 32px line height
      },
    },
  },
  plugins: [],
} 