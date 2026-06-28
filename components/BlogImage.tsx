export type BlogCategory =
  | 'overtime'
  | 'minimum-wage'
  | 'tipped'
  | 'classification'
  | 'paycheck'
  | 'time-off'
  | 'compliance'
  | 'recovery';

const LABELS: Record<BlogCategory, string> = {
  'overtime':       'OVERTIME PAY',
  'minimum-wage':   'MINIMUM WAGE',
  'tipped':         'TIPPED WAGES',
  'classification': 'CLASSIFICATION',
  'paycheck':       'YOUR PAYCHECK',
  'time-off':       'LEAVE & FINAL PAY',
  'compliance':     'COMPLIANCE',
  'recovery':       'WAGE RECOVERY',
};

// All icons center around cx=228, cy=278 within the 456×630 left panel.

function ClockIcon() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="228" cy="278" r="78" stroke="#a6d4c3" strokeWidth="8"/>
      <line x1="228" y1="278" x2="228" y2="218" stroke="#a6d4c3" strokeWidth="11"/>
      <line x1="228" y1="278" x2="284" y2="278" stroke="#a6d4c3" strokeWidth="8"/>
      <circle cx="228" cy="278" r="9" fill="#a6d4c3"/>
      {/* Gold arc: 12 o'clock → 3 o'clock (overtime territory) */}
      <path d="M228,200 A78,78 0 0,1 306,278" stroke="#b08a35" strokeWidth="11"/>
    </g>
  );
}

function BarChartIcon() {
  return (
    <g fill="none" strokeLinecap="round">
      <line x1="165" y1="350" x2="300" y2="350" stroke="#a6d4c3" strokeWidth="7"/>
      <rect x="175" y="295" width="33" height="55" rx="3" stroke="#a6d4c3" strokeWidth="6" fill="#a6d4c3" fillOpacity="0.12"/>
      <rect x="218" y="258" width="33" height="92" rx="3" stroke="#a6d4c3" strokeWidth="6" fill="#a6d4c3" fillOpacity="0.12"/>
      <rect x="261" y="215" width="33" height="135" rx="3" stroke="#b08a35" strokeWidth="6" fill="#b08a35" fillOpacity="0.18"/>
      <text x="278" y="204" fill="#b08a35" fontSize="28" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="bold" stroke="none">$</text>
    </g>
  );
}

function CoinIcon() {
  return (
    <g fill="none" strokeLinecap="round">
      <circle cx="228" cy="260" r="76" stroke="#a6d4c3" strokeWidth="8"/>
      <circle cx="228" cy="260" r="62" stroke="#a6d4c3" strokeWidth="3" strokeOpacity="0.5"/>
      <text x="228" y="285" fill="#b08a35" fontSize="68" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="bold" stroke="none">$</text>
      <ellipse cx="188" cy="348" rx="22" ry="9" stroke="#a6d4c3" strokeWidth="5"/>
      <ellipse cx="228" cy="353" rx="22" ry="9" stroke="#a6d4c3" strokeWidth="5"/>
      <ellipse cx="268" cy="348" rx="22" ry="9" stroke="#a6d4c3" strokeWidth="5"/>
    </g>
  );
}

