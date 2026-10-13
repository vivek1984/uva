import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

// Used only by the public storefront pages (BusinessPage/ProductPage), whose
// CSS variables are scoped to a `.storefront-theme` wrapper in app.css — not
// `:root` — so these new color names never affect any other page.
function withOpacity(variableName) {
    return ({ opacityValue }) =>
        opacityValue === undefined
            ? `rgb(var(${variableName}))`
            : `rgb(var(${variableName}) / ${opacityValue})`;
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: withOpacity('--color-primary'),
                accent: withOpacity('--color-accent'),
                surface: withOpacity('--color-surface'),
            },
        },
    },

    plugins: [forms],
};
