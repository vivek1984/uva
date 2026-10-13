import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

function PageLink({ href, active, children, ...rest }) {
    const classes = cn(
        'flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent',
        active ? 'bg-primary text-white' : 'text-primary/70 hover:bg-primary/5',
        !href && 'pointer-events-none opacity-30',
    );

    if (!href) {
        return <span className={classes} {...rest}>{children}</span>;
    }

    return (
        <Link href={href} className={classes} preserveScroll {...rest}>
            {children}
        </Link>
    );
}

export default function Pagination({ pagination }) {
    const { currentPage, lastPage, prevPageUrl, nextPageUrl, pageUrls } = pagination;
    if (!lastPage || lastPage <= 1) return null;

    const pages = Array.from({ length: lastPage }, (_, i) => i + 1)
        .filter(p => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1);

    return (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1">
            <PageLink href={prevPageUrl} aria-label="Previous page">
                <ChevronLeft size={16} />
            </PageLink>
            {pages.map((page, i) => (
                <span key={page} className="flex items-center">
                    {i > 0 && pages[i - 1] !== page - 1 && (
                        <span className="px-1.5 text-primary/30">&hellip;</span>
                    )}
                    <PageLink href={pageUrls[page]} active={page === currentPage}>
                        {page}
                    </PageLink>
                </span>
            ))}
            <PageLink href={nextPageUrl} aria-label="Next page">
                <ChevronRight size={16} />
            </PageLink>
        </nav>
    );
}
