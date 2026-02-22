import { useState } from "react";
import { useAuth } from "../../store/ContextStore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    mobile_no: "",
    city: "",
    gender: "",
    college: "",
    course: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNavigate = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await register(formData);
      console.log(response);
      // Extract user data from response
      const userInfo = response?.data?.user || response?.user || formData;
      setUserData({
        name: userInfo.name || formData.name,
        email: userInfo.email || formData.email,
        utkarshId: userInfo.utkarshId || `UTK${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        college: userInfo.college || formData.college,
        course: userInfo.course || formData.course,
        registrationDate: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      });
      setShowSuccessPopup(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
        <div className="w-full max-w-3xl bg-amber-50 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Join us and get started 🚀
          </p>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-8 md:flex-row flex-col">
              <div className="flex-1">
                <Input name="name" label="Full Name" onChange={handleChange} />
              </div>
              <div className="flex-1">
                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-8 md:flex-row flex-col">
              <div className="flex-1">
                <Input
                  name="password"
                  type="password"
                  label="Password"
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <Input
                  name="mobile_no"
                  label="Mobile Number"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-8 md:flex-row flex-col justify-between">
              <div className="flex-1">
                <Input name="city" label="City" onChange={handleChange} />
              </div>
              <div className="flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border-2 text-amber-700 text-sm font-bold"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <Input name="college" label="College" onChange={handleChange} />
            <Input name="course" label="Course" onChange={handleChange} />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-lg text-white font-semibold
                bg-linear-to-r from-indigo-600 to-purple-600
                hover:from-indigo-700 hover:to-purple-700
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              className="text-indigo-600 hover:underline cursor-pointer"
              onClick={handleNavigate}
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && userData && (
        <SuccessPopup 
          userData={userData} 
          onClose={() => {
            setShowSuccessPopup(false);
            navigate("/login");
          }} 
        />
      )}
    </>
  );
};

// Success Popup Component
const SuccessPopup = ({ userData, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-w-md w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-[2px] animate-slideUp">
        <div className="bg-white rounded-2xl p-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Congratulations Text */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            🎉 Congratulations! 🎉
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Your account has been successfully created
          </p>

          {/* Utkarsh ID Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border-2 border-indigo-200">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Your Unique Utkarsh ID
              </span>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">ID:</span>
                <span className="text-xl font-mono font-bold text-indigo-600">
                  {userData.utkarshId}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-semibold text-gray-800 truncate">{userData.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">College:</span>
                    <p className="font-semibold text-gray-800 truncate">{userData.college || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Course:</span>
                    <p className="font-semibold text-gray-800 truncate">{userData.course || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-semibold text-gray-800">{userData.registrationDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save ID Badge */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please save this ID for future reference</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Copy ID to clipboard
                navigator.clipboard.writeText(userData.utkarshId);
                // Show temporary feedback
                const btn = document.getElementById('copyBtn');
                btn.textContent = 'Copied!';
                setTimeout(() => {
                  btn.textContent = 'Copy ID';
                }, 2000);
              }}
              id="copyBtn"
              className="flex-1 px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-200"
            >
              Copy ID
            </button>
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

// Reusable Input Component (Memoized for performance)
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      required
      placeholder={label}
      className="w-full rounded-lg border-gray-300
      border-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 text-green-500
      transition-all duration-200"
    />
  </div>
);

export default Register;