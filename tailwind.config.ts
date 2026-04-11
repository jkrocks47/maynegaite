import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				mg: {
					forest: '#1B4332',
					forestLight: '#2D6A4F',
					forestDark: '#143328',
					gold: '#C9A84C',
					goldLight: '#D4B96A',
					goldDark: '#B8860B',
					walnut: '#5C4033',
					ivory: '#FAF7F2',
					parchment: '#F0EBE1',
					stone: '#E8E0D4',
					warmGray: '#8C8278',
					charcoal: '#2D2A26',
					burgundy: '#8B1A1A',
					teal: '#2B6777'
				}
			},
			fontFamily: {
				display: ['Playfair Display', 'Georgia', 'serif'],
				body: ['Inter', 'system-ui', 'sans-serif'],
				ui: ['Lato', 'Inter', 'system-ui', 'sans-serif']
			},
			animation: {
				'reveal-up': 'reveal-up 0.6s ease-out forwards',
				'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
				float: 'float 6s ease-in-out infinite',
				'ken-burns': 'ken-burns 20s ease-in-out infinite',
				shimmer: 'shimmer 3s ease-in-out infinite'
			},
			keyframes: {
				'reveal-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'ken-burns': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)' }
				},
				shimmer: {
					'0%, 100%': { opacity: '0.7' },
					'50%': { opacity: '1' }
				}
			},
			backgroundImage: {
				'section-gradient': 'linear-gradient(180deg, #FAF7F2 0%, #F0EBE1 100%)',
				'hero-overlay':
					'linear-gradient(to bottom, rgba(27,67,50,0.4) 0%, rgba(27,67,50,0.7) 100%)'
			}
		}
	},

	plugins: []
} satisfies Config;
