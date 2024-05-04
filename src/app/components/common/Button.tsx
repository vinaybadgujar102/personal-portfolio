import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

const Button = ({
  children,
  key,
  className,
  ...props
}: {
  children: React.ReactNode;
  key: string;
  className?: string;
}) => {
  return (
    <button
      className={cn("border-2 font-medium py-2 px-4 rounded-3xl w-28 hover:bg-slate-100 hover:border-0", className)}
    >
      {children}
    </button>
  );
};

export default Button;
