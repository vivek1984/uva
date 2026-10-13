import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer(
    (page) =>
        createInertiaApp({
            page,
            render: ReactDOMServer.renderToString,
            title: (title) => `${title} - ${appName}`,
            resolve: (name) =>
                resolvePageComponent(
                    `./Pages/${name}.jsx`,
                    import.meta.glob('./Pages/**/*.jsx'),
                ),
            setup: ({ App, props }) => {
                global.route = (name, params, absolute) =>
                    route(name, params, absolute, {
                        ...page.props.ziggy,
                        location: new URL(page.props.ziggy.location),
                    });

                return <App {...props} />;
            },
        }),
    // Configurable so multiple Inertia apps on the same host (each defaulting
    // to port 13714) don't collide — set SSR_PORT when starting this process.
    process.env.SSR_PORT ? Number(process.env.SSR_PORT) : 13714,
);
