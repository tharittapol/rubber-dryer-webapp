import Image from "next/image";

export function Logo({ size = 100 }: { size?: number }) {
  return <Image src="/logo.svg" alt="Rubber Dryer System logo" width={size} height={size} priority />;
}

export function LogoAppShell({ size = 100 }: { size?: number }) {
  return <Image src="/logo2.svg" alt="Rubber Dryer System logo2" width={size} height={size} priority />;
}
