'use client';

import Link from 'next/link';
import styles from './Home.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">AttendRight</Link>
        </div>
        <div className={styles.navLinks}>
          <Link href="/student/sign-in">Student</Link>
          <Link href="/teacher/login">Teacher</Link>
          <Link href="/admin/login">Admin</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the Future of Attendance Tracking
        </h1>
        <p className={styles.description}>
          An automated, analytics-driven system designed for modern colleges.
          Streamline attendance, gain insights, and enhance student engagement.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/student/sign-in" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Student Login
          </Link>
          <Link href="/teacher/login" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Teacher Login
          </Link>
          <Link href="/admin/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Admin Login
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 AttendRight. All rights reserved.</p>
      </footer>
    </div>
  );
}