import { JSX } from "react";

export interface Renderable {
    renderSummaryCard(setSelected: (card: any) => void): JSX.Element;
    renderDetailsTitle(): JSX.Element;
    renderDetailsSheet(): JSX.Element;
}

export class Basic implements Renderable {
    renderSummaryCard(setSelected: (card: any) => void): JSX.Element {
        return (<></>);
    }
    renderDetailsTitle(): JSX.Element{
        return (<></>);
    }
    renderDetailsSheet(): JSX.Element{
        return (<></>);
    }
}
