const { test } = require("node:test");
const assert = require("node:assert/strict");
const verses = require("../data/verses.js");
const { parseReference, lookupByReference, searchByKeyword, lookupVerses, generateOutline, outlineToText } = require("../app.js");

test("parses full books, abbreviations, chapters, verses, and ranges", () => {
  assert.deepEqual(parseReference("  jOhN 3:16–17 "), { book: "John", chapter: 3, start: 16, end: 17 });
  assert.deepEqual(parseReference("Psalms 23"), { book: "Psalm", chapter: 23, start: null, end: null });
  assert.deepEqual(parseReference("Ps. 23:1"), { book: "Psalm", chapter: 23, start: 1, end: 1 });
  for (const input of ["1 John 1:9", "1 Jn 1:9"]) {
    assert.deepEqual(parseReference(input), { book: "1 John", chapter: 1, start: 9, end: 9 });
  }
  for (const bad of ["hope", "John 0:16", "John 3:0", "John 3:17-16", "John 3:16-", "Other 3:16"]) {
    assert.equal(parseReference(bad), null, bad);
  }
});

test("finds exact KJV text, chapter verses, and inclusive ranges", () => {
  assert.deepEqual(lookupByReference("John 3:16").map((verse) => verse.text), [
    "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
  ]);
  assert.deepEqual(lookupByReference("John 3:16-17").map((verse) => verse.reference), ["John 3:16", "John 3:17"]);
  assert.deepEqual(lookupByReference("Psalm 23").map((verse) => verse.reference),
    [1, 2, 3, 4, 5, 6].map((n) => `Psalm 23:${n}`));
  assert.deepEqual(lookupByReference("Mark 1:1"), []);
  assert.match(lookupVerses("John 3:15–17").notice, /Only the verses/);
  assert.equal(lookupVerses("Psalm 23").notice, "");
});

test("searches topic tags, synonyms, combinations, and verse words", () => {
  assert.ok(searchByKeyword("HOPE").some((verse) => verse.reference === "Romans 15:13"));
  assert.ok(searchByKeyword("Forgive").some((verse) => verse.reference === "Ephesians 4:32"));
  assert.ok(searchByKeyword("hope in suffering")[0].topics.includes("suffering"));
  assert.equal(searchByKeyword("shepherd")[0].reference, "Psalm 23:1");
  assert.deepEqual(searchByKeyword("unmatchableword"), []);
});

test("produces deterministic three-point drafts with exact dataset citations for every input", () => {
  const available = new Set(verses.map(({ reference, text }) => `${reference} (KJV) — “${text}”`));
  assert.ok(available.size >= 40);
  for (const input of ["John 3:16", "John 3:16–17", "Psalm 23", "forgiveness", "Romans 8:28", "hope in suffering", "peace", "shepherd", "Mark 1:1", "unmatchableword", ""]) {
    const outline = generateOutline(input);
    assert.deepEqual(outline, generateOutline(input));
    for (const field of ["title", "scripture", "introduction", "closing", "prayer"]) assert.ok(outline[field], field);
    assert.equal(outline.points.length, 3);
    const used = new Set();
    for (const point of outline.points) {
      for (const field of ["heading", "explanation", "illustration", "questions"]) assert.ok(point[field], field);
      assert.ok(point.citations);
      for (const citation of point.citations.split("\n")) {
        assert.ok(available.has(citation), citation);
        assert.ok(!used.has(citation), citation);
        used.add(citation);
      }
    }
    const exported = outlineToText(outline);
    assert.match(exported, /AI-assisted draft — review, pray over, and edit before preaching/);
    assert.match(exported, /You remain responsible/);
    assert.match(exported, /Closing Prayer/);
  }
  assert.match(generateOutline("Mark 1:1").notice, /grace, hope, and love instead/);
  assert.match(generateOutline("Romans 8:28").scripture, /^Romans 8:28/);
  assert.match(generateOutline("forgiveness").points[0].citations, /1 John 1:9/);
});
