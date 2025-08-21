import Link from "next/link";
import Image from "next/image";
import {
  BookmarkBorder,
  Business,
  Group,
  NotificationsNone,
  Search,
  TrendingUp,
  UploadFile,
} from "@mui/icons-material";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white mt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Image
                src="/logo-sign.png"
                alt="ApplyX Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <h1 className="text-2xl font-bold text-black tracking-tight">
                ApplyX
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-[#0090D9] hover:bg-[#0090D9-700] text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-16">
        <div className="text-center bg-[#E6F7FF] pt-10 pb-10">
          <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-5xl">
            <span className="block">Next-Gen Job Searching & Recruiting</span>
            <span className="block text-[#0090D9]">Simple. Fast. Smart.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-md text-gray-600 sm:text-md md:mt-8 md:text-xl md:max-w-3xl">
            ApplyX connects professionals and employers through a seamless,
            interactive experience. Receive instant notifications for relevant
            jobs, apply effortlessly by uploading or building your CV, and track
            your progress—all in one app. Employers can create verified company
            profiles, post jobs and manage the recruitment process with ease.
            With sleek design, intelligent matching, and a focus on efficiency,
            ApplyX redefines how candidates and companies connect in today’s
            fast-paced job market.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
            <div className="rounded-md shadow">
              <Link
                href="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0090D9] hover:bg-[#0090D9-700] md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#0090D9] bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Instant Notifications */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-[#E6F7FF] rounded-md flex items-center justify-center">
                  <span className="w-6 h-6 text-[#0090D9] flex items-center justify-center">
                    <NotificationsNone />
                  </span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Instant Job Notifications
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Get notified instantly about relevant opportunities tailored to
                your profile.
              </p>
            </div>

            {/* Feature 2: Effortless CV Upload/Build */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-[#E6F7FF] rounded-md flex items-center justify-center">
                  <span className="w-6 h-6 text-[#0090D9] flex items-center justify-center">
                    <UploadFile />
                  </span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Effortless CV Upload & Builder
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Upload your CV or build it on the platform with beautiful
                templates and smart suggestions.
              </p>
            </div>

            {/* Feature 3: Progress Tracking */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-[#E6F7FF] rounded-md flex items-center justify-center">
                  <span className="w-6 h-6 text-[#0090D9] flex items-center justify-center">
                    <TrendingUp />
                  </span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Track Your Progress
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Monitor your applications, interview schedules, and job
                status—all in one dashboard.
              </p>
            </div>

            {/* Feature 4: Powerful Job Search */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-[#E6F7FF] rounded-md flex items-center justify-center">
                  <span className="w-6 h-6 text-[#0090D9] flex items-center justify-center">
                    <Search />
                  </span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Powerful Job Search
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Find jobs by title, industry, location, or salary—tailored to
                your career path.
              </p>
            </div>

            {/* Feature 5: Save Jobs for Later */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-[#E6F7FF] rounded-md flex items-center justify-center">
                  <span className="w-6 h-6 text-[#0090D9] flex items-center justify-center">
                    <BookmarkBorder />
                  </span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Save Jobs for Later
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Bookmark interesting jobs and return to them when you’re ready
                to apply.
              </p>
            </div>

            {/* Feature 6: Candidate Management */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-[#E6F7FF] rounded-md flex items-center justify-center">
                  <span className="w-6 h-6 text-[#0090D9] flex items-center justify-center">
                    <Group />
                  </span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Candidate Management
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Employers can shortlist and review applications in one
                place.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
