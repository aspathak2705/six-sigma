export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl text-white">{title}</h1>
        {subtitle && <p className="text-subtle font-body mt-1.5 text-sm">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}
