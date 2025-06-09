/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Tema cusqueño personalizado
				primary: {
					50: '#FEF7ED',
					100: '#FDEDD3',
					200: '#FAD7A6',
					300: '#F6BC6E',
					400: '#F1974E',
					500: '#EB7014', // Naranja terracota principal
					600: '#DC5F0B',
					700: '#B7460C',
					800: '#943912',
					900: '#792F12',
					DEFAULT: '#EB7014',
					foreground: '#FFFFFF',
				},
				secondary: {
					50: '#FDF2F8',
					100: '#FCE7F3',
					200: '#FBCFE8',
					300: '#F9A8D4',
					400: '#F472B6',
					500: '#EC4899', // Rosa andino
					600: '#DB2777',
					700: '#BE185D',
					800: '#9D174D',
					900: '#831843',
					DEFAULT: '#EC4899',
					foreground: '#FFFFFF',
				},
				accent: {
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#F59E0B', // Oro inca
					600: '#D97706',
					700: '#B45309',
					800: '#92400E',
					900: '#78350F',
					DEFAULT: '#F59E0B',
					foreground: '#1C1917',
				},
				// Colores del sistema
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			fontFamily: {
				'display': ['Playfair Display', 'serif'],
				'body': ['Inter', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fadeInUp': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
					},
				},
				'fadeInScale': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)',
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)',
					},
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'slideInRight': {
					'0%': {
						transform: 'translateX(100%)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
				'fadeInScale': 'fadeInScale 0.4s ease-out forwards',
				'float': 'float 3s ease-in-out infinite',
				'slideInRight': 'slideInRight 0.3s ease-out forwards',
			},
			boxShadow: {
				'andino': '0 4px 6px -1px rgba(235, 112, 20, 0.1), 0 2px 4px -1px rgba(235, 112, 20, 0.06)',
				'oro': '0 4px 6px -1px rgba(245, 158, 11, 0.1), 0 2px 4px -1px rgba(245, 158, 11, 0.06)',
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),
		function({ addUtilities }) {
			const newUtilities = {
				'.line-clamp-2': {
					display: '-webkit-box',
					'-webkit-line-clamp': '2',
					'-webkit-box-orient': 'vertical',
					overflow: 'hidden',
				},
				'.line-clamp-3': {
					display: '-webkit-box',
					'-webkit-line-clamp': '3',
					'-webkit-box-orient': 'vertical',
					overflow: 'hidden',
				},
			}
			addUtilities(newUtilities)
		}
	],
}