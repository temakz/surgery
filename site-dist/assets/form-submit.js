(function () {
  var FORM_PATH = "/send-form.php";
  var SENDING_TEXT = "Отправляем…";
  var SUCCESS_MESSAGE = "Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.";
  var FALLBACK_ERROR_MESSAGE = "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с клиникой по телефону.";

  function isHandledForm(form) {
    if (!form || !form.action) return false;
    try {
      return new URL(form.action, window.location.href).pathname === FORM_PATH;
    } catch (error) {
      return form.getAttribute("action") === FORM_PATH;
    }
  }

  function submitButtons(form) {
    return Array.prototype.slice.call(form.querySelectorAll('button[type="submit"], input[type="submit"]'));
  }

  function setButtonText(button, text) {
    if (button.tagName === "INPUT") {
      if (!button.dataset.formSubmitOriginalText) button.dataset.formSubmitOriginalText = button.value || "";
      button.value = text;
      return;
    }

    if (!button.dataset.formSubmitOriginalText) button.dataset.formSubmitOriginalText = button.textContent || "";
    button.textContent = text;
  }

  function restoreButtonText(button) {
    var original = button.dataset.formSubmitOriginalText;
    if (typeof original !== "string") return;

    if (button.tagName === "INPUT") {
      button.value = original;
    } else {
      button.textContent = original;
    }
    delete button.dataset.formSubmitOriginalText;
  }

  function setSubmitting(form, isSubmitting) {
    if (isSubmitting) {
      form.dataset.formSubmitState = "submitting";
    } else {
      delete form.dataset.formSubmitState;
    }
    form.classList.toggle("form-submit-is-sending", isSubmitting);

    submitButtons(form).forEach(function (button) {
      if (isSubmitting) {
        button.dataset.formSubmitWasDisabled = button.disabled ? "true" : "false";
        button.disabled = true;
        button.classList.add("form-submit-button--busy");
        setButtonText(button, SENDING_TEXT);
        return;
      }

      button.disabled = button.dataset.formSubmitWasDisabled === "true";
      button.classList.remove("form-submit-button--busy");
      restoreButtonText(button);
      delete button.dataset.formSubmitWasDisabled;
    });
  }

  function statusBlock(form) {
    var existing = form.querySelector(".form-submit-status");
    if (existing) return existing;

    var status = document.createElement("div");
    status.className = "form-submit-status";
    status.hidden = true;
    status.tabIndex = -1;
    status.setAttribute("aria-live", "polite");

    var button = form.querySelector('button[type="submit"], input[type="submit"]');
    if (button && button.parentNode) {
      button.insertAdjacentElement("afterend", status);
    } else {
      form.appendChild(status);
    }

    return status;
  }

  function showStatus(form, type, message) {
    var status = statusBlock(form);
    var isError = type === "error";

    status.textContent = message;
    status.hidden = false;
    status.classList.remove("form-submit-status--success", "form-submit-status--error", "form-submit-status--pending");
    status.classList.add("form-submit-status--" + type);
    status.setAttribute("role", isError ? "alert" : "status");
    status.setAttribute("aria-live", isError ? "assertive" : "polite");
    if (type !== "pending") status.focus({ preventScroll: false });
  }

  function safeMessage(value) {
    if (typeof value !== "string") return "";
    var text = value.trim();
    if (!text || text.length > 260) return "";
    if (/^[a-z0-9_.:-]+$/i.test(text)) return "";
    return text;
  }

  function parseJsonResponse(response) {
    return response.text().then(function (text) {
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch (error) {
        return null;
      }
    });
  }

  function syncReviewProcedureOther(form) {
    var select = form.querySelector('[name="procedure"]');
    var wrap = form.querySelector("#review-procedure-other-wrap");
    var other = form.querySelector('[name="procedure_other"]');
    if (!select || !wrap || !other) return;

    var isOther = select.value === "Другое";
    wrap.hidden = !isOther;
    other.disabled = !isOther;
    other.required = isOther;
    if (!isOther) other.value = "";
  }

  function bindReviewProcedureOther(form) {
    var select = form.querySelector('[name="procedure"]');
    if (!select) return;

    select.addEventListener("change", function () {
      syncReviewProcedureOther(form);
    });

    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        syncReviewProcedureOther(form);
      }, 0);
    });

    syncReviewProcedureOther(form);
  }

  function bindForm(form) {
    if (!isHandledForm(form) || form.dataset.formSubmitBound === "true") return;
    form.dataset.formSubmitBound = "true";
    bindReviewProcedureOther(form);

    form.addEventListener("submit", function (event) {
      if (form.dataset.formSubmitState === "submitting") {
        event.preventDefault();
        return;
      }

      if (!form.checkValidity()) return;

      event.preventDefault();
      setSubmitting(form, true);
      showStatus(form, "pending", SENDING_TEXT);

      fetch(form.action, {
        method: (form.method || "POST").toUpperCase(),
        body: new FormData(form),
        credentials: "same-origin",
        headers: {
          Accept: "application/json"
        }
      })
        .then(function (response) {
          return parseJsonResponse(response).then(function (data) {
            if (response.ok && (!data || data.ok !== false)) {
              form.reset();
              syncReviewProcedureOther(form);
              showStatus(form, "success", SUCCESS_MESSAGE);
              return;
            }

            showStatus(form, "error", safeMessage(data && data.message) || FALLBACK_ERROR_MESSAGE);
          });
        })
        .catch(function () {
          showStatus(form, "error", FALLBACK_ERROR_MESSAGE);
        })
        .finally(function () {
          setSubmitting(form, false);
        });
    });
  }

  document.querySelectorAll("form").forEach(bindForm);
})();
