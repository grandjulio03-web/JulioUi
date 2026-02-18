









/* -------------------- Color Themes -------------------- */
.field.ace,
.select.ace,
.textarea.ace,
.search.ace {
  border-color: #72b0d7;
}

.field.ace:focus,
.select.ace:focus,
.textarea.ace:focus,
.search.ace:focus {
  border-color: #72b0d7;
  box-shadow: 0 0 0 3px rgba(114, 176, 215, 0.2);
}

.field.beta,
.select.beta,
.textarea.beta,
.search.beta {
  border-color: #d94f8b;
}

.field.beta:focus,
.select.beta:focus,
.textarea.beta:focus,
.search.beta:focus {
  border-color: #d94f8b;
  box-shadow: 0 0 0 3px rgba(217, 79, 139, 0.2);
}

.field.gamma,
.select.gamma,
.textarea.gamma,
.search.gamma {
  border-color: #FF8F4B;
}

.field.gamma:focus,
.select.gamma:focus,
.textarea.gamma:focus,
.search.gamma:focus {
  border-color: #FF8F4B;
  box-shadow: 0 0 0 3px rgba(255, 143, 75, 0.2);
}

.field.delta,
.select.delta,
.textarea.delta,
.search.delta {
  border-color: #6DC9A7;
}

.field.delta:focus,
.select.delta:focus,
.textarea.delta:focus,
.search.delta:focus {
  border-color: #6DC9A7;
  box-shadow: 0 0 0 3px rgba(109, 201, 167, 0.2);
}

/* -------------------- Special Effects -------------------- */
.field.glass,
.select.glass,
.textarea.glass,
.search.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-color: rgba(229, 231, 235, 0.3);
}

.field.neon,
.select.neon,
.textarea.neon,
.search.neon {
  border: 2px solid #72b0d7;
  box-shadow: 0 0 10px rgba(114, 176, 215, 0.3);
}

.field.neon:focus,
.select.neon:focus,
.textarea.neon:focus,
.search.neon:focus {
  box-shadow: 0 0 20px rgba(114, 176, 215, 0.5);
}

.field.soft,
.select.soft,
.textarea.soft,
.search.soft {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.5);
}

.field.flat,
.select.flat,
.textarea.flat,
.search.flat {
  border: none;
  border-bottom: 2px solid #e5e7eb;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
  background: transparent;
}

.field.flat:focus,
.select.flat:focus,
.textarea.flat:focus,
.search.flat:focus {
  border-bottom-color: #72b0d7;
  box-shadow: none;
}

.field.minimal,
.select.minimal,
.textarea.minimal,
.search.minimal {
  border: 1px solid #f3f4f6;
  background: rgba(249, 250, 251, 0.5);
}

.field.minimal:focus,
.select.minimal:focus,
.textarea.minimal:focus,
.search.minimal:focus {
  background: transparent;
  border-color: #72b0d7;
}

/* -------------------- Textarea Specific -------------------- */
.textarea {
  min-height: 100px;
  resize: vertical;
}

/* -------------------- Select Specific -------------------- */
.select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
  width: 100%;
}

/* -------------------- Range Class -------------------- */
.range {
  width: 100%;
}

/* -------------------- Search Specific -------------------- */
.search {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%236b7280' d='M11 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-1 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0zm2.5 5.5l-3-3' stroke='%236b7280' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 1rem center;
  padding-left: 3rem;
}

/* -------------------- File Input -------------------- */
.file {
  position: relative;
  cursor: pointer;
}

.file::before {
  content: "Choose file";
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.file::-webkit-file-upload-button {
  visibility: hidden;
}

/* -------------------- Radio & Checkbox -------------------- */
.radio,
.checkbox {
  width: auto;
  margin-right: 0.5rem;
}

.radio[type=radio] {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
}

.radio[type=radio]:checked {
  border-color: #72b0d7;
}

.radio[type=radio]:checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #72b0d7;
  border-radius: 50%;
}

.checkbox[type=checkbox] {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
}

.checkbox[type=checkbox]:checked {
  border-color: #72b0d7;
  background: #72b0d7;
}

.checkbox[type=checkbox]:checked::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}
