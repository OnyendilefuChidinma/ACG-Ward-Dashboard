// The Table Pagination Script
document.addEventListener("DOMContentLoaded", function () {
  // Get all table rows
  const tableRows = document.querySelectorAll("table.table-custom tbody tr");

  // Pagination settings
  const itemsPerPage = 10;
  let currentPage = 1;
  const totalPages = Math.ceil(tableRows.length / itemsPerPage);

  // Get existing pagination elements
  const pagination = document.querySelector(".pagination");
  const prevLink = document.querySelector(
    '.pagination .page-link[aria-label="Previous"]'
  );
  const nextLink = document.querySelector(
    '.pagination .page-link[aria-label="Next"]'
  );

  // Find all numbered page links (excluding prev/next)
  const pageLinks = Array.from(
    document.querySelectorAll(".pagination .page-link")
  ).filter((link) => !link.getAttribute("aria-label"));

  // Function to adjust pagination for the correct number of pages
  function adjustPaginationLinks() {
    // If we need to add more page links
    while (pageLinks.length < Math.min(totalPages, 5) && pageLinks.length < 5) {
      const newPageNum = pageLinks.length + 1;
      const newLi = document.createElement("li");
      newLi.className = "page-item";
      newLi.innerHTML = `<a class="page-link" href="javascript:void(0);">${newPageNum}</a>`;

      // Insert before the next button
      const nextLi = nextLink.closest("li");
      pagination.insertBefore(newLi, nextLi);

      // Add to our array of page links
      pageLinks.push(newLi.querySelector(".page-link"));
    }

    // If we need to remove excess page links
    while (pageLinks.length > Math.min(totalPages, 5)) {
      const lastPageLi = pageLinks[pageLinks.length - 1].closest("li");
      pagination.removeChild(lastPageLi);
      pageLinks.pop();
    }

    // Update page numbers if we have more than 5 total pages
    if (totalPages > 5) {
      updateVisiblePageNumbers();
    }
  }

  // Function to update which page numbers are visible (for more than 5 pages)
  function updateVisiblePageNumbers() {
    let startPage;

    if (currentPage <= 3) {
      // Near the beginning
      startPage = 1;
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      startPage = totalPages - 4;
    } else {
      // In the middle
      startPage = currentPage - 2;
    }

    // Update page numbers
    for (let i = 0; i < pageLinks.length; i++) {
      const pageNum = startPage + i;
      pageLinks[i].textContent = pageNum;

      // Store the actual page number as a data attribute
      pageLinks[i].dataset.page = pageNum;
    }
  }

  // Function to show only rows for current page
  function displayTableRows() {
    // Hide all rows first
    tableRows.forEach((row) => {
      row.style.display = "none";
    });

    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, tableRows.length);

    // Show only rows for current page
    for (let i = startIndex; i < endIndex; i++) {
      if (tableRows[i]) {
        tableRows[i].style.display = "";
      }
    }
  }

  // Function to update active states
  function updateActiveStates() {
    // Remove active class from all page items
    document.querySelectorAll(".pagination .page-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Add active class to current page
    if (totalPages <= 5) {
      // Simple case: page number matches index
      if (pageLinks[currentPage - 1]) {
        pageLinks[currentPage - 1].closest("li").classList.add("active");
      }
    } else {
      // Complex case: find the link with matching data-page
      pageLinks.forEach((link) => {
        if (parseInt(link.dataset.page) === currentPage) {
          link.closest("li").classList.add("active");
        }
      });
    }

    // Update prev/next buttons active state
    const prevItem = prevLink.closest("li");
    const nextItem = nextLink.closest("li");

    if (currentPage === 1) {
      prevItem.classList.add("active");
    }

    if (currentPage === totalPages) {
      nextItem.classList.add("active");
    }
  }

  // Initialize pagination structure
  adjustPaginationLinks();

  // Add click handlers to page number links
  pageLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the page number from either text content or data attribute
      let pageNum;
      if (this.dataset.page) {
        pageNum = parseInt(this.dataset.page);
      } else {
        pageNum = parseInt(this.textContent);
      }

      if (pageNum && pageNum !== currentPage) {
        currentPage = pageNum;
        displayTableRows();
        updateActiveStates();
      }
    });
  });

  // Add click handler to previous button
  if (prevLink) {
    prevLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        displayTableRows();
        if (totalPages > 5) {
          updateVisiblePageNumbers();
        }
        updateActiveStates();
      }
    });
  }

  // Add click handler to next button
  if (nextLink) {
    nextLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        displayTableRows();
        if (totalPages > 5) {
          updateVisiblePageNumbers();
        }
        updateActiveStates();
      }
    });
  }

  // Initialize the display
  displayTableRows();
  updateActiveStates();
});

