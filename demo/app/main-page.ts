import { EventData } from "data/observable";
import { Page } from "ui/page";
import { HelloWorldModel } from "./main-view-model";

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
    const page = args.object as Page;
    page.bindingContext = new HelloWorldModel(page);
}