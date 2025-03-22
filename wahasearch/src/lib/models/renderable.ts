export interface Renderable {
    renderSummaryCard(setSelected: (card: any) => void): JSX.Element;
    renderDetailsTitle(): JSX.Element;
    renderDetailsSheet(): JSX.Element;
}