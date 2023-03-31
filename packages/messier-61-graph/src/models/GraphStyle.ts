/*
 * Copyright Jiaqi Liu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const OBJECT_TYPE = "object";

export const DEFAULT_STYLE = {
  node: {
    diameter: "50px",
    color: "#A5ABB6",
    "border-color": "#9AA1AC",
    "border-width": "2px",
    "text-color-internal": "#FFFFFF",
    "font-size": "10px",
  },
  relationship: {
    color: "#A5ABB6",
    "shaft-width": "1px",
    "font-size": "8px",
    padding: "3px",
    "text-color-external": "#000000",
    "text-color-internal": "#FFFFFF",
    caption: "<type>",
  },
};

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
    const escaped = selectors.map((r: any) => r.replace(/\./g, "\\."));
    return escaped.join(".");
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

  public loadRules(data?: any): void {
    const styleData = typeof data === OBJECT_TYPE ? data : DEFAULT_STYLE;

    this.rules = [];

    for (const key in styleData) {
      const props = styleData[key];
      this.rules.push(new StyleRule(this.parseSelector(key), props));
    }
  }

  public toSheet(): any {
    const sheet: any = {};

    this.rules.forEach((rule: StyleRule) => {
      sheet[rule.selector.toString()] = rule.props;
    });

    return sheet;
  }

  /**
   * Resets the node and relationship style back to {@link DEFAULT_STYLE default}.
   */
  public resetToDefault(): void {
    this.loadRules();
  }

  private parseSelector(key: string): Selector {
    const tokens = this.selectorStringToArray(key);
    return new Selector(tokens[0], tokens.slice(1));
  }

  /**
   * For example
   *
   * @param selector
   * @returns
   */
  private selectorStringToArray(selector: string): any {
    // Negative lookbehind simulation since js support is very limited.
    // We want to match all . that are not preceded by \\
    // Instead we reverse and look
    // for . that are not followed by \\ (negative lookahead)
    const reverseSelector = selector.split("").reverse().join("");
    const re = /(.+?)(?!\.\\)(?:\.|$)/g;
    const out = [];
    let m;
    while ((m = re.exec(reverseSelector)) !== null) {
      const res = m[1].split("").reverse().join("");
      out.push(res);
    }

    return out
      .filter((r) => r)
      .reverse()
      .map((r) => r.replace(/\\./g, "."));
  }
}
