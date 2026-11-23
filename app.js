(function () {
"use strict";

const inNode = typeof module !== "undefined" && module.exports;
const verses = inNode ? require("./data/verses.js") : globalThis.kjvVerses;
const draftLabel = "AI-assisted draft — review, pray over, and edit before preaching";
const reviewNote = "You remain responsible for the message. Check every verse in your own Bible and read it in context.";

const bookNames = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalm", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum",
  "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians",
  "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];
const aliases = new Map(bookNames.map((book) => [book.toLowerCase(), book]));
for (const [book, shortNames] of Object.entries({
  Genesis: "ge gen gn", Exodus: "ex exod", Psalm: "ps psa pss psalm psalms", Proverbs: "pr prov",
  Isaiah: "is isa", Lamentations: "lam", Micah: "mic", Matthew: "mt matt", Mark: "mk mrk",
  Luke: "lk luk", John: "jn jhn joh", Romans: "ro rom", Ephesians: "ep eph",
  Philippians: "php phil", Colossians: "col", Hebrews: "heb", James: "jas jm",
  "1 Peter": "1pet 1pe", "2 Corinthians": "2cor", "1 Thessalonians": "1thess 1th",
  "1 John": "1jn 1jhn 1joh", "2 John": "2jn 2jhn 2joh", "3 John": "3jn 3jhn 3joh"
})) {
  for (const name of shortNames.split(" ")) {
    aliases.set(name.replace(/^(\d)\s*/, "$1 "), book);
  }
}

function parseReference(input) {
  const match = /^(.*?)\s*(\d+)(?:\s*:\s*(\d+)(?:\s*[-–—]\s*(\d+))?)?$/u.exec(
    input.trim().toLowerCase().replace(/\./g, "")
  );
  if (!match) return null;
  const book = aliases.get(match[1].replace(/\s+/g, " ").replace(/^([1-3])\s*/, "$1 "));
  const chapter = Number(match[2]);
  const start = match[3] ? Number(match[3]) : null;
  const end = match[4] ? Number(match[4]) : start;
  if (!book || !Number.isSafeInteger(chapter) || chapter < 1 ||
      (start !== null && (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start))) {
    return null;
  }
  return { book, chapter, start, end };
}

const locations = verses.map((verse) => ({ verse, ...parseReference(verse.reference) }));

function lookupByReference(input) {
  const ref = parseReference(input);
  if (!ref) return [];
  return locations.filter(({ book, chapter, start }) =>
    book === ref.book && chapter === ref.chapter && (ref.start === null || (start >= ref.start && start <= ref.end))
  ).sort((a, b) => a.start - b.start).map(({ verse }) => verse);
}

const topicAliases = {
  forgive: "forgiveness", forgiven: "forgiveness", forgiving: "forgiveness",
  suffering: "suffering", suffer: "suffering", grief: "suffering", loss: "suffering",
  trials: "suffering", trial: "suffering", hardship: "suffering", anxiety: "peace",
  anxious: "peace", pray: "prayer", praying: "prayer", believe: "faith", believing: "faith",
  salvation: "salvation", saved: "salvation", thankful: "gratitude", thanksgiving: "gratitude"
};
const topics = new Set(verses.flatMap((verse) => verse.topics));
const ignoredWords = new Set("a an and are as be by for from how i in is it my of on or that the their them this to us we what when with you your".split(" "));
const words = (value) => value.toLowerCase().match(/[a-z]+/g) ?? [];
const queryWords = (query) => [...new Set(words(query).filter((word) => !ignoredWords.has(word)))];
const topicFor = (word) => Object.hasOwn(topicAliases, word) ? topicAliases[word] : word;

function searchByKeyword(query) {
  const terms = queryWords(query);
  return verses.map((verse) => {
    const text = words(verse.text);
    const score = terms.reduce((total, term) => total + (verse.topics.includes(topicFor(term)) ? 4 : 0)
      + (text.includes(term) ? 1 : 0), 0);
    return { verse, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).map(({ verse }) => verse);
}

function referenceNotice(ref, matches) {
  if (!matches.length) return "That passage isn’t in this small KJV library.";
  if ((ref.start === null && !(ref.book === "Psalm" && ref.chapter === 23)) ||
      (ref.start !== null && matches.length !== ref.end - ref.start + 1)) {
    return "Only the verses in this library are shown. Read the full passage in your own Bible.";
  }
  return "";
}

function lookupVerses(input) {
  const ref = parseReference(input);
  const matches = ref ? lookupByReference(input) : searchByKeyword(input);
  return { matches, notice: ref ? referenceNotice(ref, matches) :
    matches.length ? "" : "No matches in this small library. Try a reference such as John 3:16 or a topic such as hope." };
}

const studies = {
  "John 3:16": {
    title: "The Love That Gives",
    intro: "When we talk about love, we often start with a feeling. In Jesus’ conversation with Nicodemus, start instead with what God gives. Read John 3:14–21 in your Bible before opening up verse 16.",
    points: [
      ["Begin with the love of God", ["John 3:16"], "The verse begins with God’s love for the world. Notice that God acts first: he gives his Son rather than waiting for us to deserve the gift.", "Picture a meal brought to a household that could not repay the kindness. Let the simple contrast between gift and wages help the congregation hear the verse.", "Where do I still treat God’s love as something I must earn?"],
      ["See why the Son was sent", ["John 3:17"], "Verse 17 describes the saving purpose of the Son’s coming. Keep that purpose in view without ignoring what the surrounding verses say about unbelief.", "Imagine a rescue worker entering dangerous water to bring someone to safety. The worker’s purpose is rescue, not criticism from the shore.", "What fear keeps me from bringing a real need honestly to Christ?"],
      ["Let received love shape our love", ["1 John 4:19", "John 13:34"], "God’s prior love is the starting point for our love. Present care for our neighbor as a response to grace, not a way to purchase it.", "Picture someone making time for a lonely neighbor. Love becomes visible in the ordinary act of showing up.", "What one act of care could make received love visible this week?"]
    ],
    closing: "Invite people to respond to Christ in trusting prayer, then choose one concrete way to love a neighbor this week.",
    prayer: "Father, thank you for giving your Son. Help us trust Christ and extend the love we receive to those around us. Amen."
  },
  "Psalm 23": {
    title: "The Shepherd Who Stays",
    intro: "Invite the congregation to hear Psalm 23 as a whole before looking at its movements. The shepherd leads beside still waters and walks with the psalmist through a valley; the presence of one does not rule out the other.",
    points: [
      ["Receive the Shepherd’s care", ["Psalm 23:1", "Psalm 23:2", "Psalm 23:3"], "The psalm moves from provision and rest to restoration and guidance. The Shepherd’s care is not a promise that we will get everything we want.", "Picture a caregiver who notices exhaustion and makes space for someone to rest before asking them to carry on.", "Where do I resist receiving needed rest or help?"],
      ["Trust the Shepherd in the valley", ["Psalm 23:4"], "The valley is real. Notice how the psalmist turns from speaking about God to speaking to him. Comfort comes from the Shepherd’s presence, not from denying danger.", "Picture sitting with a grieving friend when there are no easy answers. Staying near can be more helpful than offering explanations.", "What valley could I name honestly in prayer? Who could walk alongside me?"],
      ["Look toward goodness and mercy", ["Psalm 23:5", "Psalm 23:6"], "The images shift to a generous host and a lasting welcome. Goodness and mercy belong beside the earlier picture of difficulty, not in place of it.", "Imagine an extra place set at the table for someone who worries there is no room for them.", "Where have I noticed mercy lately, and whom could I welcome this week?"]
    ],
    closing: "Invite each listener to name one burden before God and one person they could accompany, without asking anyone to disclose their burden publicly.",
    prayer: "Lord, our Shepherd, guide us in peace and stay near in the valley. Teach us to receive your care and share it with others. Amen."
  },
  forgiveness: {
    title: "Forgiveness Without Pretending",
    intro: "Acknowledge that wrongdoing has real consequences. Forgiveness is not calling harm acceptable, removing accountability, or requiring renewed contact. Invite listeners to consider where grace and truth belong together.",
    points: [
      ["Tell the truth before God", ["1 John 1:9"], "Confession means naming our own sin rather than defending it. John directs the hearer toward God’s faithfulness, not toward self-excusing or despair.", "Picture apologizing without adding a sentence that shifts the blame. Let the example concern your own responsibility, not someone else’s private story.", "What do I need to name honestly before God? Where would making amends be appropriate?"],
      ["Practice mercy without erasing the harm", ["Ephesians 4:32"], "Paul points to God’s forgiveness in Christ as the pattern for our conduct. Forgiveness does not make unsafe contact wise, restore trust immediately, or rule out seeking help and accountability.", "Picture declining to spread a hurtful story in retaliation while still speaking truthfully to someone who can help.", "What would a step away from retaliation look like while keeping wise boundaries?"],
      ["Take the next faithful step", ["Colossians 3:13"], "Forbearance and forgiveness shape life together. Avoid telling people on what timetable they must heal. Where harm is ongoing, encourage safety and appropriate support.", "Picture a trusted friend offering to listen and help someone find support rather than arranging a meeting they have not asked for.", "Who could offer wise support? What step is both faithful and safe?"]
    ],
    closing: "Invite quiet prayer and one safe, concrete next step: confess where appropriate, seek wise support, or ask for help resisting retaliation.",
    prayer: "Merciful God, give us courage to tell the truth, receive grace, and act with wisdom. Protect those who are hurting and teach us to show mercy without hiding harm. Amen."
  }
};

const byReference = new Map(verses.map((verse) => [verse.reference, verse]));

function makePoint([heading, references, explanation, illustration, questions]) {
  return {
    heading,
    citations: references.map((ref) => {
      const verse = byReference.get(ref);
      return `${verse.reference} (KJV) — “${verse.text}”`;
    }).join("\n"),
    explanation,
    illustration,
    questions
  };
}

function generateOutline(input) {
  const query = input.trim();
  const ref = parseReference(query);
  const anchors = ref ? lookupByReference(query) : [];
  const topical = ref ? [] : searchByKeyword(query);
  const fallback = !anchors.length && !topical.length;
  const study = ref && anchors.length === 6 && ref.book === "Psalm" && ref.chapter === 23 ? studies["Psalm 23"]
    : anchors[0]?.reference === "John 3:16" ? studies["John 3:16"]
    : !ref && queryWords(query).map(topicFor).join(" ") === "forgiveness" ? studies.forgiveness
    : null;
  const notice = fallback
    ? `${ref ? "That passage isn’t in this small KJV library." : "No matching verses were found in this small KJV library."} This draft uses a general selection on grace, hope, and love instead.`
    : ref ? referenceNotice(ref, anchors) : "";
  const base = {
    label: draftLabel,
    responsibility: reviewNote,
    notice
  };
  if (study) {
    return { ...base, title: study.title,
      scripture: anchors.length ? anchors.map((verse) => `${verse.reference} (KJV)`).join("; ") : "1 John 1:9; Ephesians 4:32; Colossians 3:13 (KJV)",
      introduction: study.intro, points: study.points.map(makePoint), closing: study.closing, prayer: study.prayer };
  }

  const mainTopic = queryWords(query).map(topicFor).find((word) => topics.has(word));
  const startingVerses = fallback ? ["Ephesians 2:8", "Romans 15:13", "1 John 4:19"].map((key) => byReference.get(key))
    : anchors.length ? anchors : topical;
  const related = searchByKeyword(startingVerses.flatMap((verse) => verse.topics).join(" "));
  const selected = [...new Set([...startingVerses, ...related, ...verses])].slice(0, 3);
  const focusTopic = fallback ? "grace, hope, and love" : mainTopic ?? selected[0].topics[0];
  const titleTheme = focusTopic[0].toUpperCase() + focusTopic.slice(1);
  const [first, second, third] = selected;
  const pointRows = [
    [`Read closely: ${first.reference}`, [first.reference],
      `Read ${first.reference} aloud in context. As you explore ${focusTopic}, explain who is speaking, what the speaker actually says, and how the surrounding verses set the scope of the passage.`,
      "Picture hearing a sentence without the conversation that came before it. Briefly illustrate how the surrounding words make a real difference to what you hear.",
      "What stands out when we read the surrounding verses? What assumption might the context correct?"],
    [`Connect carefully: ${second.reference}`, [second.reference],
      `Read ${second.reference} in its own setting. Compare what it says about ${second.topics[0]} with the first text. Name a point of connection and be honest about any differences.`,
      "Use two brief pictures of the same struggle from different viewpoints. Show how a second perspective can add insight without making the first disappear.",
      "What does this passage add, rather than merely repeat? What should we avoid promising on the strength of this verse?"],
    [`Respond with care: ${third.reference}`, [third.reference],
      `Read ${third.reference} and name one response the passage supports. Make room for listeners whose experience of ${third.topics[0]} is complicated or painful.`,
      "Picture someone taking a modest next step: asking for prayer, offering practical help, or checking in on a neighbor. Choose an example that actually fits this text.",
      "What small step could I take this week? Whose support would help me take it wisely?"]
  ];
  return {
    ...base,
    title: `${titleTheme}: Listening and Responding`,
    scripture: (anchors.length ? anchors : selected).map((verse) => `${verse.reference} (KJV)`).join("; "),
    introduction: `Introduce ${focusTopic} with an honest question your congregation may be carrying. Read ${first.reference} in its setting, then invite people to distinguish what the text says from what they expected it to say.`,
    points: pointRows.map(makePoint),
    closing: "Summarize the connection among the passages in plain language. Invite a quiet moment of prayer and one specific, freely chosen response rooted in the text.",
    prayer: "God, help us hear Scripture humbly and care for one another patiently. Give us wisdom for the next faithful step and courage to take it. Amen."
  };
}

function outlineToText(outline) {
  return [
    outline.title, outline.label, outline.responsibility, outline.notice,
    `Scripture focus\n${outline.scripture}`,
    `Introduction\n${outline.introduction}`,
    ...outline.points.map((point, i) => [
      `${i + 1}. ${point.heading}`, point.citations, `Explanation: ${point.explanation}`,
      `Illustration: ${point.illustration}`, `Application Questions: ${point.questions}`
    ].join("\n")),
    `Closing / Call to Response\n${outline.closing}`,
    `Closing Prayer\n${outline.prayer}`
  ].filter(Boolean).join("\n\n");
}

if (inNode) {
  module.exports = { parseReference, lookupByReference, searchByKeyword, lookupVerses, generateOutline, outlineToText };
} else {
  initializeWorkspace();
}

function initializeWorkspace() {
  const get = (id) => document.getElementById(id);
  const query = get("outline-query");
  const outline = get("outline");
  const outlineStatus = get("outline-status");
  const lookupQuery = get("lookup-query");
  const lookupResults = get("lookup-results");
  let current = null;
  let edits = new Map();

  function add(parent, tag, content, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = content;
    parent.append(element);
    return element;
  }

  function editable(parent, tag, label, key, value, singleLine = false) {
    const field = add(parent, tag, value, "editable");
    field.setAttribute("contenteditable", "plaintext-only");
    field.setAttribute("role", "textbox");
    field.setAttribute("aria-label", label);
    field.setAttribute("aria-multiline", String(!singleLine));
    if (singleLine) {
      field.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.isComposing) event.preventDefault();
      });
    }
    edits.set(key, field);
  }

  function labeledField(parent, label, key, value) {
    add(parent, "p", label, "field-label");
    editable(parent, "div", label, key, value);
  }

  function render(input) {
    current = generateOutline(input);
    edits = new Map();
    outline.replaceChildren();
    add(outline, "p", current.label, "draft-label");
    add(outline, "p", current.responsibility, "responsibility");
    if (current.notice) add(outline, "p", current.notice, "notice");
    add(outline, "p", "Sermon title", "field-label");
    editable(outline, "div", "Sermon title", "title", current.title, true);
    labeledField(outline, "Scripture focus", "scripture", current.scripture);
    labeledField(outline, "Introduction", "introduction", current.introduction);
    const list = add(outline, "ol", "", "points");
    list.setAttribute("aria-label", "Main points");
    current.points.forEach((point, index) => {
      const item = add(list, "li", "", "point");
      add(item, "p", `Main point 0${index + 1}`, "eyebrow");
      editable(item, "div", `Main point ${index + 1} heading`, `${index}-heading`, point.heading, true);
      for (const [key, label] of [
        ["citations", "Scripture citations (KJV)"], ["explanation", "Explanation"],
        ["illustration", "Illustration"], ["questions", "Application Questions"]
      ]) {
        add(item, "p", label, "field-label");
        editable(item, "div", `Main point ${index + 1}: ${label}`, `${index}-${key}`, point[key]);
      }
    });
    labeledField(outline, "Closing / Call to Response", "closing", current.closing);
    labeledField(outline, "Closing Prayer", "prayer", current.prayer);
    outline.hidden = false;
    get("outline-empty").hidden = true;
    get("outline-actions").hidden = false;
    get("review-title").focus();
    outlineStatus.textContent = "Draft ready. Select any outlined field to edit it.";
    outline.addEventListener("input", resetOutlineStatus, { once: true });
  }

  function resetOutlineStatus() {
    outlineStatus.textContent = "";
  }

  function readEdits() {
    const value = (key) => edits.get(key).innerText.trim();
    const updated = { ...current };
    for (const key of ["title", "scripture", "introduction", "closing", "prayer"]) updated[key] = value(key);
    updated.points = current.points.map((point, index) =>
      Object.fromEntries(Object.keys(point).map((key) => [key, value(`${index}-${key}`)]))
    );
    return updated;
  }

  function readQuery(field) {
    const input = field.value.trim();
    if (!input) {
      field.setCustomValidity("Enter a passage or topic.");
      field.reportValidity();
    }
    return input;
  }

  for (const field of [query, lookupQuery]) {
    field.addEventListener("input", () => field.setCustomValidity(""));
  }
  get("outline-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = readQuery(query);
    if (input) render(input);
  });
  for (const button of document.querySelectorAll("[data-example]")) {
    button.addEventListener("click", () => {
      query.value = button.dataset.example;
      query.setCustomValidity("");
      render(query.value);
    });
  }
  get("copy-outline").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const text = outlineToText(readEdits());
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(text);
    } catch {
      const field = add(document.body, "textarea", text, "clipboard-helper");
      field.setAttribute("readonly", "");
      field.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      } finally {
        field.remove();
        button.focus();
      }
      if (!copied) {
        outlineStatus.textContent = "Clipboard unavailable. Select the draft text and copy it manually.";
        return;
      }
    }
    outlineStatus.textContent = "Outline copied.";
    outline.addEventListener("input", resetOutlineStatus, { once: true });
  });
  get("print-outline").addEventListener("click", () => window.print());
  get("clear-outline").addEventListener("click", () => {
    query.value = "";
    query.setCustomValidity("");
    current = null;
    edits.clear();
    outline.replaceChildren();
    outline.hidden = true;
    get("outline-actions").hidden = true;
    get("outline-empty").hidden = false;
    outlineStatus.textContent = "Outline cleared.";
    query.focus();
  });

  get("lookup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = readQuery(lookupQuery);
    if (!input) return;
    const { matches, notice } = lookupVerses(input);
    lookupResults.replaceChildren();
    for (const verse of matches) {
      const item = add(lookupResults, "li", "");
      add(item, "p", `${verse.reference} · KJV`, "verse-reference");
      add(item, "blockquote", verse.text);
    }
    lookupResults.hidden = !matches.length;
    const count = matches.length ? `${matches.length} ${matches.length === 1 ? "verse" : "verses"} found.` : "";
    get("lookup-status").textContent = [count, notice].filter(Boolean).join(" ");
  });
}
})();
