export default function TwoWayDataBinding() {
    return (
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
    );
}
