import { CommonProps } from "@/domain/types/common";
import { cn } from "@/domain/utils/common";

export function Brand(
  props: CommonProps & {
    brandClassNames?: string;
    logoClassNames?: string;
  }
) {
  const { className, brandClassNames, logoClassNames } = props;

  return (
    <div className={cn("flex gap-2 items-center justify-center w-full", className)}>
      <div className={cn("w-fit text-xl text-brand font-medium font-asterone", logoClassNames)}>
        <span className={cn("font-proxima-nova-alt text-4xl font-medium", brandClassNames)}>Q</span>uastrom-Renov
      </div>
    </div>
  );
}
