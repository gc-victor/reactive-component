export default function HtmlContentUpdates() {
    return (
        <section>
            <h2 className="text-lg font-cal mb-3">HTML Content Updates</h2>
            <div className="space-y-4">
                <html-toggler className="p-4 border border-slate-300 rounded block">
                    <button type="button" onclick="toggle" className="bg-green-500 text-white px-4 py-2 rounded mb-2">
                        Toggle Content
                    </button>
                    <p $state="content" $bind-html="content">
                        <strong>Initial</strong> content
                    </p>
                </html-toggler>
            </div>
        </section>
    );
}
