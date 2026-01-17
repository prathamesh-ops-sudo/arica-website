import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface AnimatedHeroProps {
  centered?: boolean;
}

function AnimatedHero({ centered = false }: AnimatedHeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["protected", "secured", "monitored", "defended", "fortified"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className={`flex gap-6 flex-col ${centered ? 'items-center text-center' : 'items-start text-left'}`}>
        <div>
          <Button variant="secondary" size="sm" className="gap-4 backdrop-blur-sm" data-testid="button-launch-article">
            Enterprise Grade Security <MoveRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-4 flex-col">
          <h1 className={`text-5xl md:text-7xl max-w-2xl tracking-tighter font-regular ${centered ? 'text-center' : 'text-left'}`}>
            <span className="text-halo-white">Your assets are</span>
            <span className={`relative flex w-full overflow-hidden md:pb-4 md:pt-1 ${centered ? 'justify-center text-center' : 'justify-start text-left'}`}>
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-semibold text-primary"
                  initial={{ opacity: 0, y: "-100" }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? {
                          y: 0,
                          opacity: 1,
                        }
                      : {
                          y: titleNumber > index ? -150 : 150,
                          opacity: 0,
                        }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>

          <p className={`text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl ${centered ? 'text-center' : 'text-left'}`}>
            Securing government and enterprise assets with high-trust
            forensics, real-time threat detection, and rigorous legal
            compliance solutions. Your digital future starts here.
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <Link href="/contact">
            <Button size="lg" className="gap-4 backdrop-blur-sm" variant="outline" data-testid="button-call">
              Jump on a call <PhoneCall className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/services">
            <Button size="lg" className="gap-4" data-testid="button-signup">
              Explore services <MoveRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
