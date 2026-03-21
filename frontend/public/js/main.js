const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;

  const resultDiv = document.getElementById('searchResult');
  resultDiv.innerHTML = "Searching...";

  try {
    const response = await fetch(`http://localhost:5000/api/search?username=${username}`);
    const data = await response.json();

    resultDiv.innerHTML = `
      <p>Username: ${data.username}</p>
      <p>Status: ${data.status}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = "Server error.";
  }
});

document.getElementById("ctaButton").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});