// Renders an ISO-3166 alpha-2 country code as a flag emoji + the
// code itself. Emoji renders correctly on macOS / iOS / Android;
// Windows falls back to the letter pair (acceptable for admin UI).
// Lives next to the consent table because that's the only surface
// that needs it today — promote to a shared util when feedback /
// races adopt the same treatment.

function flagEmoji(iso: string): string | null {
  if (!iso || iso.length !== 2 || !/^[A-Za-z]{2}$/.test(iso)) {
    return null;
  }
  const codePoints = iso
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

interface CountryCellProps {
  iso: string | null;
}

export function CountryCell({ iso }: CountryCellProps) {
  if (!iso) {
    return <span style={{ color: "var(--ds-gray-700)" }}>—</span>;
  }
  const flag = flagEmoji(iso);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      {flag && (
        <span aria-hidden="true" style={{ fontSize: "1.05em" }}>
          {flag}
        </span>
      )}
      <span>{iso.toUpperCase()}</span>
    </span>
  );
}
