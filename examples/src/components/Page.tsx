export function Page({ children }: { children: unknown }) {
    return (
        <main className="p-8 space-y-8">
            <h1 className="text-2xl font-cal">Reactive Component SXO Examples</h1>
            {children}
        </main>
    );
}
