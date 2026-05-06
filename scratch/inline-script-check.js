
    const form = document.querySelector("#auditForm");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.querySelector("#name").value.trim();
      const email = document.querySelector("#email").value.trim();
      const auditType = document.querySelector("#auditType").value;
      const message = document.querySelector("#message").value.trim();

      const body = [
        "Hi BugAuraLabs,",
        "",
        "I want to request a QA audit.",
        "",
        `Name: ${name || "Not provided"}`,
        `Email: ${email || "Not provided"}`,
        `Audit type: ${auditType}`,
        "",
        "Product URL and launch context:",
        message || "Not provided yet",
        "",
        "Please suggest the scope, access needed, turnaround, and price range."
      ].join("\n");

      const subject = encodeURIComponent(`BugAuraLabs QA Audit Request - ${auditType}`);
      const encodedBody = encodeURIComponent(body);
      window.location.href = `mailto:jaswanth.mk63@gmail.com?subject=${subject}&body=${encodedBody}`;
    });
  
