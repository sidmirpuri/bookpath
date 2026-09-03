import Image from "next/image";

export default function BookPathLogo() {
  return (
    <Image
      src="/bookpath-full-logo.png"
      alt="Book Path — Science meets AI"
      width={1410}
      height={348}
      className="h-16 w-auto"
      priority
    />
  );
}
