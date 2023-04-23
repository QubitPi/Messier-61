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
import { formatNodeLabel } from "./GraphDecorator";

test("lable on node style", () => {
  const shortString = "1234";
  const mediumString = "1234567";
  const longString = "1234567890";

  expect(formatNodeLabel(shortString)).toBe("1234");
  expect(formatNodeLabel(mediumString)).toBe("1234\n567");
  expect(formatNodeLabel(longString)).toBe("1234...");
});
