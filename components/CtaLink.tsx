export function CtaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center gap-1 no-underline hover:opacity-90">
      <span aria-hidden="true" className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </span>
      <span className="inline-flex h-12 items-center rounded-full bg-primary px-7 text-xl font-semibold text-primary-foreground">{children}</span>
    </a>
  );
}
