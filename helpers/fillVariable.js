function fillTemplate(templateText, values = []) {
  let filledText = templateText;
  values.forEach((value) => {
    filledText = filledText.replace("{#var#}", value);
  });
  return filledText;
}
module.exports = { fillTemplate };
