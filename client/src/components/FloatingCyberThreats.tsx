interface FloatingCyberThreatsProps {
  variant?: "red" | "purple" | "cyan" | "mixed";
  density?: "low" | "medium" | "high";
  className?: string;
}

const threatData = {
  hexCodes: [
    "0x7F 45 4C 46", "0xDEADBEEF", "0xCAFEBABE", "0xFF 0D 0A",
    "0x90909090", "0xCC CC CC", "0x48 8B 05", "0xE8 00 00 00",
  ],
  binary: [
    "01101000 01100001", "11010011 10110001", "01010101 01001000",
    "10001011 11100101", "01001000 10000011", "11111111 00001111",
  ],
  errors: [
    "ERR_CONNECTION_REFUSED", "SEGFAULT_0x0", "STACK_OVERFLOW",
    "HEAP_CORRUPTION", "NULL_PTR_DEREF", "BUFFER_OVERFLOW",
    "RACE_CONDITION", "MEM_LEAK_CRITICAL",
  ],
  threats: [
    "TROJAN.GEN.2", "W32.MALWARE", "ROOTKIT_DETECTED",
    "KEYLOGGER_v3.1", "EXPLOIT_KIT_α", "RAT_BACKDOOR",
    "CRYPTOMINER_XMR", "PHISHING_URL",
  ],
  hardware: [
    "SSD::CORRUPT", "RAM::0xFF", "CPU::OVERHEAT",
    "NIC::COMPROMISED", "GPU::OVERFLOW", "BIOS::TAMPERED",
  ],
  network: [
    "192.168.█.█", "10.0.0.██", "PORT:443▶OPEN",
    "DNS::POISONED", "ARP::SPOOFED", "TCP::RST",
    "ICMP::FLOOD", "SSH::BRUTE",
  ],
};

const allItems = [
  ...threatData.hexCodes,
  ...threatData.binary,
  ...threatData.errors,
  ...threatData.threats,
  ...threatData.hardware,
  ...threatData.network,
];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

export function FloatingCyberThreats({ 
  variant = "cyan", 
  density = "medium",
  className = "" 
}: FloatingCyberThreatsProps) {
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobileView 
    ? (density === "low" ? 3 : density === "medium" ? 5 : 8)
    : (density === "low" ? 6 : density === "medium" ? 10 : 16);
  const items = allItems.slice(0, count);

  const getColor = (index: number) => {
    if (variant === "red") return `rgba(255, ${60 + index * 5}, ${30 + index * 3}, 0.12)`;
    if (variant === "purple" || variant === "cyan") return `rgba(61, 112, 183, 0.12)`;
    return index % 2 === 0 
      ? `rgba(61, 112, 183, 0.12)` 
      : `rgba(255, ${60 + index * 5}, ${30 + index * 3}, 0.08)`;
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {items.map((text, i) => {
        const startX = seededRandom(i * 7 + 1) * 90 + 5;
        const startY = seededRandom(i * 13 + 3) * 90 + 5;
        const duration = 15 + seededRandom(i * 11) * 20;
        const moveX = (seededRandom(i * 17) - 0.5) * 60;
        const moveY = (seededRandom(i * 23) - 0.5) * 30;
        const rotation = (seededRandom(i * 29) - 0.5) * 20;
        const delay = i * 0.6;
        
        return (
          <div
            key={`${text}-${i}`}
            className="absolute font-mono whitespace-nowrap select-none floating-threat"
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              fontSize: `${9 + seededRandom(i * 31) * 3}px`,
              color: getColor(i),
              transform: `rotate(${rotation}deg)`,
              ['--move-x' as string]: `${moveX}px`,
              ['--move-y' as string]: `${moveY}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}
