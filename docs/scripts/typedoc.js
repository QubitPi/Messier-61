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
const TypeDoc = require("typedoc");

const retCode = -1;

const app = new TypeDoc.Application();

// Ask TypeDoc to load tsconfig.json and typedoc.json files
app.options.addReader(new TypeDoc.TSConfigReader());
app.options.addReader(new TypeDoc.TypeDocReader());

app.bootstrap({
  // typedoc options
  entryPoints: ["../packages/"],
  exclude: "../**/*+(test|env.d|setupTests).*",
  entryPointStrategy: "expand",
  tsconfig: "../tsconfig.json",
  media: "static/img/typedoc",
});

const project = app.convert();

// Project has converted correctly
if (project) {
  const outputDir = "./build/api";

  // Rendered docs
  app.generateDocs(project, outputDir);

  // Alternatively generate JSON output
  app.generateJson(project, outputDir + "/documentation.json");
} else {
  throw new Error(`app.convert() was not successful`);
}
