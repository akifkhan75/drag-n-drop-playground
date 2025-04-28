$(document).ready(function() {
    const canvas = new fabric.Canvas('canvas', {
        selection: true,
        selectionColor: 'rgba(76, 175, 80, 0.3)',
        selectionBorderColor: '#4CAF50',
        selectionLineWidth: 2
    });
    
    canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));
    
    let selectedObject = null;
    
    $('.toolbar-item').on('click', function() {
        const type = $(this).data('type');
        addObjectToCanvas(type);
    });
    
    function addObjectToCanvas(type) {
        let fabricObject;
        const defaultProps = {
            left: 100,
            top: 100,
            fill: '#333333',
            stroke: '#000000',
            strokeWidth: 0,
            selectable: true,
            hasControls: true,
            lockRotation: true
        };
        
        switch(type) {
            case 'text':
                fabricObject = new fabric.IText('Double-click to edit', {
                    ...defaultProps,
                    fontFamily: 'Arial',
                    fontSize: 20,
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    underline: false,
                    width: 150,
                    height: 30
                });
                break;
                
            case 'image':
                fabric.Image.fromURL('https://via.placeholder.com/150', function(img) {
                    img.set({
                        ...defaultProps,
                        scaleX: 1,
                        scaleY: 1,
                        originX: 'center',
                        originY: 'center'
                    });
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    updatePropertiesPanel(img);
                });
                return;
                
            case 'rect':
                fabricObject = new fabric.Rect({
                    ...defaultProps,
                    width: 100,
                    height: 100,
                    fill: '#4CAF50'
                });
                break;
                
            case 'circle':
                fabricObject = new fabric.Circle({
                    ...defaultProps,
                    radius: 50,
                    fill: '#2196F3'
                });
                break;
                
            case 'triangle':
                fabricObject = new fabric.Triangle({
                    ...defaultProps,
                    width: 100,
                    height: 100,
                    fill: '#FF9800'
                });
                break;
        }
        
        if (fabricObject) {
            canvas.add(fabricObject);
            canvas.setActiveObject(fabricObject);
            updatePropertiesPanel(fabricObject);
        }
    }
    
    canvas.on('selection:created', function(e) {
        selectedObject = e.selected[0];
        updatePropertiesPanel(selectedObject);
    });
    
    canvas.on('selection:updated', function(e) {
        selectedObject = e.selected[0];
        updatePropertiesPanel(selectedObject);
    });
    
    canvas.on('selection:cleared', function() {
        selectedObject = null;
        updatePropertiesPanel(null);
    });
    
    function updatePropertiesPanel(obj) {
        const $panel = $('#properties-form');
        
        if (!obj) {
            $panel.html('<p>Select an element to edit its properties</p>');
            return;
        }
        
        let panelHTML = '';
        
        panelHTML += `
            <div class="property-group">
                <label for="obj-left">Position X</label>
                <input type="number" id="obj-left" value="${Math.round(obj.left)}">
            </div>
            <div class="property-group">
                <label for="obj-top">Position Y</label>
                <input type="number" id="obj-top" value="${Math.round(obj.top)}">
            </div>
            <div class="property-group">
                <label for="obj-angle">Rotation (degrees)</label>
                <input type="number" id="obj-angle" value="${Math.round(obj.angle)}" min="0" max="360">
            </div>
            <div class="property-group">
                <label for="obj-opacity">Opacity</label>
                <input type="range" id="obj-opacity" min="0" max="1" step="0.1" value="${obj.opacity}">
                <span>${obj.opacity}</span>
            </div>
        `;
        
        if (obj.type === 'text' || obj.type === 'i-text') {
            panelHTML += `
                <div class="property-group">
                    <label for="text-content">Text Content</label>
                    <textarea id="text-content">${obj.text}</textarea>
                </div>
                <div class="property-group">
                    <label for="text-fontFamily">Font Family</label>
                    <select id="text-fontFamily">
                        <option value="Arial" ${obj.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                        <option value="Verdana" ${obj.fontFamily === 'Verdana' ? 'selected' : ''}>Verdana</option>
                        <option value="Times New Roman" ${obj.fontFamily === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
                        <option value="Courier New" ${obj.fontFamily === 'Courier New' ? 'selected' : ''}>Courier New</option>
                        <option value="Georgia" ${obj.fontFamily === 'Georgia' ? 'selected' : ''}>Georgia</option>
                    </select>
                </div>
                <div class="property-group">
                    <label for="text-fontSize">Font Size</label>
                    <input type="number" id="text-fontSize" value="${obj.fontSize}">
                </div>
                <div class="property-group">
                    <label for="text-fill">Text Color</label>
                    <input type="color" id="text-fill" value="${obj.fill}">
                </div>
                <div class="property-group checkboxes">
                    <label>
                        <input type="checkbox" id="text-bold" ${obj.fontWeight === 'bold' ? 'checked' : ''}> Bold
                    </label>
                    <label>
                        <input type="checkbox" id="text-italic" ${obj.fontStyle === 'italic' ? 'checked' : ''}> Italic
                    </label>
                    <label>
                        <input type="checkbox" id="text-underline" ${obj.underline ? 'checked' : ''}> Underline
                    </label>
                </div>
            `;
        }
        else if (obj.type === 'image') {
            panelHTML += `
                <div class="property-group">
                    <label for="image-src">Image URL</label>
                    <input type="text" id="image-src" value="${obj._element ? obj._element.src : ''}">
                </div>
                <div class="property-group">
                    <label for="image-width">Width</label>
                    <input type="number" id="image-width" value="${Math.round(obj.width * obj.scaleX)}">
                </div>
                <div class="property-group">
                    <label for="image-height">Height</label>
                    <input type="number" id="image-height" value="${Math.round(obj.height * obj.scaleY)}">
                </div>
            `;
        }
        else if (obj.type === 'rect' || obj.type === 'triangle') {
            panelHTML += `
                <div class="property-group">
                    <label for="shape-width">Width</label>
                    <input type="number" id="shape-width" value="${Math.round(obj.width)}">
                </div>
                <div class="property-group">
                    <label for="shape-height">Height</label>
                    <input type="number" id="shape-height" value="${Math.round(obj.height)}">
                </div>
                <div class="property-group">
                    <label for="shape-fill">Fill Color</label>
                    <input type="color" id="shape-fill" value="${obj.fill}">
                </div>
                <div class="property-group">
                    <label for="shape-stroke">Stroke Color</label>
                    <input type="color" id="shape-stroke" value="${obj.stroke}">
                </div>
                <div class="property-group">
                    <label for="shape-strokeWidth">Stroke Width</label>
                    <input type="number" id="shape-strokeWidth" value="${obj.strokeWidth}" min="0">
                </div>
            `;
        }
        else if (obj.type === 'circle') {
            panelHTML += `
                <div class="property-group">
                    <label for="circle-radius">Radius</label>
                    <input type="number" id="circle-radius" value="${Math.round(obj.radius)}">
                </div>
                <div class="property-group">
                    <label for="circle-fill">Fill Color</label>
                    <input type="color" id="circle-fill" value="${obj.fill}">
                </div>
                <div class="property-group">
                    <label for="circle-stroke">Stroke Color</label>
                    <input type="color" id="circle-stroke" value="${obj.stroke}">
                </div>
                <div class="property-group">
                    <label for="circle-strokeWidth">Stroke Width</label>
                    <input type="number" id="circle-strokeWidth" value="${obj.strokeWidth}" min="0">
                </div>
            `;
        }
        
        $panel.html(panelHTML);
        
        $('#obj-left, #obj-top').on('change', function() {
            obj.set({
                left: parseInt($('#obj-left').val()),
                top: parseInt($('#obj-top').val())
            });
            canvas.renderAll();
        });
        
        $('#obj-angle').on('change', function() {
            obj.set('angle', parseInt($(this).val()));
            canvas.renderAll();
        });
        
        $('#obj-opacity').on('input', function() {
            const opacity = parseFloat($(this).val());
            obj.set('opacity', opacity);
            $(this).next('span').text(opacity);
            canvas.renderAll();
        });
        
        if (obj.type === 'text' || obj.type === 'i-text') {
            $('#text-content').on('change', function() {
                obj.set('text', $(this).val());
                canvas.renderAll();
            });
            
            $('#text-fontFamily').on('change', function() {
                obj.set('fontFamily', $(this).val());
                canvas.renderAll();
            });
            
            $('#text-fontSize').on('change', function() {
                obj.set('fontSize', parseInt($(this).val()));
                canvas.renderAll();
            });
            
            $('#text-fill').on('change', function() {
                obj.set('fill', $(this).val());
                canvas.renderAll();
            });
            
            $('#text-bold').on('change', function() {
                obj.set('fontWeight', $(this).is(':checked') ? 'bold' : 'normal');
                canvas.renderAll();
            });
            
            $('#text-italic').on('change', function() {
                obj.set('fontStyle', $(this).is(':checked') ? 'italic' : 'normal');
                canvas.renderAll();
            });
            
            $('#text-underline').on('change', function() {
                obj.set('underline', $(this).is(':checked'));
                canvas.renderAll();
            });
        }
        else if (obj.type === 'image') {
            $('#image-src').on('change', function() {
                const src = $(this).val();
                if (src) {
                    fabric.Image.fromURL(src, function(newImg) {
                        newImg.set({
                            left: obj.left,
                            top: obj.top,
                            angle: obj.angle,
                            opacity: obj.opacity,
                            scaleX: obj.scaleX,
                            scaleY: obj.scaleY
                        });
                        canvas.remove(obj);
                        canvas.add(newImg);
                        canvas.setActiveObject(newImg);
                        updatePropertiesPanel(newImg);
                    });
                }
            });
            
            $('#image-width').on('change', function() {
                const newWidth = parseInt($(this).val());
                const scale = newWidth / obj.width;
                obj.set('scaleX', scale);
                canvas.renderAll();
            });
            
            $('#image-height').on('change', function() {
                const newHeight = parseInt($(this).val());
                const scale = newHeight / obj.height;
                obj.set('scaleY', scale);
                canvas.renderAll();
            });
        }
        else if (obj.type === 'rect' || obj.type === 'triangle') {
            $('#shape-width').on('change', function() {
                obj.set('width', parseInt($(this).val()));
                canvas.renderAll();
            });
            
            $('#shape-height').on('change', function() {
                obj.set('height', parseInt($(this).val()));
                canvas.renderAll();
            });
            
            $('#shape-fill').on('change', function() {
                obj.set('fill', $(this).val());
                canvas.renderAll();
            });
            
            $('#shape-stroke').on('change', function() {
                obj.set('stroke', $(this).val());
                canvas.renderAll();
            });
            
            $('#shape-strokeWidth').on('change', function() {
                obj.set('strokeWidth', parseInt($(this).val()));
                canvas.renderAll();
            });
        }
        else if (obj.type === 'circle') {
            $('#circle-radius').on('change', function() {
                obj.set('radius', parseInt($(this).val()));
                canvas.renderAll();
            });
            
            $('#circle-fill').on('change', function() {
                obj.set('fill', $(this).val());
                canvas.renderAll();
            });
            
            $('#circle-stroke').on('change', function() {
                obj.set('stroke', $(this).val());
                canvas.renderAll();
            });
            
            $('#circle-strokeWidth').on('change', function() {
                obj.set('strokeWidth', parseInt($(this).val()));
                canvas.renderAll();
            });
        }
    }
    
    $('#save-btn').on('click', function() {
        const canvasData = JSON.stringify(canvas);
        localStorage.setItem('canvasState', canvasData);
        alert('Canvas state saved!');
    });
    
    $('#load-btn').on('click', function() {
        const savedData = localStorage.getItem('canvasState');
        if (savedData) {
            canvas.clear();
            canvas.loadFromJSON(savedData, function() {
                canvas.renderAll();
                alert('Canvas state loaded!');
            });
        } else {
            alert('No saved state found');
        }
    });
    
    $('#clear-btn').on('click', function() {
        if (confirm('Are you sure you want to clear the canvas?')) {
            canvas.clear();
        }
    });
    
    $('#delete-btn').on('click', function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
    });
});