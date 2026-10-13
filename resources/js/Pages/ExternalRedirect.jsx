import { Head } from '@inertiajs/react';
import { ExternalLink, ArrowRight } from 'lucide-react';

// Centers a sized popup window on the visitor's screen, with browser chrome
// (toolbar/menubar/address bar) stripped — this only ever fires from a real
// click, since browsers silently block window.open() calls that aren't the
// direct result of user interaction.
function openPopup(url) {
    const width = 1200;
    const height = 800;
    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);
    window.open(
        url,
        '_blank',
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`,
    );
}

export default function ExternalRedirect({ member, externalUrl, fallbackUrl }) {
    const firmName = member.firm_name ?? member.name;

    return (
        <>
            <Head title={`Visit ${firmName}`} />

            <div className="storefront-theme flex min-h-screen items-center justify-center bg-surface px-4">
                <div className="w-full max-w-md rounded-[28px] border border-primary/10 bg-white p-8 text-center shadow-[0_24px_60px_rgba(28,28,26,0.1)]">
                    {member.photo_url ? (
                        <img src={member.photo_url} alt={firmName} className="mx-auto h-16 w-16 rounded-2xl object-cover shadow-md" />
                    ) : (
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-extrabold text-white shadow-md">
                            {firmName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <h1 className="mt-5 text-xl font-extrabold text-primary">M/s {firmName}</h1>
                    <p className="mt-2 text-sm leading-relaxed text-primary/60">
                        This business has its own website. Click below to open it in a new window.
                    </p>

                    <button
                        type="button"
                        onClick={() => openPopup(externalUrl)}
                        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open {firmName}'s Website
                    </button>

                    <a
                        href={fallbackUrl}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary/50 hover:text-accent"
                    >
                        View their catalog on UVA instead
                        <ArrowRight className="h-3 w-3" />
                    </a>
                </div>
            </div>
        </>
    );
}
