import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { Heart, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-green-500" />
          <span className="text-xl font-bold">WellNest</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-green-600">
            Features
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-green-600">
            Pricing
          </Link>
          <Link href="#faq" className="text-gray-600 hover:text-green-600">
            FAQ
          </Link>
          <Link href="#" className="text-gray-600 hover:text-green-600">
            About Us
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button className="bg-green-600 hover:bg-green-700">
                  My Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Join WellNest
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
