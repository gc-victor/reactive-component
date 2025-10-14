export default function CustomProgressBinding() {
    return (
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
                                onclick="startProgress"
                                $ref="startButton"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Start Progress
                            </button>
                            <button
                                type="button"
                                onclick="stopProgress"
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
    );
}
