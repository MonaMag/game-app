import Link from "next/link";

export const Header = () => {
  return (
    <header className='h-10 flex justify-center items-center space-x-5 bg-black text-white'>
      <Link href='/'>Home</Link>
      <Link href='/snake'>Snake</Link>
    </header>
  );
};