function ClassificationIcon() {
  return (
    <g fill="none" strokeLinecap="round">
      {/* Employee badge (solid) */}
      <rect x="138" y="215" width="80" height="110" rx="7" stroke="#a6d4c3" strokeWidth="7"/>
      <line x1="152" y1="246" x2="206" y2="246" stroke="#a6d4c3" strokeWidth="5"/>
      <line x1="152" y1="263" x2="198" y2="263" stroke="#a6d4c3" strokeWidth="5"/>
      <line x1="152" y1="280" x2="206" y2="280" stroke="#a6d4c3" strokeWidth="5"/>
      <text x="178" y="314" fill="#a6d4c3" fontSize="15" textAnchor="middle" fontFamily="monospace" stroke="none" letterSpacing="1">W-2</text>
      {/* Dividing line */}
      <line x1="228" y1="210" x2="228" y2="360" stroke="#b08a35" strokeWidth="3" strokeDasharray="8,5"/>
      {/* Contractor form (dashed outline) */}
      <rect x="238" y="215" width="80" height="110" rx="7" stroke="#a6d4c3" strokeWidth="7" strokeDasharray="11,7"/>
      <line x1="252" y1="246" x2="306" y2="246" stroke="#a6d4c3" strokeWidth="5" strokeDasharray="8,5"/>
      <line x1="252" y1="263" x2="298" y2="263" stroke="#a6d4c3" strokeWidth="5" strokeDasharray="8,5"/>
      <line x1="252" y1="280" x2="306" y2="280" stroke="#a6d4c3" strokeWidth="5" strokeDasharray="8,5"/>
      <text x="278" y="314" fill="#b08a35" fontSize="15" textAnchor="middle" fontFamily="monospace" stroke="none" letterSpacing="1">1099</text>
    </g>
  );
}

function PaycheckIcon() {
  return (
    <g fill="none" strokeLinecap="round">
      <rect x="158" y="200" width="140" height="175" rx="7" stroke="#a6d4c3" strokeWidth="7"/>
      {/* Header bar */}
      <rect x="158" y="200" width="140" height="34" rx="7" fill="#b08a35" fillOpacity="0.5" stroke="none"/>
      <rect x="158" y="222" width="140" height="12" fill="#b08a35" fillOpacity="0.5" stroke="none"/>
      {/* Row lines */}
      <line x1="174" y1="255" x2="282" y2="255" stroke="#a6d4c3" strokeWidth="5"/>
      <line x1="174" y1="272" x2="266" y2="272" stroke="#a6d4c3" strokeWidth="5"/>
      <line x1="174" y1="289" x2="282" y2="289" stroke="#a6d4c3" strokeWidth="5"/>
      <line x1="174" y1="306" x2="260" y2="306" stroke="#a6d4c3" strokeWidth="5"/>
      {/* Total lines (gold) */}
      <line x1="174" y1="330" x2="282" y2="330" stroke="#b08a35" strokeWidth="7"/>
      <line x1="174" y1="343" x2="282" y2="343" stroke="#b08a35" strokeWidth="4"/>
    </g>
  );
}

function CalendarIcon() {
  const DOT_COLS = [178, 213, 248, 283];
  const DOT_ROWS = [265, 293, 321];
  return (
    <g fill="none" strokeLinecap="round">
      <rect x="152" y="205" width="152" height="148" rx="9" stroke="#a6d4c3" strokeWidth="7"/>
      <rect x="152" y="205" width="152" height="40" rx="9" fill="#a6d4c3" fillOpacity="0.18" stroke="none"/>
      <line x1="152" y1="245" x2="304" y2="245" stroke="#a6d4c3" strokeWidth="5"/>
      <line x1="186" y1="196" x2="186" y2="218" stroke="#a6d4c3" strokeWidth="8"/>
      <line x1="270" y1="196" x2="270" y2="218" stroke="#a6d4c3" strokeWidth="8"/>
      {DOT_COLS.map((cx, c) =>
        DOT_ROWS.map((cy, r) => {
          const isX = c === 1 && r === 0;
          return isX ? null : (
            <circle key={`${c}-${r}`} cx={cx} cy={cy} r="6" fill="#a6d4c3" fillOpacity="0.55" stroke="none"/>
          );
        })
      )}
      {/* Highlighted day */}
      <line x1="205" y1="255" x2="221" y2="277" stroke="#b08a35" strokeWidth="8"/>
      <line x1="221" y1="255" x2="205" y2="277" stroke="#b08a35" strokeWidth="8"/>
    </g>
  );
}

function ShieldIcon() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M228,198 L304,228 L304,292 Q304,352 228,372 Q152,352 152,292 L152,228 Z" stroke="#a6d4c3" strokeWidth="8"/>
      <path d="M191,282 L215,310 L268,250" stroke="#b08a35" strokeWidth="13"/>
    </g>
  );
}

