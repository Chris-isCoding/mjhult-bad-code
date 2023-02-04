// TODO: move to one large class.

/**
 * Handles the rendering of all components
 * @param {HTMLElement} element
 */
function Renderer(element) {
  console.log(element);
  if (!element) throw new Error("No element specified.");
  this.element = element;
  this.rendered = [];
  const that = this;

  /**
   * Renders an element.
   * @param {HTMLElement} element
   * @returns
   */
  this.render = function (element) {
    if (!element) return;
    this.rendered.push({ element, id: this.rendered.length });
    this.element.appendChild(element);
  };

  this.remove = function (id) {
    if (this.rendered.length <= 1) this.rendered.length = 0;
    this.rendered = this.rendered.filter((el) => el.id !== id);
    this.reRender();
  };

  this.reRender = function () {
    this.element.innerHTML = "";
    const tmp = [...this.rendered];
    this.rendered = [];
    tmp.forEach(function (el) {
      that.render(el.element);
    });
  };
}

/**
 * Create an element or element with children from an object
 * @type {type: string, className: undefined | string, onClick: () => void | undefined, children: undefined | Element[] | string} Element
 * @param {Element} element
 */
function Element(element) {
  const elm = document.createElement(element.type);

  if (element.className) elm.className = element.className;

  if (element.onClick) elm.onclick = element.onClick;

  if (!element.children) return elm;

  if (Array.isArray(element.children)) {
    element.children.forEach((child) => elm.appendChild(Element(child)));
  }

  if (typeof element.children === "string") elm.innerHTML = element.children;

  return elm;
}

/**
 * Create a new item "component"
 */
function Item(title, desc) {
  if (!title) throw new Error("No title specified");
  this.title = title;
  this.desc = desc || "";
  // this.id = null;

  // This janky way of binding this to an onClick... lol
  const that = this;

  this.element = function (id) {
    // if (!id && id !== 0) throw new Error("Missing ID");
    // this.id = id;

    const item = {
      type: "div",
      children: [
        { type: "h1", children: this.title },
        { type: "p", children: this.desc },
        { type: "button", onClick: that.remove.bind(that), children: "Done" },
      ],
    };

    console.log(`Rendered new item: ${title}`);

    return Element(item);
  };

  this.create = function () {
    fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: this.title, desc: this.desc }),
    })
      .then(() => console.log(`Created new item: ${title}`))
      .catch((e) => console.log(`Error creating item in database: ${e}`));
  };

  this.remove = function () {
    fetch("/api/items", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: this.title, desc: this.desc }),
    })
      .then((d) => {
        if (d.status !== 200) throw new Error("Item deletion failed.");
        console.log(`Removed item: ${this.title}`);
      })
      .catch((e) => console.log(`Error removing item from database: ${e}`));

    renderer.remove(this.id);
    console.log("removed ", this.id);
  };
}

const renderer = new Renderer(document.querySelector(".Items"));
// Register event listeners
document.querySelector("#CardSubmit").addEventListener("click", () => {
  const title = document.querySelector("#Title");
  const desc = document.querySelector("#Desc");
  const item = new Item(title.value, desc.value);
  renderer.render(item.element(renderer.rendered.length));
  item.create();
  title.value = "";
  desc.value = "";
});

const init = (items) => {
  items.forEach((item) => {
    const itemEl = new Item(item.title, item.desc);
    renderer.render(itemEl.element(renderer.rendered.length));
  });
};

fetch("/api/items")
  .then((d) => {
    if (d.status !== 200) throw new Error("Status not 200.");
    return d.json();
  })
  .then((d) => init(d))
  .catch((e) => console.log(`Error getting items: ${e}`));

// init([{ title: "test", desc: "test" }, { title: "test1" }]);
