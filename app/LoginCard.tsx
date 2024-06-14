import Link from 'next/link';

export default function LoginCard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900">
      <div className="p-8 rounded-lg shadow-lg max-w-sm w-full text-center bg-zinc-800">
        <img src="/next.svg" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <Link 
          className="text-blue-500 hover:text-blue-700 font-semibold"
          href="/auth/login"
        >
          Login   
        </Link>
      </div>
    </div>
  );
}