function ScalesIcon() {
  return (
    <g fill="none" strokeLinecap="round">
      {/* Staff */}
      <line x1="228" y1="198" x2="228" y2="348" stroke="#a6d4c3" strokeWidth="8"/>
      <circle cx="228" cy="198" r="10" fill="#a6d4c3"/>
      {/* Beam */}
      <line x1="150" y1="230" x2="306" y2="230" stroke="#a6d4c3" strokeWidth="8"/>
      {/* Left pan strings */}
      <line x1="162" y1="230" x2="150" y2="280" stroke="#a6d4c3" strokeWidth="5"/>
      <line x1="178" y1="230" x2="166" y2="280" stroke="#a6d4c3" strokeWidth="5"/>
      {/* Left pan */}
      <path d="M141,280 Q158,304 175,280" stroke="#a6d4c3" strokeWidth="7"/>
      {/* Right pan strings (gold — recovery pan tips down) */}
      <line x1="294" y1="230" x2="282" y2="256" stroke="#b08a35" strokeWidth="5"/>
      <line x1="310" y1="230" x2="298" y2="256" stroke="#b08a35" strokeWidth="5"/>
      {/* Right pan (gold) */}
      <path d="M273,256 Q290,280 307,256" stroke="#b08a35" strokeWidth="7"/>
      {/* Base */}
      <line x1="198" y1="348" x2="258" y2="348" stroke="#a6d4c3" strokeWidth="8"/>
    </g>
  );
}

const ICONS: Record<BlogCategory, React.ReactNode> = {
  'overtime':       <ClockIcon />,
  'minimum-wage':   <BarChartIcon />,
  'tipped':         <CoinIcon />,
  'classification': <ClassificationIcon />,
  'paycheck':       <PaycheckIcon />,
  'time-off':       <CalendarIcon />,
  'compliance':     <ShieldIcon />,
  'recovery':       <ScalesIcon />,
};

interface BlogImageProps {
  category: BlogCategory;
  className?: string;
  /** "xMidYMid slice" for thumbnail crop-fill; default "xMidYMid meet" for hero */
  preserveAspectRatio?: string;
}

export function BlogImage({ category, className = '', preserveAspectRatio = 'xMidYMid meet' }: BlogImageProps) {
  return (
    <svg
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      aria-hidden="true"
    >
      {/* Paper background */}
      <rect width="1200" height="630" fill="#f6f3ec"/>
      {/* Faint horizontal ledger lines on paper side */}
      {Array.from({ length: 23 }, (_, i) => (
        <line key={i} x1="462" y1={i * 28} x2="1200" y2={i * 28}
          stroke="#16201b" strokeWidth="0.5" opacity="0.06"/>
      ))}
      {/* Forest green left panel */}
      <rect width="456" height="630" fill="#0f241b"/>
      {/* Gold separator */}
      <rect x="456" width="6" height="630" fill="#b08a35"/>
      {/* Faint ledger lines on green panel */}
      {Array.from({ length: 23 }, (_, i) => (
        <line key={i} x1="0" y1={i * 28} x2="456" y2={i * 28}
          stroke="#ffffff" strokeWidth="0.5" opacity="0.05"/>
      ))}
      {/* Category icon */}
      {ICONS[category]}
      {/* Category label */}
      <text
        x="228" y="408"
        fontFamily="Georgia, serif"
        fontSize="15"
        fill="#71b8a0"
        textAnchor="middle"
        letterSpacing="3.5"
      >
        {LABELS[category]}
      </text>
      {/* Right-side accent: two faint column rules */}
      <line x1="896" y1="0" x2="896" y2="630" stroke="#16201b" strokeWidth="0.5" opacity="0.12"/>
      <line x1="1064" y1="0" x2="1064" y2="630" stroke="#16201b" strokeWidth="0.5" opacity="0.12"/>
      {/* Watermark */}
      <text x="815" y="601" fontFamily="Georgia, serif" fontSize="13" fill="#16201b"
        textAnchor="middle" opacity="0.18" letterSpacing="4">
        WAGECOACH
      </text>
    </svg>
  );
}
