import { Page } from "@/pages/layout/page";
import { htmlResponse as response } from "@/pages/lib/html-response";

export async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);

    return response(
        <Page href={url.href}>
            <section>
                <h2 className="text-lg font-cal mb-3">Basic State and Events</h2>
                <div className="space-y-4">
                    <basic-counter className="p-4 border border-slate-300 rounded block">
                        <p className="mb-2">
                            Count: <span $state="count">2</span>
                        </p>
                        <button type="button" onClick="decrement" className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                            Decrement
                        </button>
                        <button type="button" onClick="increment" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Increment
                        </button>
                    </basic-counter>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-cal mb-3">Two-way Data Binding</h2>
                <div className="space-y-4">
                    <input-echo className="p-4 border border-slate-300 rounded block">
                        <input
                            type="text"
                            $bind-value="text"
                            className="border border-slate-300 p-2 w-full mb-2"
                            placeholder="Type something..."
                        />
                        <p>
                            You typed: <span $bind-text="uppercase" />
                        </p>
                    </input-echo>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-cal mb-3">Computed Properties</h2>
                <div className="space-y-4">
                    <temperature-converter className="p-4 border border-slate-300 rounded block">
                        <div className="space-y-2">
                            <p>
                                Celsius: <span $state="celsius">20</span>°C
                            </p>
                            <p>
                                Fahrenheit: <span $bind-text="fahrenheit" />
                                °F
                            </p>
                            <input type="range" min="0" max="40" $bind-value="celsius" className="w-full" />
                        </div>
                    </temperature-converter>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-cal mb-3">HTML Content Updates</h2>
                <div className="space-y-4">
                    <html-toggler className="p-4 border border-slate-300 rounded block">
                        <button type="button" onClick="toggle" className="bg-green-500 text-white px-4 py-2 rounded mb-2">
                            Toggle Content
                        </button>
                        <p $state="content" $bind-html="content">
                            <strong>Initial</strong> content
                        </p>
                    </html-toggler>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-cal mb-3">Form Controls</h2>
                <div className="space-y-4">
                    <form-demo>
                        <div class="space-y-4">
                            <div>
                                <input type="checkbox" id="enabled" $bind-checked="isEnabled" class="mr-2" />
                                <label for="enabled">Enable input</label>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    $bind-value="inputText"
                                    $bind-disabled="isDisabled"
                                    $bind-class="isInputValid"
                                    class="border border-slate-300 p-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Type when enabled..."
                                    aria-describedby="status"
                                />
                            </div>

                            <p id="status">
                                Status: <span $bind-text="status" $bind-class="isSatusValid" />
                            </p>
                        </div>
                    </form-demo>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-cal mb-3">Select Field Demo</h2>
                <div className="space-y-4">
                    <select-demo className="p-4 border border-slate-300 rounded block">
                        <div className="space-y-4">
                            <select $bind-value="selectedOption" className="w-full p-2 border border-slate-300 rounded">
                                <option value="">Choose an option...</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                            <p>
                                Selected value: <span $bind-text="selected" />
                            </p>
                        </div>
                    </select-demo>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-cal mb-3">JSON State Management</h2>
                <div className="space-y-4">
                    <json-state-management className="p-4 border border-slate-300 rounded block">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block mb-1">
                                    Name:
                                </label>
                                <input id="name" type="text" $bind-value="name" className="border border-slate-300 p-2 w-full" />
                            </div>
                            <div>
                                <label htmlFor="age" className="block mb-1">
                                    Age:
                                </label>
                                <input id="age" type="number" $bind-value="age" className="border border-slate-300 p-2 w-full" />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block mb-1">
                                    Bio:
                                </label>
                                <textarea id="bio" $bind-value="bio" className="border border-slate-300 p-2 w-full h-24" />
                            </div>
                            <div>
                                <p>JSON Output:</p>
                                <pre className="bg-gray-100 p-2 rounded mt-1">
                                    <code $bind-text="json" />
                                </pre>
                            </div>
                        </div>
                    </json-state-management>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-cal mb-3">References Demo</h2>
                <div className="space-y-4">
                    <ref-demo className="p-4 border border-slate-300 rounded block">
                        <div className="space-y-4">
                            <p>Click buttons to update referenced element:</p>
                            <p $ref="output" className="text-xl font-bold text-center p-4 border border-slate-300 rounded">
                                Initial Text
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button type="button" onClick="updateText" className="bg-purple-500 text-white px-4 py-2 rounded">
                                    Update Text
                                </button>
                                <button type="button" onClick="updateColor" className="bg-pink-500 text-white px-4 py-2 rounded">
                                    Change Color
                                </button>
                            </div>
                        </div>
                    </ref-demo>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-cal mb-3">Custom Progress Binding</h2>
                <div className="space-y-4">
                    <custom-progress-binding className="p-4 border border-slate-300 rounded block">
                        <div className="flex flex-col gap-4 items-center">
                            <h2>Custom Progress Binding Demo</h2>
                            <progress
                                className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-400 [&::-moz-progress-bar]:bg-green-400"
                                $bind-progress="progressValue"
                            />
                            <p $bind-text="loadingStatus" />
                            <p className="flex">
                                <button
                                    type="button"
                                    onClick="startProgress"
                                    $ref="startButton"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Start Progress
                                </button>
                                <button
                                    type="button"
                                    onClick="stopProgress"
                                    $ref="stopButton"
                                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Stop Progress
                                </button>
                            </p>
                        </div>
                    </custom-progress-binding>
                </div>
            </section>

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
                                onClick="toggleVisibility"
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

            <section>
                <h2 className="text-lg font-cal mb-3">Expose and Consume Context</h2>
                <div className="space-y-4">
                    <theme-provider className="p-4 border border-slate-300 rounded block">
                        <button 
                            type="button" 
                            onClick="toggleTheme" 
                            className="mb-4 bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600"
                        >
                            Toggle Theme
                        </button>
                        <theme-consumer className="block p-4 rounded transition-colors duration-200">
                            <p $bind-text="themeMode" />
                            <p $bind-text="buttonTheme" />
                            <p $ref="themeInfo" className="text-lg mb-2" />
                        </theme-consumer>
                    </theme-provider>
                </div>
            </section>
        </Page>,
    );
}
