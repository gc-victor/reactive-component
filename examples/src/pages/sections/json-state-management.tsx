export default function JsonStateManagement() {
    return (
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
    );
}
