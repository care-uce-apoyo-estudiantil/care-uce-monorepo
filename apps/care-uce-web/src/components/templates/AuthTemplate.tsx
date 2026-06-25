export const AuthTemplate = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
    {/* Contenedor con sombra suave y bordes redondeados */}
    <div className="w-full max-w-md">{children}</div>
  </div>
);
