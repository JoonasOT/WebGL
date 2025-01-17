import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  @ViewChild("mainCanvas")
  canvas!: ElementRef<HTMLCanvasElement>;

  vertexShader: string = `
    attribute vec2 coordinates;

    void main(void) {
      gl_Position = vec4(coordinates, 0.0, 1.0);
    }
  `;

  fragmentShader: string = `
    void main(void) {
      gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
    }
  `;

  ngAfterViewInit() {
    if (this.canvas.nativeElement === null) throw new Error("Could not find canvas element");
    const gl = this.canvas?.nativeElement.getContext("webgl");
    if (gl === null) throw new Error("Could not get WebGL context");

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);

    if (vertexShader === null)
      throw new Error("Could not establish vertex shader"); // handle possibility of null

    // Step 2: Write the vertex shader code
    const vertexShaderCode = this.vertexShader;

    // Step 3: Attach the shader code to the vertex shader
    gl.shaderSource(vertexShader, vertexShaderCode);

    // Step 4: Compile the vertex shader
    gl.compileShader(vertexShader);

    // Step 1: Create a fragment shader object
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (fragmentShader === null)
      throw new Error("Could not establish fragment shader"); // handle possibility of null

    // Step 2: Write the fragment shader code
    const fragmentShaderCode = this.fragmentShader;

    // Step 3: Attach the shader code to the fragment shader
    gl.shaderSource(fragmentShader, fragmentShaderCode);

    // Step 4: Compile the fragment shader
    gl.compileShader(fragmentShader);

    // Step 1: Create a WebGL program instance
    const shaderProgram = gl.createProgram();
    if (shaderProgram === null) throw new Error("Could not create shader program");

    // Step 2: Attach the vertex and fragment shaders to the program
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Step 3: Activate the program as part of the rendering pipeline
    gl.useProgram(shaderProgram);

    // Step 1: Initialize the array of vertices for our triangle
    const vertices = new Float32Array([
      -0.75,  0.75,
      -0.75, -0.75,
       0.75, -0.75,
       0.75,  0.75,
    ]);

    const indices = new Uint16Array([
      // Triangle 1
      0, 1, 2,
      
      // Triangle 2
      0, 2, 3
    ]);

    // Step 2: Create a new buffer object
    const vertex_buffer = gl.createBuffer();

    // Step 3: Bind the object to `gl.ARRAY_BUFFER`
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Step 4: Pass the array of vertices to `gl.ARRAY_BUFFER
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Step 1: Create a new buffer object
    const index_buffer = gl.createBuffer();

    // Step 2: Bind the buffer object to `gl.ELEMENT_ARRAY_BUFFER`
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

    // Step 3: Pass the buffer data to `gl.ELEMENT_ARRAY_BUFFER`
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      indices,
      gl.STATIC_DRAW
    );

    // Step 5: Get the location of the `coordinates` attribute of the vertex shader
    const coordinates = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coordinates, 2, gl.FLOAT, false, 0, 0);

    // Step 6: Enable the attribute to receive vertices from the vertex buffer
    gl.enableVertexAttribArray(coordinates);

    // Step 1: Set the viewport for WebGL in the canvas
    gl.viewport(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Step 2: Clear the canvas with gray color
    gl.clearColor(1.0, 1.0, 1.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Step 3: Draw the model on the canvas
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }

  constructor() {
    
  }
}
