export const OAuthButtons = () => (
  <button className="w-full mt-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12.545 10.238v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.844.545 3.905 1.445l2.868-2.868C17.382.887 15.177 0 12.545 0 5.617 0 0 5.617 0 12.545s5.617 12.545 12.545 12.545c7.224 0 12.022-5.08 12.022-12.247 0-1.127-.123-1.848-.258-2.565H12.545z"
      />
    </svg>
    <span className="text-sm font-medium text-gray-700">Google</span>
  </button>
);
