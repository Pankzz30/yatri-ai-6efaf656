const AuthLogo = () => (
  <div className="flex items-center gap-2.5">
    {/* Minimal plane / spark icon */}
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E11D48] shadow-md shadow-red-200">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    </div>
    <div>
      <span className="text-xl font-bold tracking-tight text-[#111827]">Yatri</span>
      <span className="text-xl font-bold tracking-tight text-[#E11D48]"> AI</span>
    </div>
  </div>
);

export default AuthLogo;
