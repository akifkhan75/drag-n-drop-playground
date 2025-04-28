# Drag-and-Drop Playground with Fabric.js

A canvas-based playground where users can drag and drop text, image, and shape elements with full customization capabilities.

## Features

- Add text, images, and shapes (rectangle, circle, triangle) to the canvas
- Fully customize each element's properties:
  - Text: content, font family, size, style (bold, italic, underline), color
  - Images: source URL, dimensions
  - Shapes: dimensions, fill color, stroke color, stroke width
- Move, rotate, and resize elements directly on the canvas
- Adjust opacity for all elements
- Save and load canvas layouts
- Delete selected elements or clear the entire canvas

## Setup

1. Clone this repository or download the files
2. Open `index.html` in a web browser

No server or additional dependencies required (uses jQuery and Fabric.js CDNs).

## Usage

1. **Add Elements**: Click on elements in the left toolbar to add them to the canvas
2. **Select Elements**: Click on canvas elements to select them
3. **Edit Properties**: Adjust properties in the right panel when an element is selected
4. **Interact Directly**:
   - Drag to move
   - Use corner handles to resize
   - Use rotate handle to rotate
   - Double-click text to edit directly
5. **Save/Load**: Use the buttons in the properties panel to save or load layouts
6. **Delete**: Select an element and press Delete key or click the Delete button



## Dependencies

- jQuery (loaded from CDN)
- Fabric.js (loaded from CDN)
