document.addEventListener("DOMContentLoaded", async () => {
  const statusDiv = document.getElementById("status");
  const redirectToLedgerButton = document.getElementById("redirect");
  const grabLedgerDataButton = document.getElementById("grab-data");
  const redirectToOrdersButton = document.getElementById("goto_transactions");
  const grabOrderDataButton = document.getElementById("extract_transactions");
  const LedgerHistoryURL = "https://platform.bolero.be/cash/transaction-history";
  const OrdersURL = "https://platform.bolero.be/orders/history";

  /**
   * Function to update the popup UI based on the current tab URL
   * @param {string} url - The current tab's URL
   */
  const updatePopup = async (url) => {
    // Reset the visibility of all buttons
    grabLedgerDataButton.style.display = "none";
    grabOrderDataButton.style.display = "none";
    redirectToLedgerButton.style.display = "none";
    redirectToOrdersButton.style.display = "none";

    // Determine the content based on the URL
    if (url === LedgerHistoryURL) {
      statusDiv.textContent = "Je bent op de transactiegeschiedenis pagina";
      grabLedgerDataButton.style.display = "block";

      grabLedgerDataButton.addEventListener("click", async () => {
        chrome.scripting.executeScript({
          target: { tabId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id },
          files: ["content.js"],
        });
      });
    } else if (url === OrdersURL) {
      statusDiv.textContent = "Je bent op de orders geschiedenis pagina";
      grabOrderDataButton.style.display = "block";

      grabOrderDataButton.addEventListener("click", async () => {
        chrome.scripting.executeScript({
          target: { tabId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id },
          files: ["content.js"],
        });
      });
    } else {
      statusDiv.textContent = "You are not on the transaction history page or the Orders page.";
      redirectToLedgerButton.style.display = "block";
      redirectToOrdersButton.style.display = "block";

      redirectToLedgerButton.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.update(tab.id, { url: LedgerHistoryURL });
      });

      redirectToOrdersButton.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.update(tab.id, { url: OrdersURL });
      });
    }
  };

  // Get the current tab's URL and initialize the popup
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await updatePopup(tab.url);

  // Listen for messages from the background script for URL updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.url) {
      console.log("Popup received URL update:", message.url);
      updatePopup(message.url); // Reinitialize the popup when the URL changes
    }
  });
});