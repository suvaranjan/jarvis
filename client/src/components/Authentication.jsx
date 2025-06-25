import { SignIn } from "@clerk/clerk-react";
import { CheckCircle } from "lucide-react";

function Authentication() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - App Description */}
      <div className="hidden md:flex w-1/2 bg-white p-12 flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">
            JARVIS
          </h1>
          <h2 className="text-xl font-normal mb-6 text-gray-600">
            Chat with Jarvis AI
          </h2>
          <ul className="space-y-4 text-gray-700 text-md">
            <li className="flex items-start gap-3">
              <CheckCircle size={18} className="text-blue-500 mt-0.5" />
              <span>Text to Text generation</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={18} className="text-blue-500 mt-0.5" />
              <span>Image-supported chat interface</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={18} className="text-blue-500 mt-0.5" />
              <span>Remember previous conversations</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Clerk SignIn Component */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <SignIn />
      </div>
    </div>
  );
}

export default Authentication;
