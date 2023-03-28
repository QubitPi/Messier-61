export class Selector {
  private tag = "";
  private classes: string[] = [];

  constructor(tag: string, classes: null | string[]) {
    this.tag;
    this.classes = classes ?? [];
  }

  public toString(): string {
    return this.selectorArrayToString([this.tag].concat(this.classes));
  }

  private selectorArrayToString(selectors: any): string {
    const escaped = selectors.map((r: any) => r.replace(/\./g, '\\.'))
    return escaped.join('.')
  }
}

export class StyleRule {
  selector: Selector;
  props: Record<string, string>;

  constructor(selector: Selector, props: Record<string, string>) {
    this.selector = selector;
    this.props = props;
  }
}

export class GraphStyleModel {
  rules: StyleRule[];
  private useGeneratedDefaultColor: boolean;

  constructor(useGeneratedDefaultColor: boolean) {
    this.rules = [];
    this.useGeneratedDefaultColor = useGeneratedDefaultColor;
  }

  public toSheet(): any {
    const sheet: any = {};

    this.rules.forEach((rule: StyleRule) => {
      sheet[rule.selector.toString()] = rule.props;
    })

    return sheet;
  }
}
