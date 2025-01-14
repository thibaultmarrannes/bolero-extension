document.addEventListener("DOMContentLoaded", async () => {
  const statusDiv = document.getElementById("status");
  const redirectToLedgerButton = document.getElementById("redirect");
  const grabLedgerDataButton = document.getElementById("grab-data");
  const redirectToOrdersButton = document.getElementById("goto_transactions");
  const grabOrderDataButton = document.getElementById("extract_transactions");
  const LedgerHistoryURL = "https://platform.bolero.be/cash/transaction-history";
  const OrdersURL = "https://platform.bolero.be/orders/history";

  /**
   * Clear all button event listeners by cloning and replacing the buttons.
   */
  const resetButtons = () => {
    const buttons = [grabLedgerDataButton, grabOrderDataButton, redirectToLedgerButton, redirectToOrdersButton];
    buttons.forEach((button) => {
      const clone = button.cloneNode(true);
      button.replaceWith(clone);
    });
  };

  /**
   * Update the popup UI based on the current tab URL
   * @param {string} url - The current tab's URL
   */
  const updatePopup = async (url) => {
    // Reset visibility of all buttons
    grabLedgerDataButton.style.display = "none";
    grabOrderDataButton.style.display = "none";
    redirectToLedgerButton.style.display = "none";
    redirectToOrdersButton.style.display = "none";

    // Reset button event listeners
    resetButtons();

    // Assign fresh event listeners after resetting
    const newGrabLedgerDataButton = document.getElementById("grab-data");
    const newGrabOrderDataButton = document.getElementById("extract_transactions");
    const newRedirectToLedgerButton = document.getElementById("redirect");
    const newRedirectToOrdersButton = document.getElementById("goto_transactions");

    // Update UI and event listeners based on the URL
    if (url === LedgerHistoryURL) {
      statusDiv.textContent = "Je bent op de transactiegeschiedenis pagina";
      newGrabLedgerDataButton.style.display = "block";
      newRedirectToOrdersButton.style.display = "block";
      newRedirectToLedgerButton.style.display = "none";
      newGrabOrderDataButton.style.display = "none";
      

      // Add event listener for "Grab Ledger Data"
      newGrabLedgerDataButton.addEventListener("click", async () => {
        chrome.scripting.executeScript({
          target: { tabId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id },
          files: ["getLedgerData.js"],
        });
      });
    } else if (url === OrdersURL) {
      statusDiv.textContent = "Je bent op de orders geschiedenis pagina";
      newGrabOrderDataButton.style.display = "block";
      newRedirectToLedgerButton.style.display = "block";
      newRedirectToOrdersButton.style.display = "none";
      newGrabLedgerDataButton.style.display = "none";

      // Add event listener for "Grab Order Data"
      newGrabOrderDataButton.addEventListener("click", async () => {
        chrome.scripting.executeScript({
          target: { tabId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id },
          files: ["getTransactionData.js"],
        });
      });
    } else {
      statusDiv.textContent = "You are not on the transaction history page or the Orders page.";
      newRedirectToLedgerButton.style.display = "block";
      newRedirectToOrdersButton.style.display = "block";

      // Add event listeners for redirect buttons
      newRedirectToLedgerButton.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.update(tab.id, { url: LedgerHistoryURL });
      });

      newRedirectToOrdersButton.addEventListener("click", async () => {
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