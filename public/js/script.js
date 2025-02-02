window.onload = function() {
    const terminal = document.getElementById('terminal');
    const commands = [
        "Initializing hack... Please wait...",
        "Accessing systems...",
        "Bypassing security protocols...",
        "Found your location...",
        "Your IP: %ip%",
        "Your OS: %os% %osVersion%",
        "Your Browser: %browser%",
        "Your ISP: %isp%",
        "Your Timezone: %timezone%",
        "We see you, %location%...",
        "Injecting payload...",
        "Downloading sensitive data...",
        "ERROR! SYSTEM COMPROMISED!",
        "Transferring files...",
        "Transfer complete. You are now being watched..."
    ];

    const replacePlaceholders = (text, data) => {
        return text.replace('%ip%', data.ip)
            .replace('%location%', data.location)
            .replace('%os%', data.os)
            .replace('%osVersion%', data.osVersion)
            .replace('%browser%', data.browser)
            .replace('%isp%', data.isp)
            .replace('%timezone%', data.timezone);
    };

    fetch('/visitor-data')
        .then(response => response.json())
        .then(data => {
            let currentIndex = 0;

            const typeLine = () => {
                if (currentIndex < commands.length) {
                    let text = replacePlaceholders(commands[currentIndex], data);
                    
                    if (text.includes("ERROR")) {
                        text = `<span class="warning">${text}</span>`;
                    }

                    terminal.innerHTML += "root@hacked:~$ " + text + "<br>";
                    currentIndex++;
                    setTimeout(typeLine, 2000);
                }
            };
            typeLine();
        })
        .catch(error => {
            console.error('❌ Error fetching visitor data:', error.message);
            terminal.innerHTML += `<span class="warning">⚠️ Error fetching visitor info.</span>`;
        });
};
