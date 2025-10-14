export default function PasswordToggleComponent() {
    return (
        <section>
            <h2 className="text-lg font-cal mb-3">Password Toggle Component</h2>
            <div className="space-y-4">
                <password-toggle className="p-4 border border-slate-300 rounded block">
                    <div className="relative max-w-sm">
                        <input
                            className="w-full px-3 py-2 border border-slate-300 rounded pr-10"
                            $bind-type="isPasswordVisible"
                            type="password"
                            placeholder="Enter password"
                            autocomplete="current-password"
                            aria-label="Password input field"
                        />

                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                            onclick="toggleVisibility"
                            aria-label="Toggle password visibility"
                        >
                            <span data-icon="show" style="display: block;" $bind-icon-visibility="isPasswordVisible">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <title>Show Password</title>
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </span>
                            <span data-icon="hide" style="display: none;" $bind-icon-visibility="isPasswordVisible">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <title>Hide Password</title>
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                    <line x1="2" y1="2" x2="22" y2="22" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </password-toggle>
            </div>
        </section>
    );
}
