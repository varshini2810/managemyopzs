/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === ManageMyMarketing Tokens ===
        primary: { DEFAULT: '#586EF0', hover: '#7084F4' },
        danger: { DEFAULT: '#EF4444' },
        gray: { border: '#E5E7EB', divider: '#D9DBE1', placeholder: '#9CA3AF' },
        status: {
          campaigns: '#10B981',
          success: '#10B981',
          expenses: '#F59E0B',
          warning: '#F59E0B',
          approvals: '#A855F7',
          creative: '#A855F7',
          information: '#3B82F6',
          general: '#3B82F6'
        },

        // === Core Brand Palette ===
        bg: { main: '#F4F7FA' },          // warm off-white app background
        surface: '#FFFFFF',     // card/panel surface
        border: '#E7E5E2',      // hairline 1px border
        'border-strong': '#D4D1CE',

        // Text
        ink: '#1C1B1A',         // primary text
        muted: '#6B6863',       // secondary text
        subtle: '#A8A49F',      // placeholder, tertiary

        // Accent (used SPARINGLY — primary actions only)
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
          muted: '#C7D2FE',
        },

        // Semantic
        success: {
          DEFAULT: '#1A7F4E',
          light: '#EDFAF3',
          muted: '#6EBD97',
        },
        warning: {
          DEFAULT: '#B45309',
          light: '#FEF3C7',
          muted: '#D97706',
        },
        danger: {
          DEFAULT: '#C0292B',
          light: '#FEF2F2',
          muted: '#E57373',
        },

        // Sidebar
        sidebar: {
          bg: '#14130F',
          border: '#2A2620',
          hover: '#1E1C17',
          active: '#252219',
          text: '#A8A49F',
          textActive: '#FFFFFF',
          groupLabel: '#57534E',
        },

        // Neutral grays (warm-tinted)
        stone: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E2',
          300: '#D4D1CE',
          400: '#A8A49F',
          500: '#79756E',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1B1A',
        },
      },

      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },

            fontSize: {
        'xxs': '8px',
        'xs': '9px',
        'xs-role': '10px',
        'sm': '11px',
        'sm-title': '12px',
        'base': '13px',
        'lg': '15px',
        'xl': '17px',
        '2xl': '21px',
        '3xl': '33px',
        '4xl': '35px',
      },

      borderRadius: {
        'input': '10px',
        'button': '10px', 'btn': '10px', 'form': '10px',
        'card': '14px',

        none: '0',
        sm:   '4px',
        DEFAULT: '6px',   // buttons, inputs, chips
        md:   '6px',
        lg:   '8px',
        xl:   '12px',     // soft cards
        '2xl': '16px',    // very soft cards
        full: '9999px',
      },

      boxShadow: {
        'card': '0 2px 10px rgba(15, 23, 42, 0.08)',

        none: 'none',
        sm:   '0 1px 2px rgba(28,27,26,0.05)',  // Flat cards, very subtle
        DEFAULT: '0 2px 4px rgba(28,27,26,0.06), 0 1px 2px rgba(28,27,26,0.04)', // Raised cards, inputs
        md:   '0 4px 8px rgba(28,27,26,0.08), 0 2px 4px rgba(28,27,26,0.04)', // Floating menus, popovers
        lg:   '0 10px 15px rgba(28,27,26,0.1), 0 4px 6px rgba(28,27,26,0.05)', // Modals
        tooltip: '0 2px 8px rgba(28,27,26,0.12)',
        'focus-accent': '0 0 0 3px rgba(79, 70, 229, 0.2)', // Accessible focus ring
        'focus-danger': '0 0 0 3px rgba(192, 41, 43, 0.2)',
      },

      spacing: {
        '13': '52px',
        '15': '60px',
        '18': '72px',
      },

      transitionDuration: {
        '100': '100ms',
      },

      animation: {
        'slide-in-right': 'slideInRight 0.2s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-top':   'slideInTop 0.18s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':        'fadeIn 0.15s ease-out',
        'skeleton-pulse':  'skeletonPulse 1.5s ease-in-out infinite',
      },

      keyframes: {
        slideInRight: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInTop: {
          '0%':   { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
