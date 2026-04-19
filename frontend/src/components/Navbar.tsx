// frontend/src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-300">EMS</Link>
        <div className="space-x-4">
          <Link href="/employees" className="hover:text-gray-300">Employees</Link>
          <Link href="/attendance" className="hover:text-gray-300">Attendance</Link>
          <Link href="/attendance/monthly" className="hover:text-gray-300">Monthly View</Link>
          <Link href="/salary" className="hover:text-gray-300">Salaries</Link>
        </div>
      </div>
    </nav>
  );
}