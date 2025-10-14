import { Page } from "@components/Page";
import BasicStateAndEvents from "./sections/basic-state-and-events";
import ComputedProperties from "./sections/computed-properties";
import CustomProgressBinding from "./sections/custom-progress-binding";
import FormControls from "./sections/form-controls";
import HtmlContentUpdates from "./sections/html-content-updates";
import JsonStateManagement from "./sections/json-state-management";
import PasswordToggleComponent from "./sections/password-toggle-component";
import ReferencesDemo from "./sections/references-demo";
import SelectFieldDemo from "./sections/select-field-demo";
import ThemeSection from "./sections/theme-section";
import TwoWayDataBinding from "./sections/two-way-data-binding";

export const head = {
    title: "Reactive Component Examples",
};

export default () => (
    <Page>
        <BasicStateAndEvents />
        <TwoWayDataBinding />
        <ComputedProperties />
        <HtmlContentUpdates />
        <FormControls />
        <SelectFieldDemo />
        <JsonStateManagement />
        <ReferencesDemo />
        <CustomProgressBinding />
        <PasswordToggleComponent />
        <ThemeSection />
    </Page>
);
