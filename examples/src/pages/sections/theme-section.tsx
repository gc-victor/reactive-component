export default function ThemeSection() {
    return (
        <section>
            <h2 className="text-lg font-cal mb-3">Expose and Consume Context</h2>
            <div className="space-y-4">
                <theme-provider className="p-4 border border-slate-300 rounded block">
                    <button
                        type="button"
                        onclick="toggleTheme"
                        className="mb-4 bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600"
                    >
                        Toggle Theme
                    </button>
                    <theme-consumer className="block p-4 rounded transition-colors duration-200">
                        <p $ref="themeInfo" className="text-lg mb-2" />
                    </theme-consumer>
                </theme-provider>
            </div>
        </section>
    );
}
