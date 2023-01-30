function _setPoperty(_var, _value) {
  document.documentElement.style.setProperty(_var, _value);
}

function _set_style(regular, c01, c02, c03, cp, cpp) {
  _setPoperty("--cc-regular", regular);
  _setPoperty("--cc-01", c01);
  _setPoperty("--cc-02", c02);
  _setPoperty("--cc-03", c03);
  _setPoperty("--cc-p", cp);
  _setPoperty("--cc-pp", cpp);
}

function setColorGroup() {
  element = document.getElementById("element").innerHTML;
  switch (element) {
    case "火":
      _set_style(
        "#B8584B",
        "#F1DEDB",
        "#E3BCB7",
        "#D49B93",
        "#8B4137",
        "#5D2B25"
      );
      break; //火
    case "水":
      _set_style(
        "#518ABB",
        "#DCE8F1",
        "#B9D0E4",
        "#97B9D6",
        "#386891",
        "#264560"
      );
      break; //水
    case "风":
      _set_style(
        "#378383",
        "#D1ECEC",
        "#A4D9D9",
        "#76C6C6",
        "#296262",
        "#1B4242"
      );
      break; //风
    case "岩":
      _set_style(
        "#C09257",
        "#F2E9DD",
        "#E6D3BC",
        "#D9BE9A",
        "#986F39",
        "#654A26"
      );
      break; //岩
    case "雷":
      _set_style(
        "#6455A6",
        "#E0DDED",
        "#C1BADC",
        "#A298CA",
        "#4B407D",
        "#322A53"
      );
      break; //雷
    case "冰":
      _set_style(
        "#68BFD8",
        "#E1F2F7",
        "#C3E5EF",
        "#A4D9E8",
        "#319FBF",
        "#216A7F"
      );
      break; //冰
    case "草":
      _set_style(
        "#6D9840",
        "#E2EED6",
        "#C5DCAC",
        "#A8CB83",
        "#527230",
        "#364C20"
      );
      break; //草
    default:
      _set_style(
        "#44546A",
        "#D6DCE5",
        "#ADB9CA",
        "#8497B0",
        "#333F50",
        "#222A35"
      ); // default blackblue
  }
}
