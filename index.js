const toJSON = (x) => x.json();
const toHTML = (tag, x, attr = "") => `<${tag} ${attr}>${x}</${tag}>`;
const display = (el, content, method = "textContent") => (el[method] = content);
const applyCss = (el, prop, value) => (el.style[prop] = value);
const getState = (state) => JSON.parse(JSON.stringify(state));
const setState = (state, newState) => {
  for (const key in newState) {
    if (key in state) {
      state[key] = newState[key];
    }
  }
};

const url = "https://quote-garden.herokuapp.com/api/v3";
const getBlockQuote = () => ({
  random: fetch(`${url}/quotes/random`).then(toJSON),
  byAuthor: (search) => fetch(`${url}/quotes?${search}`).then(toJSON),
});

const app = () => {
  const state = { infoQuote: {} };

  const randomBtn = document.getElementById("randomBtn");
  const blockQuote = document.getElementById("blockQuote");
  const authorText = document.getElementById("authorText");
  const authorTitle = document.getElementById("authorTitle");
  const listQuotes = document.getElementById("listQuotes");
  const sectionQuote = document.getElementById("quote");
  const sectionAuthorQuotes = document.getElementById("authorQuotes");

  const displayQuote = async () => {
    const {
      data: [quote],
    } = getBlockQuote().random;

    applyCss(sectionQuote, "display", "flex");
    applyCss(sectionAuthorQuotes, "display", "none");

    setState(state, { infoQuote: quote });

    display(blockQuote, `"${getState(state).infoQuote.quoteText}"`);
    display(
      authorText,
      `${getState(state).infoQuote.quoteAuthor}
        <span class="material-icons">trending_flat</span>
        `,
      "innerHTML"
    );
  };

  displayQuote();

  randomBtn.addEventListener("click", displayQuote);

  authorText.addEventListener("click", async () => {
    const { data } = await getBlockQuote().byAuthor(
      `author=${getState(state).infoQuote.quoteAuthor}`
    );
    applyCss(sectionAuthorQuotes, "display", "block");
    applyCss(sectionQuote, "display", "none");

    const htmlList = data
      .map((quote) => toHTML("li", quote.quoteText, "class=blockquote"))
      .join("");

    display(authorTitle, getState(state).infoQuote.quoteAuthor);
    display(listQuotes, htmlList, "innerHTML");
  });
};

document.addEventListener("DOMContentLoaded", app);
