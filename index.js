// index.js
document.addEventListener("DOMContentLoaded", () => {
    // Theme toggle functionality
    const toggle = document.getElementById("theme-toggle");
    const currentHour = new Date().getHours();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");

    // Set initial theme
    if (savedTheme) {
        document.body.classList.toggle("dark-theme", savedTheme === "dark");
        toggle.checked = savedTheme === "dark";
    } else {
        const autoDark = prefersDark || (currentHour < 7 || currentHour >= 21);
        document.body.classList.toggle("dark-theme", autoDark);
        toggle.checked = autoDark;
        localStorage.setItem("theme", autoDark ? "dark" : "light");
    }

    // Theme toggle event
    toggle.addEventListener("change", () => {
        const isDark = toggle.checked;
        document.body.classList.toggle("dark-theme", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // Load comments
    const commentsList = document.getElementById("comments-list");
    
    fetch("https://jsonplaceholder.typicode.com/posts/18/comments")
        .then(response => {
            if (!response.ok) throw new Error("Не вдалося завантажити відгуки");
            return response.json();
        })
        .then(comments => {
            comments.forEach(comment => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${comment.name}</strong> (${comment.email})<br>
                    <p>${comment.body}</p>
                `;
                commentsList.appendChild(li);
            });
        })
        .catch(error => {
            commentsList.innerHTML = `<li>⚠️ Помилка: ${error.message}</li>`;
        });

    // System info
    const systemInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        languages: navigator.languages,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        cookies: navigator.cookieEnabled ? "Увімкнено" : "Вимкнено",
        online: navigator.onLine ? "Онлайн" : "Офлайн"
    };

    localStorage.setItem("systemInfo", JSON.stringify(systemInfo));
    
    const systemInfoElement = document.getElementById("systemInfo");
    systemInfoElement.textContent = `
        Браузер: ${systemInfo.userAgent}
        Платформа: ${systemInfo.platform}
        Мови: ${systemInfo.languages.join(", ")}
        Розмір екрану: ${systemInfo.screenSize}
        Viewport: ${systemInfo.viewport}
        Cookies: ${systemInfo.cookies}
        Статус: ${systemInfo.online}
    `.trim();

    // Show feedback modal after delay
    setTimeout(() => {
        if (!localStorage.getItem("feedbackShown")) {
            document.getElementById("feedbackModal").style.display = "flex";
            localStorage.setItem("feedbackShown", "true");
        }
    }, 10000); // 10 seconds
});

// Close modal function
function closeModal() {
    document.getElementById("feedbackModal").style.display = "none";
}