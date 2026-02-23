import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    light: "var(--color-primary-light)",
                    dark: "var(--color-primary-dark)",
                },
                success: "var(--color-success)",
                warning: "var(--color-warning)",
                danger: "var(--color-danger)",
                surface: "var(--color-surface)",
                muted: "var(--color-muted)",
                border: "var(--color-border)",
                "card-bg": "var(--color-card-bg)",
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
                display: ["var(--font-display)"],
            },
            borderRadius: {
                card: "var(--radius-card)",
            },
            boxShadow: {
                soft: "var(--shadow-soft)",
                premium: "var(--shadow-premium)",
            },
            keyframes: {
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-in-up": "fade-in-up 0.6s ease-out forwards",
            },
        },
    },
    plugins: [],
};

export default config;
