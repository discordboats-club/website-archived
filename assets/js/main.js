console.log("%c🚫 Warning! 🚫", "color: red; font-weight: bold; font-size: x-large");
console.log("%cTyping anything here could make bad stuff happen!", "color: #e91e63; font-size: large");

document.querySelectorAll("select").forEach(ele => {
  M.FormSelect.init(ele);
});
