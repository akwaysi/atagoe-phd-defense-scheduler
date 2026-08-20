// ==========================================================
// Akwasi Tagoe PhD Dissertation Defense Scheduler
// Email submission using FormSubmit
// ==========================================================

const FORM_ENDPOINT =
  "https://formsubmit.co/ajax/atagoe@uark.edu";

const TIME_ZONE_LABEL = "Central Time";

const DEFENSE_TITLE =
  "Unmanned Aerial Vehicle Assisted Blackberry Feature Quantification";

const form = document.getElementById("availabilityForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");
const comments = document.getElementById("comments");

// IMPORTANT:
// The meeting address is read directly from index.html.
// JavaScript does NOT overwrite it anymore.
const meetingAddress =
  document.getElementById("meetingAddress").textContent.trim();

function getSelectedAvailability() {
  return [
    ...document.querySelectorAll(
      'input[name="availability"]:checked'
    )
  ].map((box) => ({
    date: box.dataset.date,
    time: box.dataset.time
  }));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.className = "message";
  message.textContent = "";

  const professor =
    document.querySelector(
      'input[name="professor"]:checked'
    )?.value || "";

  const availability =
    getSelectedAvailability();

  if (!professor) {
    message.className = "message error";
    message.textContent = "Please select your name.";
    return;
  }

  if (availability.length === 0) {
    message.className = "message error";
    message.textContent =
      "Please select at least one available time.";
    return;
  }

  const availabilityText =
    availability
      .map(
        (slot) =>
          `${slot.date} — ${slot.time}`
      )
      .join("\n");

  const submission = {
    "_subject":
      `PhD Defense Availability - ${professor}`,

    "_template":
      "table",

    "Professor":
      professor,

    "Dissertation Title":
      DEFENSE_TITLE,

    "Meeting Address":
      meetingAddress,

    "Available Times":
      availabilityText,

    "Comments":
      comments.value.trim() || "No comments",

    "Time Zone":
      TIME_ZONE_LABEL
  };

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    const response = await fetch(
      FORM_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(submission)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Submission failed."
      );
    }

    message.className = "message success";
    message.textContent =
      `Thank you, ${professor}. Your availability has been submitted.`;

    form.reset();

  } catch (error) {
    console.error(error);

    message.className = "message error";
    message.textContent =
      "Your response could not be submitted. Please try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Availability";
  }
});
