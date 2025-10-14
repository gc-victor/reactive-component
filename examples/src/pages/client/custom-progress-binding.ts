import { define } from "@dist/index.js";

// Custom Progress Binding with Progress Bar
define("custom-progress-binding", ({ $state, $bind, $compute, $ref, $customBindingHandlers }) => {
    let progressInterval: number | null = null;

    // Initialize state
    $state.progressValue = 0;
    $state.status = "Starting...";

    // Compute loading status
    $compute("loadingStatus", ["progressValue"], (value: unknown) => {
        if ((value as number) >= 100) return "Complete!";
        if ((value as number) > 0) return `Loading: ${value as number}%`;
        return "Starting...";
    });

    // Helper function to update button states
    const updateButtonsState = (isRunning: boolean): void => {
        const startButton = $ref.startButton as HTMLButtonElement;
        const stopButton = $ref.stopButton as HTMLButtonElement;
        if (startButton) startButton.disabled = isRunning;
        if (stopButton) stopButton.disabled = !isRunning;
    };

    // Custom binding handler for progress
    $customBindingHandlers.progress = ({ element, rawValue }) => {
        if (element instanceof HTMLProgressElement) {
            element.value = Number(rawValue) || 0;
            element.max = 100;
        }
    };

    // Method to simulate progress
    $bind.startProgress = () => {
        let value = $state.progressValue && $state.progressValue !== 100 ? ($state.progressValue as number) : 0;
        // Clear any existing interval
        if (progressInterval) {
            window.clearInterval(progressInterval);
        }

        // Update button states for running state
        updateButtonsState(true);

        progressInterval = window.setInterval(() => {
            if (value >= 100) {
                if (progressInterval) {
                    window.clearInterval(progressInterval);
                    progressInterval = null;
                    updateButtonsState(false);
                }
            } else {
                value += 10;
                $state.progressValue = value;
            }
        }, 500);
    };

    // Method to stop progress simulation
    $bind.stopProgress = () => {
        if (progressInterval) {
            window.clearInterval(progressInterval);
            progressInterval = null;
            updateButtonsState(false);
        }
    };
});
