import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M18.7 8a6 6 0 0 0-8.4-8.4" />
      <path d="M14.5 12.5a6 6 0 0 1-8.4-8.4" />
    </svg>
  );
}

export function UnfpaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="20" cy="20" r="20" fill="#F1F1F1"/>
        <path d="M20.5 25.5C23.2614 25.5 25.5 23.2614 25.5 20.5C25.5 17.7386 23.2614 15.5 20.5 15.5C17.7386 15.5 15.5 17.7386 15.5 20.5C15.5 23.2614 17.7386 25.5 20.5 25.5Z" stroke="#E86223" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20.5 12V13" stroke="#E86223" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20.5 28V29" stroke="#E86223" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24.56 16.44L23.85 17.15" stroke="#E86223" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.15 23.85L16.44 24.56" stroke="#E86223" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 20.5H29" stroke="#E86223" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 20.5H13" stroke="#E86223" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24.56 24.56L23.85 23.85" stroke="#E86223" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.15 17.15L16.44 16.44" stroke="#E86223" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function QuantumPlusLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg height="25" viewBox="0 0 135 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <text fill="#2D3748" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Arial" fontSize="16" fontWeight="bold" letterSpacing="0em"><tspan x="0" y="19.232">QUANTUM </tspan></text>
            <text fill="#E86223" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Arial" fontSize="16" fontWeight="bold" letterSpacing="0em"><tspan x="88.0156" y="19.232">PLUS</tspan></text>
        </svg>
    )
}
