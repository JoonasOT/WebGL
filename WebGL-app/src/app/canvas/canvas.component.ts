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

  @ViewChild("vertexShader")
  vertexS!: ElementRef<HTMLParagraphElement>;

  vertexShader: string = `
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  @ViewChild("fragmentShader")
  fragmentS!: ElementRef<HTMLParagraphElement>;

  fragmentShader: string = `
    precision highp float;

    void main() {
      vec2 col = gl_FragCoord.xy / 500.0;
      col -= 0.5;
      float d = length(col);
      d = sqrt(d);
      gl_FragColor = vec4(d, d, d, 1.0 );
    }
  `;



  ngAfterViewInit() {
    this.vertexS.nativeElement.innerText = this.vertexShader;
    this.fragmentS.nativeElement.innerText = this.fragmentShader;

    if (this.canvas.nativeElement === null) throw new Error("Could not find canvas element");
    const gl = this.canvas?.nativeElement.getContext("webgl");
    if (gl === null) throw new Error("Could not get WebGL context");

    // Creation of vertex shader
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, this.vertexShader);

    // Creation of fragment shader
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, this.fragmentShader);

    // Create a WebGL program
    const shaderProgram = gl.createProgram();
    if (shaderProgram === null) throw new Error("Could not create shader program");

    // Attach shaders to the program
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      gl.deleteProgram(shaderProgram);
      throw new Error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram,
        )}`,
      );
    }

    // Activate the program as part of the rendering pipeline
    gl.useProgram(shaderProgram);

    // Vertices for our square
    const vertices = new Float32Array([
      -0.75,  0.75, // Top left
      -0.75, -0.75, // Bottom left
       0.75, -0.75, // Bottom right
       0.75,  0.75, // Top right
    ]);


    // Verticies must be counter clockwise for visibility!
    const indices = new Uint16Array([
      // Triangle 1 -- Top left, Bottom left, Bottom right
      0, 1, 2,

      // Triangle 2 -- Top left, Bottom right, Top right
      0, 2, 3
    ]);

    // Create vertex buffer and bind it to gl
    const vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Create index buffer and bind it to gl
    const index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      indices,
      gl.STATIC_DRAW
    );

    // Get the location of the `coordinates` attribute of the vertex shader
    const position = gl.getAttribLocation(shaderProgram, "position");
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Step 6: Enable the attribute to receive vertices from the vertex buffer
    gl.enableVertexAttribArray(position);

    // Step 1: Set the viewport for WebGL in the canvas
    gl.viewport(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Step 2: Clear the canvas with gray color
    gl.enable( gl.DEPTH_TEST );
    gl.clearColor(1.0, 1.0, 1.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Step 3: Draw the model on the canvas
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }

  private loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (shader === null) throw new Error("Could not create shader program");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error(`Could not compile ${type} shader: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  }
}
