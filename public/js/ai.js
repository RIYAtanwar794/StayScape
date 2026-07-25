const aiBtn = document.getElementById("generateAI");

if (aiBtn) {

    aiBtn.addEventListener("click", async () => {

        const title = document.getElementById("title").value;
        const location = document.getElementById("location").value;
        const country = document.getElementById("country").value;

        if (!title || !location || !country) {
            alert("Please enter Title, Location and Country first.");
            return;
        }

        aiBtn.disabled = true;
        aiBtn.innerText = "Generating...";

        try {
            const response = await fetch("/listings/generate-description", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    location,
                    country,
                }),
            });

            const data = await response.json();

            if (data.success) {
                document.getElementById("description").value =
                    data.description;
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }

        aiBtn.disabled = false;
        aiBtn.innerText = "✨ Generate with AI";
    });
}