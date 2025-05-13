
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
        calm: {
          '50': '#f0f5ff',
          '100': '#e0eafc',
          '200': '#c7d9fa',
          '300': '#a9d2f3',
          '400': '#6ba6dd',
          '500': '#4a85d3',
          '600': '#3068c2',
          '700': '#2855a5',
          '800': '#254587',
          '900': '#213a6e',
        },
        purple: {
          '50': '#f7f4ff',
          '100': '#edebfe',
          '200': '#dcd6fe',
          '300': '#c5b3e6',
          '400': '#9b87f5',
          '500': '#7e69ab',
          '600': '#6e59a5',
          '700': '#5e4a8a',
          '800': '#483a6b',
          '900': '#3a2f59',
        },
        forest: {
          '50': '#f2f7ed',
          '100': '#e3eedb',
          '200': '#c7dfb7',
          '300': '#a2c984',
          '400': '#77ae49',
          '500': '#5b9229',
          '600': '#467520',
          '700': '#385c1d',
          '800': '#2e491c',
          '900': '#273d1a',
        },
        green: {
          '50': '#f0f9f0',
          '100': '#dcf0dc',
          '200': '#bce3bc',
          '300': '#8acd8a',
          '400': '#54b154',
          '500': '#3d923d',
          '600': '#2e722e',
          '700': '#295a29',
          '800': '#244824',
          '900': '#1f3c1f',
        },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-out': {
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          }
        },
        'scale-in': {
          '0%': { 
            transform: 'scale(0.95)',
            opacity: '0'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'slide-in': {
          '0%': { 
            transform: 'translateX(-20px)', 
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)', 
            opacity: '1'
          }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-gentle': 'pulse-gentle 3s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-out': 'fade-out 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out'
			},
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
