(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to load all records
  const loadAllRecords = async () => {
    while (true) {
      const loadMoreButton = document.querySelector(
        "button.ta-button.ta-button--fixed-width.ta-button--small"
      );

      if (!loadMoreButton) {
        console.log("All records are loaded.");
        break;
      }

      console.log("Clicking 'Load More' button...");
      loadMoreButton.click();
      await sleep(2000); // Kan eventueel lager, maar is op zich geen gigantische bottleneck dus 2 seconden is oké
    }
  };

  // Function to extract data from the popup
  const extractData = () => {
    const makelaarsloonElement = document.querySelector(
      "body > ta-root > div > div.context-wrapper__inner > ta-context > div > ng-component.aside-right__body.ta-col--4.ng-star-inserted > div > section:nth-child(2) > div > div > div > section > div > div > table > tbody:nth-child(1) > tr:nth-child(8) > td.table__cell.table__cell--50.table__cell--strong"
    );

    const beurstaksElement = document.querySelector(
      "body > ta-root > div > div.context-wrapper__inner > ta-context > div > ng-component.aside-right__body.ta-col--4.ng-star-inserted > div > section:nth-child(2) > div > div > div > section > div > div > table > tbody:nth-child(1) > tr:nth-child(9) > td.table__cell.table__cell--50.table__cell--strong"
    );

    let makelaarsloon = "N/A";
    let beurstaks = "N/A";

    if (makelaarsloonElement) {
      const makelaarsloonValue = makelaarsloonElement.nextElementSibling;
      makelaarsloon = makelaarsloonValue?.textContent.trim() || "N/A";
    }

    if (beurstaksElement) {
      const beurstaksValue = beurstaksElement.nextElementSibling;
      beurstaks = beurstaksValue?.textContent.trim() || "N/A";
    }

    return { makelaarsloon, beurstaks };
  };

  // Function to convert data to CSV format
  const convertToCSV = (data, headers) => {
    const headerRow = headers.join(",") + "\n";
    const rows = data
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");
    return headerRow + rows;
  };

  // Function to download a file
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to send data to the server
  const sendDataToServer = async (data, endpoint) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Data successfully sent to the server.");
      } else {
        console.error("Failed to send data to the server.", response.statusText);
      }
    } catch (error) {
      console.error("Error sending data to the server:", error);
    }
  };

  // Load all records
  await loadAllRecords();

  // Locate the table
  const table = document.querySelector("table");
  if (!table) {
    console.error("No table found on the page.");
    return;
  }

  console.log("Processing table rows...");
  const rows = table.querySelectorAll("tr");

  const headers = Array.from(rows[0].querySelectorAll("th")).map((th) =>
    th.textContent.trim()
  );

  headers.push("Makelaarsloon", "Beurstaks");

  const allData = []; // Array to store all row data

  // Iterate through each row (skip the header row)
  for (const [index, row] of Array.from(rows).slice(1).entries()) {
    console.log(`Processing row ${index + 1}...`);

    const cells = Array.from(row.querySelectorAll("td")).map((cell) =>
      cell.textContent.trim()
    );

    const firstTdLink = row.querySelector("td:first-child a");
    if (firstTdLink) {
      console.log(`Found a link in row ${index + 1}:`, firstTdLink.href);

      try {
        firstTdLink.click();
        console.log("Waiting for the popup to load...");
        await sleep(2000); //Dit kan eventueel verlaagd worden om de snelheid te verhogen, maar 2 seconden is wel een veilige keus. 750ms was voor mij te snel om altijd correcte resultaten te geven -t

        const { makelaarsloon, beurstaks } = extractData();
        cells.push(makelaarsloon, beurstaks);

        const closeButton = document.querySelector(".link--close-aside");
        if (closeButton) {
          closeButton.click();
          console.log("Popup closed.");
          await sleep(1000);
        }
      } catch (error) {
        console.error(`Error processing row ${index + 1}:`, error);
        cells.push("N/A", "N/A");
      }
    } else {
      console.log(`No link found in row ${index + 1}.`);
      cells.push("N/A", "N/A");
    }

    allData.push(cells);
  }

  console.log("Processing complete.");
  console.log("All Data:", allData);

  const csvContent = convertToCSV(allData, headers);
  downloadCSV(csvContent, "transaction_data.csv");

  // Als je wil kan deze plugin ook data versturen naar een endpoint/server. Kwestie van deze plugin eenvoudig te houden is dit niet geïmplementeerd.
  const endpoint = "https://your-server-endpoint.example.com/api/data"; // Replace with your endpoint
 // await sendDataToServer({ headers, rows: allData }, endpoint);
})();