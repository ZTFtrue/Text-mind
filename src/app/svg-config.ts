export class SvgConfig {
  svgWidth: number;
  svgHeight: number;
  tabIndex: number;
  lineColor: string;
  textColor: string;
  constructor(svgWidth: number, svgHeight: number, tabIndex: number, lineColor: string, textColor: string) {
    this.svgWidth = svgWidth;
    this.svgHeight = svgHeight;
    this.tabIndex = tabIndex;
    this.lineColor = lineColor;
    this.textColor = textColor;
  }
}
