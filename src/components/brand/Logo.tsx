import Image from "next/image";

export function Logo({ size = 100 }: { size?: number }) {
  return <Image src="/logo.svg" alt="Rubber Dryer System logo" width={size} height={size} priority />;
}
