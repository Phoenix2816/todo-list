const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');
class Element {
  constructor() { this.children = []; this.attrs = {}; this.value = ''; this.textContent = ''; this.classList = { add() {}, toggle() {} }; }
  set innerHTML(value) { this.children = []; }
  append(...nodes) { this.children.push(...nodes); }
  setAttribute(key, value) { this.attrs[key] = value; }
  focus() {}
  querySelector() { return this.querySelectorAll('button')[0]; }
  querySelectorAll() { return this.children.flatMap(child => [...(child.tag === 'button' ? [child] : []), ...child.querySelectorAll()]); }
}
function setup(stored = '[]', failWrites = false) {
  const nodes = new Map();
  const document = { body: new Element(), getElementById: id => { if (!nodes.has(id)) nodes.set(id, new Element()); return nodes.get(id); }, createElement: tag => Object.assign(new Element(), { tag }) };
  const storage = { todos: stored };
  vm.runInNewContext(readFileSync(require('node:path').join(__dirname, '../script.js'), 'utf8'), { document, localStorage: { getItem: key => storage[key], setItem: (key, value) => { if (failWrites) throw new Error('Storage blocked'); storage[key] = value; } }, prompt: () => null });
  const add = value => { nodes.get('todoInput').value = value; nodes.get('todoForm').onsubmit({ preventDefault() {} }); };
  return { nodes, add, storage };
}
test('whitespace tasks are rejected and normal tasks persist', () => {
  const { nodes, add, storage } = setup(); add('   '); assert.equal(nodes.get('todoList').children.length, 0);
  add('  Ship portfolio  '); assert.equal(JSON.parse(storage.todos)[0].text, 'Ship portfolio');
  assert.equal(nodes.get('emptyState').hidden, true);
  assert.equal(nodes.get('todoList').querySelectorAll()[0].attrs['aria-label'], 'Complete task: Ship portfolio');
});
test('corrupted and incorrectly shaped stored tasks do not crash', () => {
  for (const stored of ['{broken', '{}', '[null,{}, {"text":42}]']) { const { nodes, add } = setup(stored); add('Recovery task'); assert.equal(nodes.get('todoList').children.length, 1); }
});
test('storage failures still allow tasks in memory', () => {
  const { nodes, add } = setup('[]', true); add('Local task'); assert.equal(nodes.get('todoList').children.length, 1); assert.match(nodes.get('taskStatus').textContent, /could not be saved/);
});
