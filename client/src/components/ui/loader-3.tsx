import { cn } from "@/lib/utils";

interface BoxLoaderProps {
  className?: string;
}

export function BoxLoader({ className }: BoxLoaderProps) {
  return (
    <div className={cn("box-loader", className)}>
      <div className="box-loader__box box-loader__box0">
        <div></div>
      </div>
      <div className="box-loader__box box-loader__box1">
        <div></div>
      </div>
      <div className="box-loader__box box-loader__box2">
        <div></div>
      </div>
      <div className="box-loader__box box-loader__box3">
        <div></div>
      </div>
      <div className="box-loader__box box-loader__box4">
        <div></div>
      </div>
      <div className="box-loader__box box-loader__box5">
        <div></div>
      </div>
      <div className="box-loader__box box-loader__box6">
        <div></div>
      </div>
      <div className="box-loader__box box-loader__box7">
        <div></div>
      </div>
      <div className="box-loader__ground">
        <div></div>
      </div>
    </div>
  );
}

export default BoxLoader;
