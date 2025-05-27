import { deserializeHTML } from './SlateEditorWithHighlightAndImage';

// Mock aliased uploadFileAPI import
jest.mock('../../apis/file', () => ({ uploadFileAPI: jest.fn() }));

describe('deserializeHTML', () => {
    it('should parse a paragraph with mixed text and bold', () => {
        const html = '<p>你好<strong>世界</strong></p>';
        const nodes = deserializeHTML(html);
        expect(nodes).toEqual([
            {
                type: 'paragraph',
                children: [
                    { text: '你好' },
                    { text: '世界', bold: true }
                ]
            }
        ]);
    });

    it('should parse code block', () => {
        const html = '<pre><code>console.log("hi");</code></pre>';
        const nodes = deserializeHTML(html);
        expect(nodes).toEqual([
            {
                type: 'code-block',
                children: [
                    { text: 'console.log("hi");' }
                ]
            }
        ]);
    });

    it('should parse lists', () => {
        const html = '<ul><li>一</li><li>二</li></ul>';
        const nodes = deserializeHTML(html);
        expect(nodes).toEqual([
            {
                type: 'bulleted-list',
                children: [
                    { type: 'list-item', children: [{ text: '一' }] },
                    { type: 'list-item', children: [{ text: '二' }] }
                ]
            }
        ]);
    });

    it('should parse image', () => {
        const html = '<p><img src="http://img.png"/></p>';
        const nodes = deserializeHTML(html);
        expect(nodes).toEqual([
            {
                type: 'paragraph',
                children: [
                    { type: 'image', url: 'http://img.png', children: [{ text: '' }] }
                ]
            }
        ]);
    });
});
