/**
 * Copyright 2015 CANAL+ Group
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

import { IMediaConfiguration } from "../../types";

/**
 * @returns {Promise}
 */
function isContentTypeAPISupported(): Promise<void> {
  return new Promise((resolve) => {
    if (!("MediaSource" in window)) {
      throw new Error("MediaCapabilitiesProber >>> API_CALL: " +
        "MediaSource API not available");
    }
    if (!("isTypeSupported" in (window as any).MediaSource)) {
      throw new Error("MediaCapabilitiesProber >>> API_CALL: " +
        "isTypeSupported not available");
    }
    resolve();
  });
}

/**
 * @param {Object} config
 * @returns {Promise}
 */
export default function probeContentType(config: IMediaConfiguration): Promise<[number]> {
  return isContentTypeAPISupported().then(() => {
    const contentTypes: string[] = [];
    if (
      config.video &&
      config.video.contentType
    ) {
      contentTypes.push(config.video.contentType);
    }
    if (
      config.audio &&
      config.audio.contentType
    ) {
      contentTypes.push(config.audio.contentType);
    }
      if (contentTypes === null || !contentTypes.length) {
        throw new Error("MediaCapabilitiesProber >>> API_CALL: " +
          "Not enough arguments for calling isTypeSupported.");
      }
      const result: [number] = [contentTypes.reduce((acc, val) => {
        const support = (window as any).MediaSource.isTypeSupported(val) ? 2 : 0;
        return Math.min(acc, support);
      }, 3)];
      return result;
    });
}
