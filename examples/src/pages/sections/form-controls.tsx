export default function FormControls() {
    return (
        <section>
            <h2 className="text-lg font-cal mb-3">Form Controls</h2>
            <div className="space-y-4">
                <form-demo>
                    <div class="space-y-4">
                        <div>
                            <input type="checkbox" id="enabled" $bind-checked="isEnabled" class="mr-2" />
                            <label for="enabled">Enable input</label>
                        </div>

                        <div>
                            <input
                                type="text"
                                $bind-value="inputText"
                                $bind-disabled="isDisabled"
                                $bind-class="isInputValid"
                                class="border border-slate-300 p-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Type when enabled..."
                                aria-describedby="status"
                            />
                        </div>

                        <p id="status">
                            Status: <span $bind-text="status" $bind-class="isStatusValid" />
                        </p>
                    </div>
                </form-demo>
            </div>
        </section>
    );
}
