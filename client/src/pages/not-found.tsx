import { motion } from "framer-motion";
import { Link } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/circle-unique-load";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute inset-0 opacity-20" style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(61, 112, 183, 0.06) 0%, transparent 55%)`
      }} />

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="mb-8">
            <Loading screenHFull={false} />
          </div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-display font-bold text-xl">ARICA TECH</span>
          </div>

          <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="font-display text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-8">
            The resource you're looking for has been secured or doesn't exist. 
            Our security protocols have logged this access attempt.
          </p>

          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 group">
              <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Return to Base
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
