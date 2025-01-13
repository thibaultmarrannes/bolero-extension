document.addEventListener("DOMContentLoaded", async () => {
  const statusDiv = document.getElementById("status");
  const redirectButton = document.getElementById("redirect");
  const grabDataButton = document.getElementById("grab-data");

  const transactionHistoryURL = "https://platform.bolero.be/cash/transaction-history";

  // Check the current tab's URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url === transactionHistoryURL) {
    statusDiv.textContent = "You are on the transaction history page!";
    grabDataButton.style.display = "block";

    grabDataButton.addEventListener("click", () => {
      // Inject content script and execute table data extraction
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
    });
  } else {
    statusDiv.textContent = "You are not on the transaction history page.";
    redirectButton.style.display = "block";

    redirectButton.addEventListener("click", () => {
      chrome.tabs.update(tab.id, { url: transactionHistoryURL });
    });
  }
});