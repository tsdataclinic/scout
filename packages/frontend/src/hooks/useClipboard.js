import { useState } from 'react';

const copyToClipboard = async (text) => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Suppress error and try fallback method
    }
  }

  if (
    document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    const textarea = document.createElement('textarea');
    textarea.style.opacity = '0';
    textarea.textContent = text;
    // Prevent scrolling to bottom of page
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy');
    } catch (e) {
      // Security exception may be thrown by some browsers.
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
  return false;
};

export default (url) => {
  const [isCopied, setIsCopied] = useState(false);

  const setCopied = async () => {
    await copyToClipboard(url);
    setIsCopied(true);
  };
  return [isCopied, setCopied];
};
