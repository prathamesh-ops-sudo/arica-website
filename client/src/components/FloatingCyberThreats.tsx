import { motion } from "framer-motion";

interface FloatingCyberThreatsProps {
  variant?: "red" | "purple" | "mixed";
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

export function FloatingCyberThreats({ 
  variant = "purple", 
  density = "medium",
  className = "" 
}: FloatingCyberThreatsProps) {
  const count = density === "low" ? 8 : density === "medium" ? 14 : 22;
  const items = allItems.sort(() => Math.random() - 0.5).slice(0, count);

  const getColor = (index: number) => {
    if (variant === "red") return `rgba(255, ${60 + index * 5}, ${30 + index * 3}, 0.12)`;
    if (variant === "purple") return `rgba(${120 + index * 3}, ${40 + index * 2}, ${200 + index * 2}, 0.12)`;
    return index % 2 === 0 
      ? `rgba(123, 47, 224, 0.12)` 
      : `rgba(255, ${60 + index * 5}, ${30 + index * 3}, 0.08)`;
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {items.map((text, i) => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = 12 + Math.random() * 15;
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        return (
          <motion.div
            key={`${text}-${i}`}
            className="absolute font-mono whitespace-nowrap select-none"
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              fontSize: `${9 + Math.random() * 3}px`,
              color: getColor(i),
              transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
            }}
            animate={{
              x: [0, direction * (30 + Math.random() * 60), 0],
              y: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: duration,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {text}
          </motion.div>
        );
      })}
    </div>
  );
}
