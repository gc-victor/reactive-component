export default function ComputedProperties() {
    return (
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
    );
}
