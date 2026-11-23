// Public-domain King James Version, from https://github.com/aruljohn/Bible-kjv.
(function () {
"use strict";

const verses = [
  ["Psalm 23:1", "The LORD is my shepherd; I shall not want.", "comfort,trust,provision"],
  ["Psalm 23:2", "He maketh me to lie down in green pastures: he leadeth me beside the still waters.", "peace,provision,rest"],
  ["Psalm 23:3", "He restoreth my soul: he leadeth me in the paths of righteousness for his name\u2019s sake.", "guidance,restoration"],
  ["Psalm 23:4", "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.", "comfort,suffering,courage"],
  ["Psalm 23:5", "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.", "provision,comfort"],
  ["Psalm 23:6", "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.", "hope,mercy,trust"],
  ["Psalm 46:1", "God is our refuge and strength, a very present help in trouble.", "strength,suffering,comfort"],
  ["Psalm 119:105", "Thy word is a lamp unto my feet, and a light unto my path.", "wisdom,guidance"],
  ["Psalm 118:24", "This is the day which the LORD hath made; we will rejoice and be glad in it.", "joy,gratitude"],
  ["Psalm 103:12", "As far as the east is from the west, so far hath he removed our transgressions from us.", "forgiveness,mercy"],
  ["John 3:16", "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", "love,faith,salvation"],
  ["John 3:17", "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.", "salvation,mercy,love"],
  ["John 13:34", "A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another.", "love,service"],
  ["John 14:27", "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.", "peace,comfort"],
  ["John 15:5", "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing.", "faith,growth,trust"],
  ["Romans 5:1", "Therefore being justified by faith, we have peace with God through our Lord Jesus Christ:", "faith,peace,grace"],
  ["Romans 5:8", "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.", "love,grace,salvation"],
  ["Romans 8:28", "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", "hope,suffering,trust"],
  ["Romans 12:12", "Rejoicing in hope; patient in tribulation; continuing instant in prayer;", "hope,prayer,suffering"],
  ["Romans 15:13", "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.", "hope,joy,peace,faith"],
  ["Ephesians 2:8", "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:", "grace,faith,salvation"],
  ["Ephesians 2:9", "Not of works, lest any man should boast.", "grace,salvation"],
  ["Ephesians 4:32", "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\u2019s sake hath forgiven you.", "forgiveness,kindness,mercy"],
  ["Hebrews 4:16", "Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.", "prayer,mercy,grace"],
  ["Hebrews 11:1", "Now faith is the substance of things hoped for, the evidence of things not seen.", "faith,hope"],
  ["Colossians 3:13", "Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye.", "forgiveness,kindness"],
  ["Colossians 3:15", "And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.", "peace,gratitude"],
  ["1 John 1:9", "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.", "forgiveness,confession,mercy"],
  ["1 John 4:19", "We love him, because he first loved us.", "love,grace"],
  ["Matthew 5:44", "But I say unto you, Love your enemies, bless them that curse you, do good to them that hate you, and pray for them which despitefully use you, and persecute you;", "love,forgiveness,prayer"],
  ["Matthew 6:12", "And forgive us our debts, as we forgive our debtors.", "forgiveness,prayer"],
  ["Matthew 7:7", "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you:", "prayer,trust"],
  ["Matthew 11:28", "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", "rest,comfort,suffering"],
  ["Philippians 4:4", "Rejoice in the Lord alway: and again I say, Rejoice.", "joy,gratitude"],
  ["Philippians 4:6", "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.", "prayer,peace,gratitude"],
  ["Philippians 4:7", "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.", "peace,comfort"],
  ["Philippians 4:13", "I can do all things through Christ which strengtheneth me.", "strength,trust"],
  ["Isaiah 40:31", "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", "hope,strength,patience"],
  ["Isaiah 41:10", "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.", "strength,courage,comfort"],
  ["Proverbs 3:5", "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", "trust,wisdom"],
  ["Proverbs 3:6", "In all thy ways acknowledge him, and he shall direct thy paths.", "guidance,trust"],
  ["James 1:5", "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.", "wisdom,prayer"],
  ["James 1:12", "Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life, which the Lord hath promised to them that love him.", "suffering,patience,hope"],
  ["1 Peter 5:7", "Casting all your care upon him; for he careth for you.", "peace,comfort,trust"],
  ["2 Corinthians 12:9", "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.", "grace,strength,suffering"],
  ["1 Thessalonians 5:16", "Rejoice evermore.", "joy,gratitude"],
  ["1 Thessalonians 5:17", "Pray without ceasing.", "prayer"],
  ["1 Thessalonians 5:18", "In every thing give thanks: for this is the will of God in Christ Jesus concerning you.", "gratitude,joy"],
  ["Micah 6:8", "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?", "mercy,service,wisdom"],
  ["Lamentations 3:22", "It is of the LORD\u2019s mercies that we are not consumed, because his compassions fail not.", "mercy,hope"],
  ["Lamentations 3:23", "They are new every morning: great is thy faithfulness.", "hope,faith"],
].map(([reference, text, topics]) => ({ reference, text, topics: topics.split(",") }));

if (typeof module !== "undefined" && module.exports) {
  module.exports = verses;
} else {
  globalThis.kjvVerses = verses;
}
})();
