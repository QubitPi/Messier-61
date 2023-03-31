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
import { useState } from "react";
import { CopyIconContainer, PopupTextContainer } from "../styles/DefaultPaneStyled";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

const POPUP_MESSAGE_DISPLAYING_TIME_MS = 1500;

/**
 * Loads a specified string into system clipboard.
 *
 * If the current system context is not [secure](https://developer.mozilla.org/en-US/docs/Web/API/isSecureContext), then
 * a textarea DOM object will instead be used as the clipboard to hold the string.
 *
 * @param text the string to be stored in clipboard
 *
 * @returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that
 * observes the clipboard write operation
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
 */
export function copyToClipboard(text: string): Promise<void> {
  // navigator clipboard requires https
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback deprecated method, which requires a textarea
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise<void>((resolve, reject) => {
      document.execCommand("copy") ? resolve() : reject();
      textArea.remove();
    });
  }
}

/**
 * The arguments passed
 *
 *
 */
export interface ClipboardCopierProps {
  textToCopy: string;

  /**
   * The floating text that is displayed when a pointing device (such as mouse) is hovered on the copy icon. For
   * example, "Copy to clipboard".
   */
  indicatorText: string;
  messageOnSuccess: string;
  messageOnFailure: string;

  /**
   * The side length of the displayed copy icon.
   *
   * The icon is assumed to be displayed in sqaure.
   */
  copyIconSideLength: number;
}

/**
 * The component that displays a copy icon and implements the copy-to-clipboard behavior.
 *
 * <img src="media://clipboard-icon-illustration.png" width="100%" />
 * <img src="media://header-clipboard-icon-illustration.png" width="100%" />
 *
 * @param props The [component props](https://qubitpi.github.io/react.dev/learn/passing-props-to-a-component)
 *
 * @returns a standard functional JSX component
 */
export function ClipboardCopier(props: ClipboardCopierProps): JSX.Element {
  const [messageToShow, setMessageToShow] = useState<string | null>(null);

  function showPopup(text: string) {
    setMessageToShow(text);
    setTimeout(() => setMessageToShow(null), POPUP_MESSAGE_DISPLAYING_TIME_MS);
  }

  return (
    <CopyIconContainer
      onClick={() =>
        copyToClipboard(props.textToCopy)
          .then(() => showPopup(props.messageOnSuccess))
          .catch(() => showPopup(props.messageOnFailure))
      }
      title={props.indicatorText}
    >
      <CopyIcon width={props.copyIconSideLength} />
      {messageToShow && <InfoPopup text={messageToShow} />}
    </CopyIconContainer>
  );
}

interface CopyIconProps {
  width: number;
}
const CopyIcon = (props: CopyIconProps): JSX.Element => (
  <DocumentDuplicateIcon width={props.width} height={props.width} />
);

interface InfoPopupProps {
  text: string;
}
function InfoPopup(props: InfoPopupProps): JSX.Element {
  return <PopupTextContainer>{props.text}</PopupTextContainer>;
}
