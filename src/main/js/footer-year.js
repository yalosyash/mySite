/* Год в футере: обновляется при загрузке страницы,
   чтобы не править разметку каждый январь. */
const yearElement = document.getElementById("year");

if (yearElement) {
  const currentYear = String(new Date().getFullYear());

  yearElement.textContent = currentYear;
  yearElement.setAttribute("datetime", currentYear);
}
