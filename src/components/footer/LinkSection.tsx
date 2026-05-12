import Link from "next/link";

export default function LinkSection() {
  return (
    <div className="flex flex-col items-center gap-2 pb-6">
      <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
        <Link
          href="/terms-of-service"
          className="hover:text-gray-900 hover:underline transition-colors"
        >
          Terms of Service
        </Link>
        <span className="text-gray-300">|</span>
        <Link
          href="/privacy-policy"
          className="hover:text-gray-900 hover:underline transition-colors"
        >
          Privacy Policy
        </Link>
        <span className="text-gray-300">|</span>
        <Link
          href="/data-deletion"
          className="hover:text-gray-900 hover:underline transition-colors"
        >
          Data Deletion
        </Link>
      </div>
      <p className="text-[11px] text-gray-400">
        &copy; {new Date().getFullYear()} Xale. All rights reserved. &middot; Powered by{" "}
        <a
          href="https://marketlube.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--color-success,#156548)] hover:underline"
        >
          Marketlube
        </a>
      </p>
    </div>
  );
}
