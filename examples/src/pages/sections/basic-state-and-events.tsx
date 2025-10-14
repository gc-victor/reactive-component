export default function BasicStateAndEvents() {
    return (
        <section>
            <h2 className="text-lg font-cal mb-3">Basic State and Events</h2>
            <div className="space-y-4">
                <basic-counter className="p-4 border border-slate-300 rounded block">
                    <p className="mb-2">
                        Count: <span $state="count">2</span>
                    </p>
                    <button type="button" onclick="decrement" className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
                        Decrement
                    </button>
                    <button type="button" onclick="increment" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Increment
                    </button>
                </basic-counter>
            </div>
        </section>
    );
}
