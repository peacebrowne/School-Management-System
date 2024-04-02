// Toggle password visibilty
htmx.on("#password-visibility", "click", (event) => {
  const targetElement = event.target;
  const targetElementClass = Array.from(targetElement.classList);

  if (targetElementClass.includes("svg")) {
    const togglePasswordVisibility = htmx.closest(
      htmx.find(".relative"),
      "div"
    );

    const inputElement = htmx.find(togglePasswordVisibility, "input");

    // Toggle the input type between "password" and "text"
    inputElement.type = inputElement.type === "password" ? "text" : "password";

    const visibleSvg = targetElement;
    const hiddenSvg = htmx.find(togglePasswordVisibility, ".hidden");

    // Toggle icon between show and hidden
    htmx.toggleClass(hiddenSvg, "hidden");
    htmx.toggleClass(visibleSvg, "hidden");
  }
});
