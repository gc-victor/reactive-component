export default function ReferencesDemo() {
    return (
        <section>
            <h2 className="text-lg font-cal mb-3">References Demo</h2>
            <div className="space-y-4">
                <ref-demo className="p-4 border border-slate-300 rounded block">
                    <div className="space-y-4">
                        <p className="font-bold">Refs Demo - Legitimate Use Cases for Direct DOM Access</p>

                        <div className="space-y-2 p-3">
                            <label className="font-semibold text-sm block" for="usernameInput">
                                1. Focus Management
                            </label>
                            <input
                                $ref="usernameInput"
                                type="text"
                                id="usernameInput"
                                placeholder="Username"
                                className="border border-slate-300 p-2 w-full"
                            />
                            <button type="button" onclick="focusUsername" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Focus Username Input
                            </button>
                        </div>

                        <div className="space-y-2 p-3">
                            <p className="font-semibold text-sm">2. DOM Measurements</p>
                            <div $ref="measureBox" className="bg-slate-100 p-4 rounded">
                                <p>This box can be measured!</p>
                                <p className="text-xs text-slate-600">Resize the window to see updates</p>
                            </div>
                            <button type="button" onclick="measureElement" className="bg-green-500 text-white px-4 py-2 rounded">
                                Measure Box
                            </button>
                            <p className="text-sm">
                                Dimensions: <span $bind-text="dimensions" />
                            </p>
                        </div>
                    </div>
                </ref-demo>
            </div>
        </section>
    );
}
