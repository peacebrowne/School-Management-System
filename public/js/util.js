/**
 * Removes a classname from an html element
 * @param {Element} element - The HTML element to which the class name should be removed.
 * @param {string} className - The class name to be removed
 */
function removeClass(element, className) {
  if (!element || !element.classList) {
    return;
  }

  element.classList.remove(className);
}

/**
 * Adds the specified class name to the provided HTML element.
 *
 * @param {Element} element - The HTML element to which the class name should be added.
 * @param {string} className - The class name to add.
 */
const addClass = (element, className) => element.classList.add(className);

/**
 * Toggles the visibility of an element by adding or removing the specified class name.
 *
 * @param {Element} element - The element whose visibility should be toggled.
 * @param {string} className - The class name to toggle.
 */
const toggleVisibility = (element, className) =>
  element.classList.toggle(className);

/**
 * Retrieves an element from the document by matching its selector value.
 *
 * @param {string} selector - The value of the selector to match when retrieving the element.
 * @returns {Element | null} - The element found with the matching selector value, or null if no element is found.
 */
const getElement = (selector) => document.querySelector(`${selector}`);

/**
 * Retrieves a collection of elements from the document based on the provided selector.
 *
 * @param {string} selector - The CSS selector or element name to match when retrieving elements.
 * @returns {NodeList | null} - A collection of elements matching the selector, or null if no elements are found.
 */
const getElementAll = (selector) => document.querySelectorAll(`${selector}`);

/**
 * Resets the values of all form elements within the provided collection.
 *
 * @param {HTMLCollection | NodeList} formElements - A collection of form elements to be reset.
 */

function resetForm(formElements) {
  for (const element of formElements) {
    if (
      element.type === "text" ||
      element.type === "textarea" ||
      element.type === "password"
    ) {
      element.value = "";
    } else if (element.type === "checkbox" || element.type === "radio") {
      element.checked = false;
    } else if (element.type === "select") {
      element.selectedIndex = 0;
    }
  }
}

/**
 * Generating random colors for user's friends
 */
function frdBgColor() {
  const randomColor = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 256)
  );
  return `rgb(${randomColor.join(", ")})`;
}

/**
 * Handles user redirection and manages active user data.
 *
 * @param {string} page - The URL of the page to redirect to.
 * @param {string} id - The identifier of the active user.
 */
function redirect(page, id) {
  // Check if an active user is already set
  const active = localStorage.getItem("active");

  // If an active user is present, clear the active user data
  if (active) {
    localStorage.removeItem("active");
    localStorage.removeItem("account");
  }

  // Set the active user data
  localStorage.setItem("active", "true");
  localStorage.setItem("account", JSON.stringify(id));

  // Redirect the user to the specified page
  location.replace(page);
}

const formattedNumber = (number) => new Intl.NumberFormat().format(number);
