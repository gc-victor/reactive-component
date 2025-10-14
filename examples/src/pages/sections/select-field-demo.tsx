export default function SelectFieldDemo() {
    return (
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
    );
}
