export default function Loader({ fullscreen, size = 'md' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-dark-border border-t-primary`} />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-dark flex flex-col items-center justify-center z-50 gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary font-display text-xs tracking-widest">SC</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Cargando...</p>
      </div>
    );
  }

  return spinner;
}
