module.exports = {
  slugify: (string) => {
    const s = String(string)
    const part_1 = s.split(" ").join("-").replace(/\//g, "-")
    const timestamp = new Date().getTime()
    const slug = part_1 + "-" + timestamp
    return slug
  },
  returnFullState: (code) => {
    let fullState
    switch (code) {
      case "NSW":
        fullState = "New South Wales (NSW)"
        break
      case "NT":
        fullState = "Northern Territory (NT)"
        break
      case "QLD":
        fullState = "Queensland (QLD)"
        break
      case "SA":
        fullState = "South Australia (SA)"
        break
      case "TAS":
        fullState = "Tasmania (TAS)"
        break
      case "VIC":
        fullState = "Victoria (VIC)"
        break
      case "WA":
        fullState = "Western Australia (WA)"
        break
      default:
        fullState = null
    }

    return fullState
  },
  properCaseTransform: (string) => {
    let split = string.split(" ")
    let items = split.map(
      (item) => item.charAt(0).toUpperCase() + item.substr(1).toLowerCase()
    )
    let newString = items.join(" ")
    return newString
  },
  randomItemsFromArray: (array) => {
    let length = array.length > 7 ? 7 : array.length
    let itemsToTake = Math.floor(Math.random() * length) + 1
    return array.slice(0, itemsToTake)
  },
  randomItemFromArray: (array) => {
    let length = array.length
    let index = Math.floor(Math.random() * length)
    return array[index]
  },
  randomLowSalary: () => Math.floor(Math.random() * 10000),
  randomHighSalary: () => Math.floor(Math.random() * 250000),
  getPassword: () =>
    "$2b$10$U28Rw6QVdclrP66rg/PJquwegIOlCTSckx93RDW8EY.GiyZw2Kedq",
  randomText: () =>
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
}
